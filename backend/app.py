import os
import numpy as np
import uuid
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Path to your pre-trained model
MODEL_PATH = r"F:/proj/inreact/backend/scripts/skin_cancer_model.h5"

# Load the pre-trained model
try:
    model = load_model(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Directory to save uploaded images
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    """Preprocess the image for prediction."""
    image = load_img(image_path, target_size=(28, 28))  # Resize to the model's input size
    image = img_to_array(image) / 255.0  # Normalize pixel values
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image

def predict(image_path):
    """Perform prediction on the provided image."""
    if not os.path.exists(image_path):
        return {"error": "Image file not found."}

    try:
        # Preprocess the image
        image = preprocess_image(image_path)

        # Perform prediction
        prediction = model.predict(image)
        confidence = float(prediction[0][0])  # Convert to Python float
        label = "Malignant" if confidence > 0.5 else "Benign"
        return {"label": label, "confidence": round(confidence, 2)}
    except Exception as e:
        return {"error": f"Error during prediction: {e}"}

@app.route('/submit_patient_data', methods=['POST'])
def submit_patient_data():
    """Endpoint to handle patient data submission, including skin images."""
    data = request.get_json()

    # Extract files and patient data
    skin_images = data.get('skinImages', [])


    if not skin_images:
        return jsonify({'message': 'No files received'}), 400

    # Process received images (e.g., save them or perform further analysis)
    processed_images = []
    for file_info in skin_images:
        file_path = file_info['path']
        
        if not os.path.exists(file_path):
            return jsonify({'message': f'File {file_info["originalname"]} not found'}), 400
        
        # Perform prediction on each image
        result = predict(file_path)

       

    # Save the patient data or perform other operations (e.g., store in MongoDB)
    # Assuming you save patient_data to a database here

    return jsonify({
        'message': 'Patient data processed successfully',
        "prediction": result
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)
