const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.post('/register', userController.registerUser); // Define the register route
router.post('/login', userController.loginUser); 

module.exports = router;
