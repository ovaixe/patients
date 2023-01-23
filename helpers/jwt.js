const jwt = require('jsonwebtoken');
const { User } = require('../models');

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

const jwtHandler = {
    generateToken,
    validateToken
};

module.exports = jwtHandler;


async function generateToken(req, res, next) {
    const email = req.body.email;
    try {
        const user = await User.findByPk(email);
        if (user) {
            const data = { userId: email, date: Date.now() };
            const token = jwt.sign(data, jwtSecretKey, { expiresIn: '1h'});
            return res.status(200).json(token);
        } else {
            return res.status(404).json('No user found with this email!');
        }
    } catch (err) {
        return res.status(500).json(err);
    }
    
}

function validateToken(req, res, next) {
    try {
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return next();
        } else return res.status(401).json('Access Denied!');
    } catch (err) {
        return res.status(401).json('Access Denied!: ' + err);
    }
}