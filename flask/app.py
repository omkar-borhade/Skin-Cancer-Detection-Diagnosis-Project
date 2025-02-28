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
import requests
import tempfile
app = Flask(__name__)
load_dotenv()


os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppresses warnings (info and debug messages remain)

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
        start_time = time.time()
        image = load_img(image_path, target_size=target_size)
        image = img_to_array(image) / 255.0
        image = np.expand_dims(image, axis=0)
        logger.info(f"Image preprocessing time: {time.time() - start_time:.2f} seconds")
        return image
    except Exception as e:
        logger.error(f"Error during image preprocessing: {e}")
        raise

# Hair removal function
def remove_hair(image_path):
    try:
        start_time = time.time()
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Invalid image path or format.")
        
        original_image = image.copy()
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (17, 17))
        blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)
        _, hair_mask = cv2.threshold(blackhat, 10, 255, cv2.THRESH_BINARY)
        inpainted_image = cv2.inpaint(image, hair_mask, inpaintRadius=3, flags=cv2.INPAINT_NS)
        
        logger.info(f"Hair removal time: {time.time() - start_time:.2f} seconds")
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
        start_time = time.time()
        image = preprocess_image(image_path, target_size=(128, 128))
        prediction = skin_normal_model.predict(image)
        logger.info(f"Skin normal/cancerous prediction time: {time.time() - start_time:.2f} seconds")
        return "Cancerous" if prediction[0] < 0.5 else "Normal"
    except Exception as e:
        logger.error(f"Error during normal/cancerous prediction: {e}")
        return {"error": "There was an issue during the normal/cancerous prediction."}

def predict_diagnosis(image_path):
    if diagnosis_model is None:
        return {"error": "Diagnosis model not loaded."}
    try:
        start_time = time.time()
        image = preprocess_image(image_path, target_size=(64, 64))
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

@app.route('/')
def home():
    return "Hello, Flask is running!"
# Asynchronous image processing with ThreadPoolExecutor
executor = ThreadPoolExecutor(max_workers=4)
@app.route('/submit_patient_data', methods=['POST'])
def submit_patient_data():
    data = request.get_json()
    skin_images = data.get('skinImages', [])

    if not skin_images:
        return jsonify({'message': 'No files received'}), 400

    predictions = []
    for file_info in skin_images:
        file_url = file_info['url']
        filename = file_info['originalname']

        try:
            # Download the image from the URL
            start_time = time.time()
            response = requests.get(file_url, stream=True)
            if response.status_code != 200:
                return jsonify({'message': f'Failed to download image {filename}'}), 400
            logger.info(f"Image download time: {time.time() - start_time:.2f} seconds")

            # Save the image to a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
                temp_file.write(response.content)
                temp_file_path = temp_file.name

            if not allowed_file(filename) or not is_valid_image(temp_file_path):
                logger.warning(f"Invalid file or image content for {filename}.")
                return jsonify({'message': f'Invalid image file content for {filename}'}), 400

            # First, predict if the skin is cancerous or normal
            skin_status = predict_skin_normal_or_cancerous(temp_file_path)

            # If cancerous, apply hair removal and diagnosis
            if skin_status == "Cancerous":
                try:
                    # Perform hair removal for cancerous images
                    start_time = time.time()
                    processed_image = remove_hair(temp_file_path)
                    logger.info(f"Hair removal time for {filename}: {time.time() - start_time:.2f} seconds")

                    if processed_image is None:
                        processed_image = cv2.imread(temp_file_path)

                    # Now, perform the diagnosis with the processed image
                    result = predict_diagnosis(temp_file_path)
                except Exception as e:
                    logger.error(f"Error processing file {filename}: {e}")
                    return jsonify({'message': f'Error processing file {filename}: {e}'}), 500
            else:
                # If normal, no need to apply hair removal, just return normal result
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

        finally:
            # Clean up the temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    return jsonify({
        'message': 'Patient data processed successfully',
        'predictions': predictions
    }), 200



