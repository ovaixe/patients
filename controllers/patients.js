const { Op } = require('sequelize');
const { Patient } = require('../models');
const { redisClient, DEFAULT_EXPIRATION } = require('../config');

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
        const cachePatients = await redisClient.get('patients');
        if (cachePatients) {
            console.log('Redis HIT...');
            return res.status(200).json(JSON.parse(cachePatients));
        } else {
            console.log('Redis MISS...');
            const patients = await Patient.findAll();
            await redisClient.setEx('patients', DEFAULT_EXPIRATION, JSON.stringify(patients));
            return res.status(200).json(patients);
        }
    } catch (err) {
        return res.status(500).json(err);
    }
}

async function getById(req, res, next) {
    const id = req.params.id;
    try {
        await redisClient.connect().catch(console.error);
        const cachePatient = await redisClient.get(id);
        await redisClient.quit();
        if (cachePatient) {
            console.log('Redis HIT...');
            return res.status(200).json(JSON.parse(cachePatient));
        } else {
            console.log('Redis MISS...');
            const patient = await Patient.findOne({ where: { id } });
            if (patient) {
                await redisClient.setEx(id, DEFAULT_EXPIRATION, JSON.stringify(patient));
                return res.status(200).json(patient);
            } else return res.status(404).json('No patient found!');
        }
    } catch (err) {
        return res.status(500).json('There is come internal error: ' + err);
    }
}

async function getByWalletAmount(req, res, next) {
    const amount = req.params.amount;
    try {
        await redisClient.connect().catch(console.error);
        const cachePatients = await redisClient.get('patientsWithAmount' + amount);
        await redisClient.quit();
        if (cachePatients) {
            console.log('Redis HIT...');
            return res.status(200).json(JSON.parse(cachePatients));
        } else {
            console.log('Redis MISS...');
            const patients = await Patient.findAll({
                where: { 
                    walletAmount: {
                        [Op.gt]: amount
                    }
                }
            });
            if (patients) {
                await redisClient.setEx('patientsWithAmount' + amount, DEFAULT_EXPIRATION, JSON.stringify(patients));
                return res.status(200).json(patients);
            } else return res.status(404).json('No patient with wallet amount greater than given amount!');
        }
    } catch (err) {
        return res.status(500).json(err);
    }
    
}

async function create(req, res, next) {
    const { name, age, gender, walletAmount} = req.body;
    try {
        const patient = await Patient.create({ name, age, gender, walletAmount });
        return res.status(200).json(patient);
    } catch (err) {
        return res.status(500).json(err);
    }
}

async function updateById(req, res, next) {
    const id = (req.params.id);
    const body = req.body;
    try {
        let patient = await Patient.findOne({ where: { id } });
        if (patient) {
            patient.set(body);
            patient = await patient.save();
            const cachePatient = await redisClient.get(id);
            if (cachePatient) await redisClient.setEx(id, DEFAULT_EXPIRATION, JSON.stringify(patient));
            return res.status(200).json(patient);
        } else {
            return res.status(404).json('No patient found!');
        }
    } catch (err) {
        return res.status(500).json(err);
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
        return res.status(500).json(err);
    });
}