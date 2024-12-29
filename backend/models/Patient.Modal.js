// models/Patient.js
const mongoose = require('mongoose');
function arrayLimit(val) {
  return val.length <= 5;
}

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
    unique: true, 
    
  },
  address: {
    type: String,
    required: false,
  },
  skinImages: {
    type: [String], // Array of strings to store image URLs
    required: true,
   
  },
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