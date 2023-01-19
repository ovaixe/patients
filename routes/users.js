const express = require('express');
const userController = require('../controllers/users');
const { jwtHandler } = require('../config')

const { register } = userController;
const { generateToken } = jwtHandler;
const router = express.Router();

// This is endpoint to register a user.
router.post('/register', register, generateToken);



module.exports = router;