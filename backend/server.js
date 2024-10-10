require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const patientRoutes = require('./routes/PatientRoutes');
const errorHandler = require('./middlewares/errorHandler');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', patientRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
