const { Op } = require('sequelize');
const { Patient } = require('../models');
const { redisHelper, sqsHelper } = require('../helpers');

const { getCacheData, setCacheData } = redisHelper;
const { publish, consume } = sqsHelper;

const patientController = {
    getAll,
    getById,
    getByWalletAmount,
    create,
    updateById,
    deleteById
};

module.exports = patientController;

async function getAll(req, res, next) {
    try {
        const patients = await Patient.findAll();
        return res.status(200).json(patients);
    } catch (err) {
        return res.status(500).json('There is some internal error: ' + err);
    }
}

async function getById(req, res, next) {
    const id = parseInt(req.params.id);
    try {
        const cachePatient = getCacheData(id);
        cachePatient.then(async (patient) => {
            if (patient) {
                console.log('Redis HIT...');
                return res.status(200).json(JSON.parse(patient));
            } else {
                console.log('Redis MISS...');
                const patient = await Patient.findOne({ where: { id } });
                if (patient) {
                    setCacheData(id, patient);
                    return res.status(200).json(patient);
                } else return res.status(404).json('No patient found!');
                }
        }).catch((err) => {
            console.log("Some error in redis..." + err);
            return res.status(500).json('There is some internal error: ' + err)
        })
    } catch (err) {
        return res.status(500).json('There is some internal error: ' + err);
    }
}

async function getByWalletAmount(req, res, next) {
    const amount = parseInt(req.params.amount);
    try {
        const patients = await Patient.findAll({
            where: { 
                walletAmount: {
                    [Op.gt]: amount
                }
            }
        });
        if (patients.length) {
            return res.status(200).json(patients);
        } else return res.status(404).json('No patient with wallet amount greater than given amount!');
    } catch (err) {
        return res.status(500).json('There is some internal error: ' + err);
    }
    
}

async function create(req, res, next) {
    const { body = {} } = req;
    try {
        const patient = await Patient.create(body);
        return res.status(200).json(patient);
    } catch (err) {
        return res.status(500).json('There is some internal error: ' + err);
    }
}

async function updateById(req, res, next) {
    const id = parseInt(req.params.id);
    const body = req.body;
    try {
        let patient = await Patient.findOne({ where: { id } });
        if (patient) {
            patient.set(body);
            patient = await patient.save();
            const cachePatient = getCacheData(id);
            if (cachePatient) setCacheData(id, patient);
            const message = {
                msg: 'Database Updated.',
                updatedData: patient
            }
            publish(message);
            return res.status(200).json(patient);
        } else {
            return res.status(404).json('No patient found!');
        }
    } catch (err) {
        return res.status(500).json('There is some internal error: ' + err);
    }
}

async function deleteById(req, res, next) {
    const id = parseInt(req.params.id);
    await Patient.destroy({
        where: { id }
    }).then(patient => {
        if (patient) {
            return res.status(200).json('Patient deleted successfully! ');
        } else {
            return res.status(404).json('No patient found!');
        }
    }).catch(err => {
        return res.status(500).json('There is some internal error: ' + err);
    });
}