from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import os

app = Flask(__name__)

# Load your trained model
model = load_model(r"F:\skin\backend\scripts\skin_cancer_model.h5")

def preprocess_image(image_path):
    """Preprocess the image to the required format for the model."""
    img = Image.open(image_path).resize((224, 224))  # Adjust size as per your model
    img_array = np.array(img) / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the image file from the request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        image = request.files['image']
        image_path = os.path.join('uploads', image.filename)
        image.save(image_path)  # Save the image temporarily

        # Preprocess the image and make a prediction
        processed_image = preprocess_image(image_path)
        predictions = model.predict(processed_image)

        # Remove the temporary file
        os.remove(image_path)

        # Respond with the predictions
        return jsonify({'predictions': predictions.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

