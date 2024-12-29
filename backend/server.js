require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const patientRoutes = require('./routes/PatientRoutes');
const nearbyRoutes = require('./routes/nearbyRoutes');
const userRoutes = require('./routes/userRoutes'); // Make sure to import user routes
const { port } = require('./config/dotenvConfig');
const errorHandler = require('./middlewares/errorHandler');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Make sure this matches your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
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
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});