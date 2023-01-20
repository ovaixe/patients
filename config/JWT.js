const jwt = require('jsonwebtoken');

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

const jwtHandler = {
    generateToken,
    validateToken
};

module.exports = jwtHandler;


function generateToken(req, res, next) {
    const email = req.body.email;
    try {
        const data = { userId: email };
        const token = jwt.sign(data, jwtSecretKey);
        return res.status(200).json(token);
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
        return res.status(401).json('Access Denied!' + err);
    }
}