// Imports
var User = require("../../models/users/user.model");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var logger = require("../../components/logger/index");
var moment = require("moment-timezone");
var fs = require("fs");

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
        const { email, phone } = req.body;
        const emailExist = await User.findOne({ email });
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
        const signOptions = {
            algorithm: process.env.ALG,
        };
        var privateKey = fs.readFileSync(process.env.PRIVATE_KEY, "utf-8");
        const accessToken = jwt.sign(
            { userId: newUser._id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2 }, //expire in 2 hour
            privateKey,
            signOptions
        );
        newUser.created_at = createdAt;
        newUser.updated_at = createdAt; // the creation date and the updated date are the same on user sign up
        newUser.accessToken = accessToken;
        logger.info(`-- USER.SIGNUP -- saved`);
        return await newUser
            .save()
            .then((user) => {
                logger.info("-- USER.SIGNUP --" + `new user saved : ${user._id}`);
                return res.status(201).json({
                    data: { _id: user._id },
                    accessToken: user.accessToken,
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
        if (user.status === 'ISINACTIVATED')
            return res.status(403).json({ message: 'Account is blocked' });
        if (user.status === 'DELETED')
            return res.status(403).json({ message: 'Account is deleted' });
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return res.status(409).json({ message: "Login or password is not correct" });
        const signOptions = {
            algorithm: process.env.ALG,
        };
        var privateKey = fs.readFileSync(process.env.PRIVATE_KEY, "utf-8");
        const accessToken = jwt.sign(
            { userId: user._id, exp: Math.floor(Date.now() / 1000) + 260 * 60 * 2 }, //expire in 2 hour
            privateKey,
            signOptions
        );
        logger.info(`-- USER.LOGIN -- saved`);
        const lastLogin = moment.tz(Date.now(), config.timezone.zone);
        return await User.findByIdAndUpdate(user._id, { accessToken, lastLogin })
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