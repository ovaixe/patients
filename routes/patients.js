const express = require('express');
const { jwtHandler } = require('../config');
const patientController = require('../controllers/patients');

const {getAll, getById, getByWalletAmount, create, updateById, deleteById} = patientController;
const { validateToken } = jwtHandler;

const router = express.Router();


// This is endpoint to get all patients.
router.get('/', validateToken, getAll);

// This is endpoint to get a patient details with given id.
router.get('/:id', validateToken, getById);

// This is endpoint to get patients whose wallet amount is greater than given amount.
router.get('/wallet/:amount', validateToken, getByWalletAmount);

// This is endpoint to add new patient details.
router.post('/create', validateToken, create);

// This is endpoint to update patient details with given id.
router.patch('/update/:id', validateToken, updateById);

// This is endpoint to delete patient details with given id.
router.delete('/delete/:id', validateToken, deleteById);


module.exports = router;