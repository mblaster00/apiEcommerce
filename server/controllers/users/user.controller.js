// Imports
var User = require("../../models/users/user.model");
var ApiKey = require("../../models/apiKey/apiKey.model");
var bcrypt = require("bcrypt");
var jwtUtils = require("../../config/utils/jwt.utils");
var config = require("../../config/environments/index");
var logger = require("../../components/logger/index");
const errorHandler = require('../../_helper/error-handler');
var moment = require("moment-timezone");
const { v4: uuidv4 } = require('uuid');

// hash the password the the user enter
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

// verify if it's the right password
async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

// sign up function
exports.signup = async (req, res, next) => {
    logger.info(`-- USER.SIGNUP --`);
    try {
        const { username, email, phone, password, country, companyName } = req.body;
        const emailExist = await User.findOne({ email });
        if(!email && !phone)
            return res.status(400).json({ message: `Email or Phone are required` });
        if (!username || !password || !country || !companyName)
            return res.status(400).json({ message: `Please fill in all the required fields` });
        if (emailExist)
            return res.status(409).json({ message: `Email already exist.` });
        if (phone) {
            // optional
            const phoneExist = await User.findOne({ phone });
            if (phoneExist)
                return res.status(410).json({ message: `Phone number already exist.` });
        }
        if (req.body.password.length < 6)
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        const hashedPassword = await hashPassword(req.body.password);
        req.body.password = hashedPassword;
        var createdAt = moment.tz(Date.now(), config.timezone.zone);
        var newUser = new User(req.body);
        const accessToken = jwtUtils.generateToken(newUser);
        newUser.created_at = createdAt;
        newUser.updated_at = createdAt; // the creation date and the updated date are the same on user sign up
        newUser.accessToken = accessToken;
        logger.info(`-- USER.SIGNUP -- saved`);
        keyData = { userId: newUser._id, created_at: createdAt, updated_at: createdAt }
        var apiKey = new ApiKey(keyData);
        return await newUser.save()
            .then((user) => {
                logger.info("-- USER.SIGNUP --" + `new user saved : ${user._id}`);
                const secret = uuidv4();
                const secretToken = `${jwtUtils.generateSecret(apiKey)}|${secret}`;
                apiKey.secretToken = secretToken;
                apiKey.save()
                return res.status(201).json({
                    data: { _id: user._id },
                    accessToken: user.accessToken
                });
            })
            .catch((error) => {
                logger.info(
                    `-- USER.SIGNUP-- error : ${error}`
                );
            });
    } catch (error) {
        logger.info(
            `-- USER.SIGNUP-- : ${error}`
        );
    }
};

// authentification
exports.login = async (req, res, next) => {
    logger.info(`-- USER.LOGIN -- start function --`);
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            $or: [{ phone: username }, { email: username }],
        });
        if (!user)
            return res.status(409).json({ message: "Email or phoneNumber does not exist" });
        if (user.active === false)
            return res.status(403).json({ message: 'Account is blocked' });
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return res.status(403).json({ message: "Password is not correct" });
        const accessToken = jwtUtils.generateToken(user);
        logger.info(`-- USER.LOGIN -- saved`);
        const lastLogin = moment.tz(Date.now(), config.timezone.zone);
        if ((lastLogin - user.lastLogin) / (1000 * 3600 * 24 * 365) > 1) { // More than one year without updated apiKey
            logger.info(`-- USER.APIKEY -- update`);
            const apiKey = await ApiKey.findOne({ userId: user._id }).exec();
            const secret = uuidv4();
            const secretToken = `${jwtUtils.generateSecret(apiKey)}|${secret}`
            await ApiKey.findOneAndUpdate({ userId: user._id }, { accessToken: secretToken }).exec()
        }
        return await User.findByIdAndUpdate(user._id, { accessToken: accessToken, lastLogin: lastLogin })
            .exec()
            .then((result) => {
                logger.info(`-- USER.LOGIN -- SUCCESSFULLY`);
                res.status(200).json({
                    data: {
                        _id: result._id,
                        username: result.username
                    },
                    accessToken,
                });
            })
            .catch((error) => {
                logger.info(
                    `-- USER.LOGIN-- : ${error.toString()}`
                );
            });
    } catch (error) {
        logger.info(
            `-- USER.LOGIN-- : ${error.toString()}`
        );
    }
};

// authentification
exports.getOneUser = async (req, res, next) => {
    const data = req.params;
    return await User.findById(data.userId).exec()
        .then((result) => {
            logger.info(`-- USER.FINDONE -- SUCCESSFULLY`);
            res.status(200).json({ result });
        })
        .catch((error) => {
            logger.info(
                `-- USER.FINDONE-- : ${error.toString()}`
            );
        });
}