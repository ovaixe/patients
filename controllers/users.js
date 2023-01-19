const { User } = require('../models');

const userController = {
    register
};

module.exports = userController;


async function register(req, res, next) {
    const { body = {} } = req;
    try {
        const user = await User.findByPk(body.email);
        if (user) {
            return res.status(401).json('User with this email already exists!');
        } else {
            await User.create(body);
            return next();
        }
    } catch (err) {
        return res.status(500).json(err);
    }
}