require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const patientRoutes = require('./routes/PatientRoutes');
const nearbyRoutes = require('./routes/nearbyRoutes');
const userRoutes = require('./routes/userRoutes'); // Make sure to import user routes
const { port, FRONTEND } = require('./config/dotenvConfig');
const errorHandler = require('./middlewares/errorHandler');
const path = require('path');
// Connect to MongoDB
connectDB();

const app = express();
const _dirname=path.resolve();
// Middleware
app.use(cors({
  origin: FRONTEND || 'http://localhost:5173',  // Ensure this matches your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', userRoutes);     // Register user routes
app.use('/api', patientRoutes);  // Register patient routes
// app.use('/api', patientRoutes);  // Register patient routes
app.use(nearbyRoutes);

// Error handling middleware
app.use(errorHandler);
// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});