var dotenv = require('dotenv');
dotenv.config({ path: '/opt/ecommerce.env' })

// Imports
var express = require("express");
var bodyParser = require("body-parser");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("./models/users/user.model");
const expressConfig = require("./config/express");
const registerRoutes = require('./routes');
const compression = require("compression");
const config = require(`./config/environments/${process.env.NODE_ENV}.js`);
const fs = require("fs");
const cors = require('cors');

const PORT = config.port || 9000;

// Instatiate server
const app = express();
const helmet = require("helmet");
const server = require('http').Server(app);
var io = exports.io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
    }
});

io = io.listen(server);

// const mongooseConnectionPromise = mongoose.connect(config.mongo.uri, config.mongo.options);
// mongoose.connection.on('error', function(err) {
//     console.error(`MongoDB connection error: ${err}`);
//     process.exit(-1); // eslint-disable-line no-process-exit
// });

mongoose
    .connect(config.mongo.uri, config.mongo.options)
    .then(() => {
        console.log("Connected to the Database successfully");
    });


// Body Parser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(helmet());
app.use(compression()); // add compression for optimize request and response
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(cors())

app.use(async (req, res, next) => {
    let verifytoken = {
        // if has error in token or expire
        userId: null,
        exp: null,
    };
    if (req.headers["x-access-token"]) {
        const accessToken = req.headers["x-access-token"];
        const verifyOptions = {
            algorithms: [process.env.ALG],
        };
        var publicKey = fs.readFileSync(process.env.PUBLIC_KEY, "utf-8");
        const { userId, exp } = await jwt.verify(
            accessToken,
            publicKey,
            verifyOptions,
            (err, decode) => {
                if (err) {
                    return verifytoken;
                } else {
                    // success token
                    return {
                        userId: decode.userId,
                        exp: decode.exp,
                    };
                }
            }
        );
        // Check if token has expired
        if (exp < Date.now().valueOf() / 1000 || exp == null) {
            return res
                .status(401)
                .json({
                    error: "JWT token has expired, please login to obtain a new one",
                });
        }
        res.locals.loggedInUser = await User.findById(userId);
        next();
    } else {
        next();
    }
});

expressConfig(app);
registerRoutes(app);
//app.use('/', registerRoutes)

// global error handler
//app.use(errorHandler.errorHandler)

app.use((error, req, res, next) => {
    if (!error.statusCode) error.statusCode = 500;

    if (error.statusCode === 301) {
        //return res.status(301).redirect("/not-found");
    }
    return res.status(error.statusCode).json({ message: error.toString() });
});

// Launch server
app.listen(PORT, () => {
    console.log("Server is listening on Port:", PORT);
})
