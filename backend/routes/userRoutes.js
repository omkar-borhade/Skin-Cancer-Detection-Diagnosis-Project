const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const userController = require('../controllers/userController.js');
=======
const userController = require('../controllers/UserController');
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

router.post('/register', userController.registerUser); // Define the register route
router.post('/login', userController.loginUser); 

module.exports = router;
