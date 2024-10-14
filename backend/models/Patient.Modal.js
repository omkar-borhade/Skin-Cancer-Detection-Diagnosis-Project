// models/Patient.js
const mongoose = require('mongoose');

// Custom validator to ensure max 5 images can be uploaded
function arrayLimit(val) {
  return val.length <= 5;
}

// Define the schema for storing patient details
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
    enum: ['Male', 'Female', 'Other'], // Gender options
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], // Blood group options
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure unique email
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email'], // Email validation
  },
  address: {
    type: String,
    required: false,
  },
  skinImages: {
    type: [String], // Array of strings to store image URLs
    required: true,
    validate: [arrayLimit, '{PATH} exceeds the limit of 5 images'], // Limit to 5 images
  },
  familyHistory: {
    type: Boolean,
    required: true, // Indicate family history of skin cancer
  },
  symptoms: {
    type: String,
    required: true,
    maxlength: 500, // Optional: limit description length to 500 characters
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create the patient model
const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;