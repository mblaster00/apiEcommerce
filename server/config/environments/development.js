'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
const path = require('path');
var dotenv = require('dotenv');
dotenv.config({ path: '/opt/ecommerce.env' })

module.exports = {

    // MongoDB connection options
    // mongo: {
    //     useMongoClient: true,
    //     uri: process.env.MONGODB_URI,
    //     options: {
    //         auth: {
    //             authSource: process.env.MONGODB_AUTH_SOURCE
    //         },
    //         user: process.env.MONGODB_USER,
    //         pass: process.env.MONGODB_PASSWORD,
    //     }
    // },

    mongo: {
        uri: process.env.MONGODB_URI,
        options: {
          useNewUrlParser: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
          useCreateIndex: true,
        }
       },

    //expiration date of token
    time: {
        expiration: Math.floor(Date.now() / 1000) + 60 * 60 * 2,  // expire in 2 hour   60 * 60*2
    },
    // Files storage path
    pathUpload: process.env.PATH_FILE_UPLOAD,

    // file storage path product
    pathProduct: process.env.PATH_PRODUCT,

    timezone: {
        zone: "Africa/Dakar",
    },

    redis: {
        uri: process.env.REDIS_URL
    },

    PRIVATE_KEY: process.env.PRIVATE_KEY,

    PUBLIC_KEY: process.env.PUBLIC_KEY,

    // Server IP
    ip: '127.0.0.1',
    // Server port
    port: 9000,
    //localhost
    localhost: {
        uri: "http://localhost:9000/api/"
    }
};

