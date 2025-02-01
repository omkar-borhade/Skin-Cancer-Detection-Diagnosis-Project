import logging
from dotenv import load_dotenv
import os
import cv2
import numpy as np
import requests
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from PIL import Image

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
    'Actinic Keratoses', 'Basal Cell Carcinoma', 'Benign Keratosis-like Lesions',
    'Dermatofibroma', 'Melanoma', 'Melanocytic Nevi', 'Vascular Lesions', 'Normal Skin'
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
    exit(1)  # Exit the application if models fail to load

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Image validation
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def is_valid_image(image_path):
    try:
        image = cv2.imread(image_path)
        return image is not None
    except Exception as e:
        logger.error(f"Invalid image content: {e}")
        return False

# Image preprocessing
def preprocess_image(image_path, target_size=(128, 128)):
    try:
        image = load_img(image_path, target_size=target_size)
        image = image.convert('RGB')  # Ensure RGB format
        image = img_to_array(image) / 255.0
        image = np.expand_dims(image, axis=0)
        return image
    except Exception as e:
        logger.error(f"Error during image preprocessing: {e}")
        return None

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

        return inpainted_image if not np.array_equal(original_image, inpainted_image) else None
    except Exception as e:
        logger.error(f"Error during hair removal: {e}")
        return None

# Prediction functions
def predict_skin_normal_or_cancerous(image_path):
    if skin_normal_model is None:
        return {"error": "Skin normal/cancerous model not loaded."}
    try:
        image = preprocess_image(image_path, target_size=(128, 128))
        if image is None:
            return {"error": "Image preprocessing failed."}

        prediction = skin_normal_model.predict(image)
        return "Cancerous" if prediction[0] < 0.5 else "Normal"
    except Exception as e:
        logger.error(f"Error during normal/cancerous prediction: {e}")
        return {"error": "Prediction error."}

def predict_diagnosis(image_path):
    if diagnosis_model is None:
        return {"error": "Diagnosis model not loaded."}
    try:
        image = preprocess_image(image_path, target_size=(64, 64))
        if image is None:
            return {"error": "Image preprocessing failed."}

        start_time = time.time()
        prediction = diagnosis_model.predict(image)[0]
        inference_time = time.time() - start_time
        logger.info(f"Inference completed in {inference_time:.2f} seconds.")

        predicted_class = np.argmax(prediction, axis=0)
        predicted_class_name = class_names[predicted_class]
        predicted_category = categories.get(predicted_class_name, "Unknown")

        return {
            "predicted_class": predicted_class_name,
            "category": predicted_category,
            "probabilities": {class_names[i]: float(prob) for i, prob in enumerate(prediction)},
            "inference_time": round(inference_time, 2)
        }
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        return {"error": "Prediction error."}

# Thread pool for parallel processing
executor = ThreadPoolExecutor(max_workers=4)

@app.route('/submit_patient_data', methods=['POST'])
def submit_patient_data():
    data = request.get_json()
    skin_images = data.get('skinImages', [])

    if not skin_images:
        return jsonify({'message': 'No files received'}), 400

    predictions = []

    def process_image(file_info):
        file_url = file_info['url']
        filename = file_info['originalname']

        try:
            response = requests.get(file_url, stream=True)
            if response.status_code != 200:
                return {'message': f'Failed to download image {filename}'}, 400

            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
                temp_file.write(response.content)
                temp_file_path = temp_file.name

            if not allowed_file(filename) or not is_valid_image(temp_file_path):
                return {'message': f'Invalid image file content for {filename}'}, 400

            processed_image = remove_hair(temp_file_path)
            if processed_image is None:
                processed_image = cv2.imread(temp_file_path)

            skin_status = predict_skin_normal_or_cancerous(temp_file_path)

            if skin_status == "Cancerous":
                result = predict_diagnosis(temp_file_path)
            else:
                result = {
                    "predicted_class": "Normal Skin",
                    "category": categories["Normal Skin"],
                    "probabilities": {class_name: 0.0 for class_name in class_names},
                    "inference_time": 0.0
                }
                result["probabilities"]["Normal Skin"] = 1.0  # 100% confidence for normal skin

            return {"file": filename, "result": result}
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    # Run parallel processing
    results = list(executor.map(process_image, skin_images))
    predictions.extend(results)

    return jsonify({'message': 'Patient data processed successfully', 'predictions': predictions}), 200

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    app.run(debug=True, port=port)




# import logging
# from dotenv import load_dotenv
# import os
# import cv2
# import numpy as np
# from flask import Flask, request, jsonify
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing.image import load_img, img_to_array
# import time

# app = Flask(__name__)
# load_dotenv()

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# MODEL_PATH = os.getenv('DIAGNOSIS_MODEL')  # modal is here.h5 file

# # Define class names (Update this according to your model's output classes)
# class_names = [
#     'Actinic Keratoses',  # akic
#     'Basal Cell Carcinoma',  # bcc
#     'Benign Keratosis-like Lesions',  # bkl
#     'Dermatofibroma',  # df
#     'Melanoma',  # mel
#     'Melanocytic Nevi',  # nv
#     'Vascular Lesions'  # vsc
# ]

# # Define the categories for each class
# categories = {
#     'Actinic Keratoses': 'Pre-cancerous',  # akic
#     'Basal Cell Carcinoma': 'Cancerous',  # bcc
#     'Benign Keratosis-like Lesions': 'Non-cancerous',  # bkl
#     'Dermatofibroma': 'Non-cancerous',  # df
#     'Melanoma': 'Cancerous',  # mel
#     'Melanocytic Nevi': 'Non-cancerous',  # nv
#     'Vascular Lesions': 'Non-cancerous'  # vsc
# }

# # Load the pre-trained model
# try:
#     if MODEL_PATH and os.path.exists(MODEL_PATH):
#         model = load_model(MODEL_PATH)
#         logger.info("Model loaded successfully.")
#     else:
#         raise FileNotFoundError(f"Model file not found at path: {MODEL_PATH}")
# except Exception as e:
#     logger.error(f"Error loading model: {e}")
#     model = None

# # Directory to save uploaded images (we'll overwrite this image with every new upload)
# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # Allowed image extensions
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# def allowed_file(filename):
#     """Check if the uploaded file has an allowed extension."""
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def is_valid_image(image_path):
#     """Validate image file content."""
#     try:
#         image = cv2.imread(image_path)
#         if image is None:
#             return False
#         return True
#     except Exception as e:
#         logger.error(f"Invalid image content: {e}")
#         return False

# def preprocess_image(image_path):
#     """Preprocess the image for prediction."""
#     try:
#         image = load_img(image_path, target_size=(64, 64))  # Resize to model's input size
#         image = img_to_array(image) / 255.0  # Normalize pixel values
#         image = np.expand_dims(image, axis=0)  # Add batch dimension
#         return image
#     except Exception as e:
#         logger.error(f"Error during image preprocessing: {e}")
#         raise

# def remove_hair(image_path):
#     """Remove hair from the image without blurring."""
#     try:
#         image = cv2.imread(image_path)
#         if image is None:
#             raise ValueError("Invalid image path or format.")

#         original_image = image.copy()  # Keep the original image for comparison

#         # Convert the image to grayscale
#         gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#         # Detect hair using morphological operations
#         kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (17, 17))
#         blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)

#         # Threshold the blackhat image to create a mask for hair regions
#         _, hair_mask = cv2.threshold(blackhat, 10, 255, cv2.THRESH_BINARY)

#         # Inpaint the detected hair regions with minimal blur
#         inpainted_image = cv2.inpaint(image, hair_mask, inpaintRadius=3, flags=cv2.INPAINT_NS)  # Use Navier-Stokes inpainting

#         # Compare if the processed image is different from the original image
#         if np.array_equal(original_image, inpainted_image):
#             return None  # No change, return None to indicate no modification

#         # Return the modified image directly without saving
#         return inpainted_image  # Return the inpainted image directly
#     except Exception as e:
#         logger.error(f"Error during hair removal: {e}")
#         raise

# def predict(image_path):
#     """Perform prediction on the provided image."""
#     if not os.path.exists(image_path):
#         return {"error": "Image file not found."}

#     if model is None:
#         return {"error": "Model not loaded properly."}

#     try:
#         # Preprocess the image
#         image = preprocess_image(image_path)

#         # Perform prediction
#         start_time = time.time()
#         prediction = model.predict(image)[0]  # Prediction is a list of probabilities
#         inference_time = time.time() - start_time

#         # Log inference time
#         logger.info(f"Inference completed in {inference_time:.2f} seconds.")

#         predicted_class = np.argmax(prediction, axis=0)  # Index of the highest probability

#         probabilities = prediction  # All class probabilities
#         predicted_class_name = class_names[predicted_class]
#         predicted_category = categories.get(predicted_class_name, "Unknown")

#         result = {
#             "predicted_class": predicted_class_name,
#             "category": predicted_category,  # Add the cancer classification category
#             "probabilities": {class_names[i]: float(prob) for i, prob in enumerate(probabilities)},
#             "inference_time": round(inference_time, 2)  # Add inference time to the result
#         }
#         return result

#     except Exception as e:
#         logger.error(f"Error during prediction: {e}")
#         return {"error": "There was an issue during prediction."}

# @app.route('/submit_patient_data', methods=['POST'])
# def submit_patient_data():
#     """Endpoint to handle patient data submission, including skin images."""
#     data = request.get_json()

#     # Extract files and patient data
#     skin_images = data.get('skinImages', [])

#     if not skin_images:
#         return jsonify({'message': 'No files received'}), 400

#     predictions = []
#     for file_info in skin_images:
#         file_path = file_info['path']
#         filename = file_info['originalname']

#         if not os.path.exists(file_path):
#             logger.warning(f"File {filename} not found at {file_path}.")
#             return jsonify({'message': f'File {filename} not found'}), 400

#         # Check for valid file content
#         if not allowed_file(filename) or not is_valid_image(file_path):
#             logger.warning(f"Invalid file content for {filename}.")
#             return jsonify({'message': f'Invalid image file content for {filename}'}), 400

#         # Remove hair from the image and process it, if applicable
#         try:
#             processed_image = remove_hair(file_path)  # If no hair is removed, return None
#             if processed_image is None:
#                 processed_image = cv2.imread(file_path)  # Use the original image if no modification occurs
#         except Exception as e:
#             logger.error(f"Error processing file {filename}: {e}")
#             return jsonify({'message': f'Error processing file {filename}: {e}'}), 500

#         # Perform prediction on the processed (or original) image
#         result = predict(file_path)  # We use the processed or original file directly
#         predictions.append({
#             "file": filename,
#             "result": result
#         })

#     # Save the patient data or perform other operations (e.g., store in MongoDB)

#     return jsonify({
#         'message': 'Patient data processed successfully',
#         'predictions': predictions
#     }), 200


# if __name__ == '__main__':
#     # Get the port from the environment, default to 5000 if not set
#     port = int(os.getenv('FLASK_PORT', 5001))  # Default to 5001 if FLASK_PORT is not defined
#     app.run(debug=True, port=port)



# import logging
# from dotenv import load_dotenv
# import os
# import cv2
# import numpy as np
# from flask import Flask, request, jsonify
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing.image import load_img, img_to_array
# import time

# app = Flask(__name__)
# load_dotenv()

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# SKIN_NORMAL_OR_NOT_MODEL_PATH = os.getenv('SKIN_NORMAL_OR_NOT')
# DIAGNOSIS_MODEL_PATH = os.getenv('DIAGNOSIS_MODEL')

# # Define class names (Update this according to your model's output classes)
# class_names = [
#     'Actinic Keratoses',  # akic
#     'Basal Cell Carcinoma',  # bcc
#     'Benign Keratosis-like Lesions',  # bkl
#     'Dermatofibroma',  # df
#     'Melanoma',  # mel
#     'Melanocytic Nevi',  # nv
#     'Vascular Lesions' , # vsc
#     'Normal Skin'
# ]

# # Define the categories for each class
# categories = {
#     'Actinic Keratoses': 'Pre-cancerous',  # akic
#     'Basal Cell Carcinoma': 'Cancerous',  # bcc
#     'Benign Keratosis-like Lesions': 'Non-cancerous',  # bkl
#     'Dermatofibroma': 'Non-cancerous',  # df
#     'Melanoma': 'Cancerous',  # mel
#     'Melanocytic Nevi': 'Non-cancerous',  # nv
#     'Vascular Lesions': 'Non-cancerous' , # vsc
#      'Normal Skin': 'Healthy',
# }

# # Load the pre-trained model
# try:
#     # Load models
#     skin_normal_model = load_model(SKIN_NORMAL_OR_NOT_MODEL_PATH)
#     logger.info("Skin normal/cancerous model loaded successfully.")
#     diagnosis_model = load_model(DIAGNOSIS_MODEL_PATH)
#     logger.info("Diagnosis model loaded successfully.")
# except Exception as e:
#     logger.error(f"Error loading models: {e}")
#     skin_normal_model = None
#     diagnosis_model = None


# # Directory to save uploaded images (we'll overwrite this image with every new upload)
# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # Allowed image extensions
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# def allowed_file(filename):
#     """Check if the uploaded file has an allowed extension."""
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def is_valid_image(image_path):
#     """Validate image file content."""
#     try:
#         image = cv2.imread(image_path)
#         if image is None:
#             return False
#         return True
#     except Exception as e:
#         logger.error(f"Invalid image content: {e}")
#         return False

# def preprocess_image(image_path, target_size=(128, 128)):
#     """Preprocess the image for prediction."""
#     try:
#         image = load_img(image_path, target_size=target_size)  # Resize to model's input size
#         image = img_to_array(image) / 255.0  # Normalize pixel values
#         image = np.expand_dims(image, axis=0)  # Add batch dimension
#         return image
#     except Exception as e:
#         logger.error(f"Error during image preprocessing: {e}")
#         raise

# def remove_hair(image_path):
#     """Remove hair from the image without blurring."""
#     try:
#         image = cv2.imread(image_path)
#         if image is None:
#             raise ValueError("Invalid image path or format.")

#         original_image = image.copy()  # Keep the original image for comparison

#         # Convert the image to grayscale
#         gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#         # Detect hair using morphological operations
#         kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (17, 17))
#         blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)

#         # Threshold the blackhat image to create a mask for hair regions
#         _, hair_mask = cv2.threshold(blackhat, 10, 255, cv2.THRESH_BINARY)

#         # Inpaint the detected hair regions with minimal blur
#         inpainted_image = cv2.inpaint(image, hair_mask, inpaintRadius=3, flags=cv2.INPAINT_NS)  # Use Navier-Stokes inpainting

#         # Compare if the processed image is different from the original image
#         if np.array_equal(original_image, inpainted_image):
#             return None  # No change, return None to indicate no modification

#         # Return the modified image directly without saving
#         return inpainted_image  # Return the inpainted image directly
#     except Exception as e:
#         logger.error(f"Error during hair removal: {e}")
#         raise


# def predict_skin_normal_or_cancerous(image_path):
#     """Predict if skin is normal or cancerous using the first model."""
#     if skin_normal_model is None:
#         return {"error": "Skin normal/cancerous model not loaded."}

#     try:
#         # Preprocess the image for the first model
#         image = preprocess_image(image_path, target_size=(128, 128))

#         # Make the prediction
#         prediction = skin_normal_model.predict(image)

#         if prediction[0] < 0.5:
#             return "Cancerous"
#         else:
#             return "Normal"
#     except Exception as e:
#         logger.error(f"Error during normal/cancerous prediction: {e}")
#         return {"error": "There was an issue during the normal/cancerous prediction."}


# def predict_diagnosis(image_path):
#     """Perform skin cancer diagnosis using the second model."""
#     if diagnosis_model is None:
#         return {"error": "Diagnosis model not loaded."}

#     try:
#         # Preprocess the image for the diagnosis model
#         image = preprocess_image(image_path, target_size=(64, 64))  # Smaller input size for diagnosis model


#         # Perform prediction
#         start_time = time.time()
#          # Make the prediction
#         prediction = diagnosis_model.predict(image)[0]  # Prediction is a list of probabilities
#         inference_time = time.time() - start_time

#         # Log inference time
#         logger.info(f"Inference completed in {inference_time:.2f} seconds.")

#         predicted_class = np.argmax(prediction, axis=0)  # Index of the highest probability

#         probabilities = prediction  # All class probabilities
#         predicted_class_name = class_names[predicted_class]
#         predicted_category = categories.get(predicted_class_name, "Unknown")

#         result = {
#             "predicted_class": predicted_class_name,
#             "category": predicted_category,  # Add the cancer classification category
#             "probabilities": {class_names[i]: float(prob) for i, prob in enumerate(probabilities)},
#             "inference_time": round(inference_time, 2)  # Add inference time to the result
#         }
#         return result

#     except Exception as e:
#         logger.error(f"Error during prediction: {e}")
#         return {"error": "There was an issue during prediction."}

# @app.route('/submit_patient_data', methods=['POST'])
# def submit_patient_data():
#     """Endpoint to handle patient data submission, including skin images."""
#     data = request.get_json()

#     # Extract files and patient data
#     skin_images = data.get('skinImages', [])

#     if not skin_images:
#         return jsonify({'message': 'No files received'}), 400

#     predictions = []
#     for file_info in skin_images:
#         file_path = file_info['path']
#         filename = file_info['originalname']

#         if not os.path.exists(file_path):
#             logger.warning(f"File {filename} not found at {file_path}.")
#             return jsonify({'message': f'File {filename} not found'}), 400

#         # Check for valid file content
#         if not allowed_file(filename) or not is_valid_image(file_path):
#             logger.warning(f"Invalid file content for {filename}.")
#             return jsonify({'message': f'Invalid image file content for {filename}'}), 400

#         # Remove hair from the image and process it, if applicable
#         try:
#             processed_image = remove_hair(file_path)  # If no hair is removed, return None
#             if processed_image is None:
#                 processed_image = cv2.imread(file_path)  # Use the original image if no modification occurs
#         except Exception as e:
#             logger.error(f"Error processing file {filename}: {e}")
#             return jsonify({'message': f'Error processing file {filename}: {e}'}), 500

#          # First, check if the skin is normal or cancerous
#         skin_status = predict_skin_normal_or_cancerous(file_path)

#         if skin_status == "Cancerous":
#             # If cancerous, proceed with further diagnosis
#             result = predict_diagnosis(file_path)
#         else:
#             # If normal, return normal skin result
#             predicted_class_name = 'Normal Skin'
#             predicted_category = categories.get(predicted_class_name, "Unknown")
#             result = {
#                 "predicted_class": predicted_class_name,
#                 "category":predicted_category,
#                 "probabilities" : {class_names[i]: 0.0 for i in range(len(class_names))},
#                 "inference_time": 0.0
#             }

#         predictions.append({
#             "file": filename,
#             "result": result
#         })

#     # Save the patient data or perform other operations (e.g., store in MongoDB)

#     return jsonify({
#         'message': 'Patient data processed successfully',
#         'predictions': predictions
#     }), 200






























# DIAGNOSIS_MODEL=./DiagnosisModel/my_skin_disease_pred_model (2).h5

# MODEL_PATH=r'F:\skin\backend\DiagnosisModel\my_skin_disease_pred_model (2).h5'


# import os
# import cv2
# import numpy as np
# from flask import Flask, request, jsonify
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing.image import load_img, img_to_array
# from werkzeug.utils import secure_filename

# app = Flask(__name__)

# # Path to your pre-trained model
# MODEL_PATH = r"F:\\skin\\backend\\scripts\\my_skin_disease_pred_model (2).h5"

# # Define class names (Update this according to your model's output classes)
# class_names = [
#      'Actinic Keratoses',  # akic
#     'Basal Cell Carcinoma',  # bcc
#     'Benign Keratosis-like Lesions',  # bkl
#     'Dermatofibroma',  # df
#     'Melanoma',  # mel
#     'Melanocytic Nevi',  # nv
#     'Vascular Lesions'  # vsc
# ]

# # Load the pre-trained model
# try:
#     model = load_model(MODEL_PATH)
#     print("Model loaded successfully!")
# except Exception as e:
#     print(f"Error loading model: {e}")
#     model = None

# # Directory to save uploaded images (we'll overwrite this image with every new upload)
# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # Allowed image extensions
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# def allowed_file(filename):
#     """Check if the uploaded file has an allowed extension."""
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def preprocess_image(image_path):
#     """Preprocess the image for prediction."""
#     image = load_img(image_path, target_size=(64, 64))  # Resize to model's input size
#     image = img_to_array(image) / 255.0  # Normalize pixel values
#     image = np.expand_dims(image, axis=0)  # Add batch dimension
#     return image

# def remove_hair(image_path):
#     """Remove hair from the image without blurring."""
#     image = cv2.imread(image_path)
#     if image is None:
#         raise ValueError("Invalid image path or format.")

#     original_image = image.copy()  # Keep the original image for comparison

#     # Convert the image to grayscale
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#     # Detect hair using morphological operations
#     kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (17, 17))
#     blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)

#     # Threshold the blackhat image to create a mask for hair regions
#     _, hair_mask = cv2.threshold(blackhat, 10, 255, cv2.THRESH_BINARY)

#     # Inpaint the detected hair regions with minimal blur
#     inpainted_image = cv2.inpaint(image, hair_mask, inpaintRadius=3, flags=cv2.INPAINT_NS)  # Use Navier-Stokes inpainting

#     # Compare if the processed image is different from the original image
#     if np.array_equal(original_image, inpainted_image):
#         return None  # No change, return None to indicate no modification

#     # Return the modified image directly without saving
#     return inpainted_image  # Return the inpainted image directly

# def predict(image_path):
#     """Perform prediction on the provided image."""
#     if not os.path.exists(image_path):
#         return {"error": "Image file not found."}

#     if model is None:
#         return {"error": "Model not loaded properly."}

#     try:
#         # Preprocess the image
#         image = preprocess_image(image_path)

#         # Perform prediction
#         prediction = model.predict(image)[0]  # Prediction is a list of probabilities
#         predicted_class = np.argmax(prediction, axis=0)  # Index of the highest probability

#         probabilities = prediction  # All class probabilities
#         result = {
#             "predicted_class": class_names[predicted_class],
#             "probabilities": {class_names[i]: float(prob) for i, prob in enumerate(probabilities)},
#         }
#         return result

#     except Exception as e:
#         return {"error": f"Error during prediction: {e}"}

# @app.route('/submit_patient_data', methods=['POST'])
# def submit_patient_data():
#     """Endpoint to handle patient data submission, including skin images."""
#     data = request.get_json()

#     # Extract files and patient data
#     skin_images = data.get('skinImages', [])

#     if not skin_images:
#         return jsonify({'message': 'No files received'}), 400

#     predictions = []
#     for file_info in skin_images:
#         file_path = file_info['path']
#         filename = file_info['originalname']

#         if not os.path.exists(file_path):
#             return jsonify({'message': f'File {filename} not found'}), 400

#         # Remove hair from the image and process it, if applicable
#         try:
#             processed_image = remove_hair(file_path)  # If no hair is removed, return None
#             if processed_image is None:
#                 processed_image = cv2.imread(file_path)  # Use the original image if no modification occurs
#         except Exception as e:
#             return jsonify({'message': f'Error processing file {filename}: {e}'}), 500

#         # Save processed image temporarily to perform prediction
#         temp_processed_path = "temp_processed_image.jpg"
#         cv2.imwrite(temp_processed_path, processed_image)

#         # Perform prediction on the processed (or original) image
#         result = predict(temp_processed_path)  # We use the processed or original file
#         predictions.append({
#             "file": filename,
#             "processed_image": temp_processed_path,
#             "result": result
#         })

#     # Save the patient data or perform other operations (e.g., store in MongoDB)

#     return jsonify({
#         'message': 'Patient data processed successfully',
#         'predictions': predictions
#     }), 200

# if __name__ == '__main__':
#     app.run(debug=True, port=5001)




# import os
# import numpy as np
# from flask import Flask, request, jsonify
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing.image import load_img, img_to_array
# from werkzeug.utils import secure_filename
# from skin_detector import skinDetector  # Import the skinDetector class

# app = Flask(__name__)

# # Path to your pre-trained model
# MODEL_PATH = r"F:\skin\backend\scripts\my_skin_disease_pred_model (2).h5"

# # Define class names (Update this according to your model's output classes)
# class_names = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]
# # TARGET_CLASSES = [
# #       'Melanocytic nevi',
# #      'Melanoma',
# #      'Benign keratosis-like lesions',
# #      'Basal cell carcinoma',
# #      'Actinic keratoses',
# #      'Vascular lesions',
# #      'Dermatofibroma'
#     # 
#     # "pigmented benign keratosis",
#     # "melanoma",
#     # "vascular lesion",
#     # "actinic keratosis",
#     # "squamous cell carcinoma",
#     # "basal cell carcinoma",
#     # "seborrheic keratosis",
#     # "dermatofibroma",
#     # "nevus"
# # ]



# # Load the pre-trained model
# try:
#     model = load_model(MODEL_PATH)
#     print("Model loaded successfully!")
# except Exception as e:
#     print(f"Error loading model: {e}")
#     model = None

# # Directory to save uploaded images
# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # Allowed image extensions
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# def allowed_file(filename):
#     """Check if the uploaded file has an allowed extension."""
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def preprocess_image_with_skin_detection(image_path):
#     """Preprocess the image and apply skin detection."""
#     # Perform skin detection
#     detector = skinDetector(image_path)
#     is_skin, skin_segmented_image = detector.isSkin()
    
#     if not is_skin:
#         return None, "No skin detected in the image."
#     # segmentedImage shape: (768, 1024, 3)
#     # Save the skin-segmented image for further processing
#     segmented_image_path = os.path.join(UPLOAD_FOLDER, "segmented_image.jpg")
#     detector.saveImage(segmented_image_path, skin_segmented_image)
#      # Print the shape of the skin-segmented image
#     print(f"Shape of the segmented image: {skin_segmented_image.shape}")
#     # Preprocess the skin-segmented image for prediction
#     image = load_img(segmented_image_path, target_size=(64, 64))  # Resize to model's input size
#     image = img_to_array(image) / 255.0  # Normalize pixel values
#     image = np.expand_dims(image, axis=0)  # Add batch dimension
#     return image, None

# def predict(image_path):
#     """Perform prediction on the provided image."""
#     if not os.path.exists(image_path):
#         return {"error": "Image file not found."}

#     if model is None:
#         return {"error": "Model not loaded properly."}

#     try:
#         # Preprocess the image with skin detection
#         image, error = preprocess_image_with_skin_detection(image_path)
#         if error:
#             return {"error": error}

#         # Perform prediction
#         prediction = model.predict(image)[0]  # Prediction is a list of probabilities
#         predicted_class = np.argmax(prediction, axis=0)  # Index of the highest probability

#         TARGET_CLASSES = [ 'Melanocytic nevi','Melanoma','Benign keratosis-like lesions','Basal cell carcinoma', 'Actinic keratoses','Vascular lesions','Dermatofibroma']

#         probabilities = prediction  # All class probabilities
#         result = {
#             "predicted_class": TARGET_CLASSES[predicted_class],
#             "probabilities": {TARGET_CLASSES[i]: float(prob) for i, prob in enumerate(probabilities)},
#         }
#         return result

#     except Exception as e:
#         return {"error": f"Error during prediction: {e}"}

# @app.route('/submit_patient_data', methods=['POST'])
# def submit_patient_data():
#     """Endpoint to handle patient data submission, including skin images."""
#     data = request.get_json()

#     # Extract files and patient data
#     skin_images = data.get('skinImages', [])

#     if not skin_images:
#         return jsonify({'message': 'No files received'}), 400

#     predictions = []
#     for file_info in skin_images:
#         file_path = file_info['path']
        
#         if not os.path.exists(file_path):
#             return jsonify({'message': f'File {file_info["originalname"]} not found'}), 400
        
#         # Perform prediction on each image
#         result = predict(file_path)
#         predictions.append({
#             "file": file_info["originalname"],
#             "result": result
#         })

#     # Save the patient data or perform other operations (e.g., store in MongoDB)

#     return jsonify({
#         'message': 'Patient data processed successfully',
#         'predictions': predictions
#     }), 200

# if __name__ == '__main__':
#     app.run(debug=True, port=5001)


























# import os
# import numpy as np
# from flask import Flask, request, jsonify
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing.image import load_img, img_to_array
# from werkzeug.utils import secure_filename

# app = Flask(__name__)

# # Path to your pre-trained model
# MODEL_PATH = r"F:\skin\backend\scripts\my_model.h5"

# # Define class names (Update this according to your model's output classes)
# class_names = ["akiec","bcc", "bkl","df","mel","nv","vasc"]
# # Load the pre-trained model
# try:
#     model = load_model(MODEL_PATH)
#     print("Model loaded successfully!")
# except Exception as e:
#     print(f"Error loading model: {e}")
#     model = None

# # Directory to save uploaded images
# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # Allowed image extensions
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# def allowed_file(filename):
#     """Check if the uploaded file has an allowed extension."""
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def preprocess_image(image_path):
#     """Preprocess the image for prediction."""
#     image = load_img(image_path, target_size=(28, 28))  # Resize to the model's input size
#     image = img_to_array(image) / 255.0  # Normalize pixel values
#     image = np.expand_dims(image, axis=0)  # Add batch dimension
#     return image

# def predict(image_path):
#     """Perform prediction on the provided image."""
#     if not os.path.exists(image_path):
#         return {"error": "Image file not found."}

#     try:
#         # Preprocess the image
#         image = preprocess_image(image_path)

#         # Perform prediction
#         prediction = model.predict(image)[0]  # Prediction is now a list of probabilities
#         predicted_class = np.argmax(prediction, axis=0)  # Index of the highest probability

#         TARGET_CLASSES = [
#             "akiec",
#             " bcc",
#             " bkl",
#             " df",
#             " mel",
#             " nv",
#             " vasc",
#         ]

#         probabilities = prediction  # All class probabilities
#         result = {
#             "predicted_class": TARGET_CLASSES[predicted_class],
#             "probabilities": {TARGET_CLASSES[i]: float(prob) for i, prob in enumerate(probabilities)},
#         }
#         return result

#     except Exception as e:
#         return {"error": f"Error during prediction: {e}"}

# @app.route('/submit_patient_data', methods=['POST'])
# def submit_patient_data():
#     """Endpoint to handle patient data submission, including skin images."""
#     data = request.get_json()

#     # Extract files and patient data
#     skin_images = data.get('skinImages', [])

#     if not skin_images:
#         return jsonify({'message': 'No files received'}), 400

#     predictions = []
#     for file_info in skin_images:
#         file_path = file_info['path']
        
#         if not os.path.exists(file_path):
#             return jsonify({'message': f'File {file_info["originalname"]} not found'}), 400
        
#         # Perform prediction on each image
#         result = predict(file_path)
#         predictions.append({
#             "file": file_info["originalname"],
#             "result": result
#         })

#     # Save the patient data or perform other operations (e.g., store in MongoDB)

#     return jsonify({
#         'message': 'Patient data processed successfully',
#         'predictions': predictions
#     }), 200

# if __name__ == '__main__':
#     app.run(debug=True, port=5001)






















# import os
# import numpy as np
# import uuid
# from flask import Flask, request, jsonify
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing.image import load_img, img_to_array
# from werkzeug.utils import secure_filename

# app = Flask(__name__)

# # Path to your pre-trained model
# MODEL_PATH = r"F:/proj/inreact/backend/scripts/my_modal.h5"

# # Load the pre-trained model
# try:
#     model = load_model(MODEL_PATH)
#     print("Model loaded successfully!")
# except Exception as e:
#     print(f"Error loading model: {e}")
#     model = None

# # Directory to save uploaded images
# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # Allowed image extensions
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# def allowed_file(filename):
#     """Check if the uploaded file has an allowed extension."""
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def preprocess_image(image_path):
#     """Preprocess the image for prediction."""
#     image = load_img(image_path, target_size=(28, 28))  # Resize to the model's input size
#     image = img_to_array(image) / 255.0  # Normalize pixel values
#     image = np.expand_dims(image, axis=0)  # Add batch dimension
#     return image

# # def predict(image_path):
# #     """Perform prediction on the provided image."""
# #     if not os.path.exists(image_path):
# #         return {"error": "Image file not found."}

# #     try:
# #         # Preprocess the image
# #         image = preprocess_image(image_path)

# #         # Perform prediction
# #         prediction = model.predict(image)
# #         confidence = float(prediction[0][0])  # Convert to Python float
# #         label = "Malignant" if confidence > 0.5 else "Benign"
# #         return {"label": label, "confidence": round(confidence, 2)}
# #     except Exception as e:
# #         return {"error": f"Error during prediction: {e}"}
# def predict(image_path):
#     """Perform prediction on the provided image."""
#     if not os.path.exists(image_path):
#         return {"error": "Image file not found."}

#     try:
#         # Preprocess the image
#         image = preprocess_image(image_path)

#         # Perform prediction
#         prediction = model.predict(image)  # Prediction is now a list of probabilities
#         predicted_class_index = np.argmax(prediction[0])  # Index of the highest probability
#         confidence = float(prediction[0][predicted_class_index])  # Confidence of the predicted class
#         label = class_names[predicted_class_index]  # Get the label from class names
        
#         return {"label": label, "confidence": round(confidence, 2)}
#     except Exception as e:
#         return {"error": f"Error during prediction: {e}"}

# @app.route('/submit_patient_data', methods=['POST'])
# def submit_patient_data():
#     """Endpoint to handle patient data submission, including skin images."""
#     data = request.get_json()

#     # Extract files and patient data
#     skin_images = data.get('skinImages', [])


#     if not skin_images:
#         return jsonify({'message': 'No files received'}), 400

#     # Process received images (e.g., save them or perform further analysis)
#     processed_images = []
#     for file_info in skin_images:
#         file_path = file_info['path']
        
#         if not os.path.exists(file_path):
#             return jsonify({'message': f'File {file_info["originalname"]} not found'}), 400
        
#         # Perform prediction on each image
#         result = predict(file_path)

       

#     # Save the patient data or perform other operations (e.g., store in MongoDB)
#     # Assuming you save patient_data to a database here

#     return jsonify({
#         'message': 'Patient data processed successfully',
#         "prediction": result
#     }), 200

# if __name__ == '__main__':
#     app.run(debug=True, port=5001)




# from tensorflow.keras.preprocessing import image
# import numpy as np
# import matplotlib.pyplot as plt
# from tensorflow.keras.models import load_model
# import seaborn as sns  # For better color palettes

# # Load the trained model
# model = load_model(r'F:\skin\backend\scripts\skin_cancer_model.h5')  # Replace 'best_model.keras' with your actual model file path

# # Define the class labels (adjust these based on your dataset)
# class_labels = [
#     'Melanoma', 
#     'Nevus', 
#     'Seborrheic Keratosis', 
#     'Actinic Keratosis', 
#     'Basal Cell Carcinoma', 
#     'Dermatofibroma', 
#     'Vascular Lesion'
# ]

# # Function to preprocess the image
# def preprocess_image(image_path):
#     img = image.load_img(image_path, target_size=(28, 28))  # Adjust target size as per your model's input
#     img_array = image.img_to_array(img)
#     img_array /= 255.0  # Rescale pixel values to [0, 1]
#     return np.expand_dims(img_array, axis=0)

# # Function to predict class label and probabilities
# def predict_class(image_path, model):
#     preprocessed_image = preprocess_image(image_path)
#     predictions = model.predict(preprocessed_image)[0]  # Get predictions as a 1D array
#     predicted_class_index = np.argmax(predictions)  # Get the index of the highest probability
#     predicted_label = class_labels[predicted_class_index]  # Get the corresponding class label
#     return predicted_label, predictions

# # Example usage
# image_path = r"F:\new project\Train\mel\ISIC_0024333.jpg"  # Replace with the path to your image
# predicted_label, predictions = predict_class(image_path, model)

# # Load the image for display
# input_image = image.load_img(image_path, target_size=(224, 224))  # Load image with reduced size

# # Plot the image and bar chart
# fig, ax = plt.subplots(1, 2, figsize=(28, 8))  # Adjust figure size for better layout

# # Display the input image
# ax[0].imshow(input_image)
# ax[0].axis('off')
# ax[0].set_title("Input Image", fontsize=18, fontweight='bold')

# # Plot the bar chart
# sns.set_palette("coolwarm")  # Use a visually appealing color palette
# bars = ax[1].bar(
#     class_labels, predictions * 100, width=0.6, edgecolor='black',
#     color=sns.color_palette("viridis", len(class_labels))
# )

# # Add gridlines
# ax[1].grid(axis='y', linestyle='--', alpha=0.7)

# # Enhance bar chart labels and title
# ax[1].set_xlabel("Skin Cancer Types", fontsize=16, fontweight='bold')
# ax[1].set_ylabel("Prediction Probability (%)", fontsize=16, fontweight='bold')
# ax[1].set_title(f"Prediction Probabilities\n(Predicted: {predicted_label})", fontsize=18, fontweight='bold')

# # Annotate the bars with probabilities, adjusting placement to avoid overlap
# for bar, prob in zip(bars, predictions * 100):
#     ax[1].text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 2,
#                f"{prob:.2f}%", ha='center', fontsize=12, color='black')

# plt.tight_layout()
# plt.show()










