const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
    try {
        let token = req.header('Authorization');

        if(!token) {
            return res.status(403).send('Access Denied');
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id);
        if(!user) return res.status(401).send('User Not Found');

        req.user = user;
        next();
    } catch (e) {
        return res.status(401).send('Invalid Token');
    }
};

module.exports = {verifyToken};