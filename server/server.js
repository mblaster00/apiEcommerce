// Imports
var express = require("express");
var bodyParser = require("body-parser");
var dotenv = require('dotenv');
dotenv.config({ path: '/opt/ecommerce.env' })

const mongoose = require("mongoose");
const expressConfig = require("./config/express");
const registerRoutes = require('./routes');
const compression = require("compression");
const config = require(`./config/environments/${process.env.NODE_ENV}.js`);
const cors = require('cors');
const errorHandler = require('./_helper/error-handler');
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

expressConfig(app);
registerRoutes(app);

// global error handler
//app.use(errorHandler)

// Launch server
app.listen(PORT, () => {
    console.log("Server is listening on Port:", PORT);
})