const express = require('express');
const patientController = require('../controllers/patients');

const {getAll, getById, getByWalletAmount, create, updateById, deleteById} = patientController;

const router = express.Router();


// This is endpoint to get all patients.
router.get('/', getAll);

// This is endpoint to get a patient details with given id.
router.get('/:id', getById);

// This is endpoint to get patients whose wallet amount is greater than given amount.
router.get('/wallet/:amount', getByWalletAmount);

// This is endpoint to add new patient details.
router.post('/create', create);

// This is endpoint to update patient details with given id.
router.patch('/update/:id', updateById);

// This is endpoint to delete patient details with given id.
router.delete('/delete/:id', deleteById);


module.exports = router;