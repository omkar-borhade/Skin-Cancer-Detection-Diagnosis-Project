const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  // Store each image with its corresponding prediction
  skinImages: [{
    imageUrl: {
      type: String, // URL or file path for the image
      required: true,
    },
    prediction: {
      type: String, // Prediction result for the image (e.g., "Cancer", "Non-cancer")
      required: true,
    },
    predictionDate: {
      type: Date, // Date of the prediction for the image
      default: Date.now,
    },
  }],
  familyHistory: {
    type: Boolean,
    required: true, // Indicate family history of skin cancer
  },
  symptoms: {
    type: String,
    required: true,
    maxlength: 500, 
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create the patient model
const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
