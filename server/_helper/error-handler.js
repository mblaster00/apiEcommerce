const logger = require('../components/logger/index');
const moment = require('moment');
moment.locale('fr');

module.exports = {
    errorHandler: function errorHandler(err, req, res, next) {
        if (typeof (err) === 'string') {
            // custom application error
            return res.status(400).json({ message: err });
        }

        if (err.name === 'UnauthorizedError') {
            // jwt authentication error
            return res.status(401).json({ message: 'Invalid Token' });
        }

        // default to 500 server error
        return res.status(500).json({ message: err.message });
    },

    respondWithResult: function respondWithResult(res, statusCode) {
        statusCode = statusCode || 200;
        return function (entity) {
            if (entity) {
                logger.info(`--- espondWithResult --- statusCode error : ${statusCode}`);
                return res.status(statusCode).json(entity);
            }
            return null;
        };
    },

    patchUpdates: function patchUpdates(patches) {
        return function (entity) {
            try {
                applyPatch(entity, patches, true);
            } catch (err) {
                return Promise.reject(err);
            }

            return entity.save();
        };
    },

    removeEntity: function removeEntity(res) {
        return function (entity) {
            if (entity) {
                logger.info(`--- removeENTITY --- successfully done`);
                return entity.remove().then(
                    res.status(200).json({ message: `Successfully Deteted.` })
                )
            }
        };
    },

    handleEntityNotFound: function handleEntityNotFound(res) {
        return function (entity) {
            if (!entity) {
                logger.info(`--- handleEntityNotFound --- statusCode error : 404`);
                res.status(404).json({ error: `Reference Id not found. Requested resource does not exist.` });
                return null;
            }
            return entity;
        };
    },

    validationError: function validationError(res, statusCode, msg) {
        statusCode = statusCode || 422;
        logger.info(`--- VALIDATIONERROR --- statusCode error : ${statusCode} - message error : ${msg}`);
        return res.status(statusCode).json(msg);
    },

    handleError: function handleError(res, statusCode, msg) {
        statusCode = statusCode || 500;
        logger.info(`--- HANDLEERROR --- statusCode error : ${statusCode} - message error : ${msg}`);
        if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
            this.sendErrorMail(typeBug, statusCode, msg, process.env.NODE_ENV);
        }
        return res.status(statusCode).json({ error: msg.message, status: statusCode });
    }
}