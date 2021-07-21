'use strict';

// get environment variable from .env file
require('dotenv').config();

// intialize
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    cors = require('cors'),
    jsonwebtoken = require("jsonwebtoken");

app.use(cors());

// connect to MongoDB
const dbo = require("./db/connection");

dbo.connectToServer(function (err) {
    if (err) console.error(err);
});

// connect to routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function (err, decode) {
            if (err) req.account = undefined;
            req.account = decode;
            next();
        });
    } else {
        req.account = undefined;
        next();
    }
});

require("./api/routes/accountRoute")(app);
require("./api/routes/courseRoute")(app);
require("./api/routes/discussionRoute")(app);
require("./api/routes/attendanceRoute")(app);

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

// start server
app.listen(port);

console.log('RESTful API server started on: ' + port);

module.exports = app;