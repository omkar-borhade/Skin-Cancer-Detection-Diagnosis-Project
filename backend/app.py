import logging
from dotenv import load_dotenv
import os
import cv2
import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import time
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables for model paths
SKIN_NORMAL_OR_NOT_MODEL_PATH = os.getenv('SKIN_NORMAL_OR_NOT')
DIAGNOSIS_MODEL_PATH = os.getenv('DIAGNOSIS_MODEL')

# Class names for diagnosis
class_names = [
    'Actinic Keratoses',  # akic
    'Basal Cell Carcinoma',  # bcc
    'Benign Keratosis-like Lesions',  # bkl
    'Dermatofibroma',  # df
    'Melanoma',  # mel
    'Melanocytic Nevi',  # nv
    'Vascular Lesions', # vsc
    'Normal Skin'
]

# Category mapping for cancer classification
categories = {
    'Actinic Keratoses': 'Pre-cancerous',
    'Basal Cell Carcinoma': 'Cancerous',
    'Benign Keratosis-like Lesions': 'Non-cancerous',
    'Dermatofibroma': 'Non-cancerous',
    'Melanoma': 'Cancerous',
    'Melanocytic Nevi': 'Non-cancerous',
    'Vascular Lesions': 'Non-cancerous',
    'Normal Skin': 'Healthy',
}

# Load models
try:
    skin_normal_model = load_model(SKIN_NORMAL_OR_NOT_MODEL_PATH)
    logger.info("Skin normal/cancerous model loaded successfully.")
    diagnosis_model = load_model(DIAGNOSIS_MODEL_PATH)
    logger.info("Diagnosis model loaded successfully.")
except Exception as e:
    logger.error(f"Error loading models: {e}")
    skin_normal_model = None
    diagnosis_model = None

# Directories and allowed file extensions
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Image validation functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def is_valid_image(image_path):
    try:
        image = cv2.imread(image_path)
        if image is None:
            return False
        return True
    except Exception as e:
        logger.error(f"Invalid image content: {e}")
        return False

# Image preprocessing
def preprocess_image(image_path, target_size=(128, 128)):
    try:
        image = load_img(image_path, target_size=target_size)
        image = img_to_array(image) / 255.0
        image = np.expand_dims(image, axis=0)
        return image
    except Exception as e:
        logger.error(f"Error during image preprocessing: {e}")
        raise

# Hair removal function
def remove_hair(image_path):
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Invalid image path or format.")
        
        original_image = image.copy()
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (17, 17))
        blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)
        _, hair_mask = cv2.threshold(blackhat, 10, 255, cv2.THRESH_BINARY)
        inpainted_image = cv2.inpaint(image, hair_mask, inpaintRadius=3, flags=cv2.INPAINT_NS)
        
        if np.array_equal(original_image, inpainted_image):
            return None
        return inpainted_image
    except Exception as e:
        logger.error(f"Error during hair removal: {e}")
        raise

# Prediction functions
def predict_skin_normal_or_cancerous(image_path):
    if skin_normal_model is None:
        return {"error": "Skin normal/cancerous model not loaded."}
    try:
        image = preprocess_image(image_path, target_size=(128, 128))
        prediction = skin_normal_model.predict(image)
        return "Cancerous" if prediction[0] < 0.5 else "Normal"
    except Exception as e:
        logger.error(f"Error during normal/cancerous prediction: {e}")
        return {"error": "There was an issue during the normal/cancerous prediction."}

def predict_diagnosis(image_path):
    if diagnosis_model is None:
        return {"error": "Diagnosis model not loaded."}
    try:
        image = preprocess_image(image_path, target_size=(64, 64))
        start_time = time.time()
        prediction = diagnosis_model.predict(image)[0]
        inference_time = time.time() - start_time
        logger.info(f"Inference completed in {inference_time:.2f} seconds.")
        
        predicted_class = np.argmax(prediction, axis=0)
        probabilities = prediction
        predicted_class_name = class_names[predicted_class]
        predicted_category = categories.get(predicted_class_name, "Unknown")

        result = {
            "predicted_class": predicted_class_name,
            "category": predicted_category,
            "probabilities": {class_names[i]: float(prob) for i, prob in enumerate(probabilities)},
            "inference_time": round(inference_time, 2)
        }
        return result
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        return {"error": "There was an issue during prediction."}

# Asynchronous image processing with ThreadPoolExecutor
executor = ThreadPoolExecutor(max_workers=4)

# API Endpoint for patient data submission
@app.route('/submit_patient_data', methods=['POST'])
def submit_patient_data():
    data = request.get_json()
    skin_images = data.get('skinImages', [])
    
    if not skin_images:
        return jsonify({'message': 'No files received'}), 400

    predictions = []
    for file_info in skin_images:
        file_path = file_info['path']
        filename = file_info['originalname']
        
        if not os.path.exists(file_path) or not allowed_file(filename) or not is_valid_image(file_path):
            logger.warning(f"Invalid file or image content for {filename}.")
            return jsonify({'message': f'Invalid image file content for {filename}'}), 400
        
        try:
            processed_image = remove_hair(file_path)
            if processed_image is None:
                processed_image = cv2.imread(file_path)
        except Exception as e:
            logger.error(f"Error processing file {filename}: {e}")
            return jsonify({'message': f'Error processing file {filename}: {e}'}), 500

        # Prediction logic (cancerous check first)
        skin_status = predict_skin_normal_or_cancerous(file_path)
        
        if skin_status == "Cancerous":
            result = predict_diagnosis(file_path)
        else:
            predicted_class_name = 'Normal Skin'
            predicted_category = categories.get(predicted_class_name, "Unknown")
            probabilities = {class_name: 0.0 for class_name in class_names}
            probabilities['Normal Skin'] = 1.0  # Set Normal Skin to 100%
            result = {
                "predicted_class": predicted_class_name,
                "category": predicted_category,
                "probabilities": probabilities,
                "inference_time": 0.0
            }

        predictions.append({
            "file": filename,
            "result": result
        })

    return jsonify({
        'message': 'Patient data processed successfully',
        'predictions': predictions
    }), 200



if __name__ == '__main__':
    # Get the port from the environment, default to 5000 if not set
    port = int(os.getenv('FLASK_PORT', 5001))  # Default to 5001 if FLASK_PORT is not defined
    app.run(debug=True, port=port)



