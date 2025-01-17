import os
import cv2
import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Path to your pre-trained model
MODEL_PATH = r"F:\\skin\\backend\\scripts\\my_skin_disease_pred_model (2).h5"

# Define class names (Update this according to your model's output classes)
class_names = [
    'Melanocytic nevi',
    'Melanoma',
    'Benign keratosis-like lesions',
    'Basal cell carcinoma',
    'Actinic keratoses',
    'Vascular lesions',
    'Dermatofibroma'
]

# Load the pre-trained model
try:
    model = load_model(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Directory to save uploaded images (we'll overwrite this image with every new upload)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    """Preprocess the image for prediction."""
    image = load_img(image_path, target_size=(64, 64))  # Resize to model's input size
    image = img_to_array(image) / 255.0  # Normalize pixel values
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image

def remove_hair(image_path):
    """Remove hair from the image without blurring."""
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Invalid image path or format.")

    original_image = image.copy()  # Keep the original image for comparison

    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect hair using morphological operations
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (17, 17))
    blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)

    # Threshold the blackhat image to create a mask for hair regions
    _, hair_mask = cv2.threshold(blackhat, 10, 255, cv2.THRESH_BINARY)

    # Inpaint the detected hair regions with minimal blur
    inpainted_image = cv2.inpaint(image, hair_mask, inpaintRadius=3, flags=cv2.INPAINT_NS)  # Use Navier-Stokes inpainting

    # Compare if the processed image is different from the original image
    if np.array_equal(original_image, inpainted_image):
        return None  # No change, return None to indicate no modification

    # Return the modified image directly without saving
    return inpainted_image  # Return the inpainted image directly

def predict(image_path):
    """Perform prediction on the provided image."""
    if not os.path.exists(image_path):
        return {"error": "Image file not found."}

    if model is None:
        return {"error": "Model not loaded properly."}

    try:
        # Preprocess the image
        image = preprocess_image(image_path)

        # Perform prediction
        prediction = model.predict(image)[0]  # Prediction is a list of probabilities
        predicted_class = np.argmax(prediction, axis=0)  # Index of the highest probability

        probabilities = prediction  # All class probabilities
        result = {
            "predicted_class": class_names[predicted_class],
            "probabilities": {class_names[i]: float(prob) for i, prob in enumerate(probabilities)},
        }
        return result

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

    predictions = []
    for file_info in skin_images:
        file_path = file_info['path']
        filename = file_info['originalname']

        if not os.path.exists(file_path):
            return jsonify({'message': f'File {filename} not found'}), 400

        # Remove hair from the image and process it, if applicable
        try:
            processed_image = remove_hair(file_path)  # If no hair is removed, return None
            if processed_image is None:
                processed_image = cv2.imread(file_path)  # Use the original image if no modification occurs
        except Exception as e:
            return jsonify({'message': f'Error processing file {filename}: {e}'}), 500

        # Save processed image temporarily to perform prediction
        temp_processed_path = "temp_processed_image.jpg"
        cv2.imwrite(temp_processed_path, processed_image)

        # Perform prediction on the processed (or original) image
        result = predict(temp_processed_path)  # We use the processed or original file
        predictions.append({
            "file": filename,
            "processed_image": temp_processed_path,
            "result": result
        })

    # Save the patient data or perform other operations (e.g., store in MongoDB)

    return jsonify({
        'message': 'Patient data processed successfully',
        'predictions': predictions
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)




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










