// Imports
var ApiKey = require("../../models/apiKey/apiKey.model");
var logger = require("../../components/logger/index");
const errorHandler = require('../../_helper/error-handler');


// getApiKey
exports.getApiKey = async (req, res, next) => {
    logger.info(`-- REQUEST.QUOTE -- start function --`);
    try {
        logger.info(`-- REQUEST.QUOTE -- saved`);
        return await ApiKey.findOne({userId: req.params.userId}).exec()
            .then((apikey) => {
                logger.info("-- GET.ApiKey --" + `id apikey : ${apikey._id}`);
                return res.status(200).json({ data: apikey });
            })
            .catch((error) => {
                logger.info(
                    `-- ApiKey.ERROR-- error : ${error}`
                );
            });
    } catch (error) {
        logger.info(
            `-- ApiKey.ERROR-- : ${error.toString()}`
        );
    }
};