const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger'); 

// Registration Logic
export const register = async (req, res, next) => {
    try {
        const {
            username,
            email,
            password,
            role,
            location, 
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
            role,
            location,
        });

        const savedUser = await newUser.save();
        logger.info(`New user registered: ${username}`); 
        res.status(201).json(savedUser);
    } catch (e) {
        logger.error(`Registration error: ${e.message}`); 
    }
};

// Login Logic
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            logger.warn(`Login attempt for non-existent user: ${username}`); 
            return res.status(400).json({ message: 'User does not exist.'});
        }

        const userMatch = await bcrypt.compare(password, user.password);
        if (!userMatch) {
            logger.warn(`Invalid login attempt for user: ${username}`); 
            return res.status(400).json({ message: 'Invalid Credentials. '});
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        logger.info(`User logged in: ${username}`); 
        delete user.password; 
        res.status(200).json({ token, user });
    } catch (e) {
        logger.error(`Login error: ${e.message}`);
        next(e);
    }
};
