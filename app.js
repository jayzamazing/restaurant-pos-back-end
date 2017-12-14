'use strict';
require('dotenv').config();
const path = require('path');
const Express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const {basicStrategy, jwtStrategy} = require('./helpers/strategy');
const {User} = require('./models/users');
const { Router : authRouter } = require('./routes/auth');
const { Router : userRouter } = require('./routes/users');
const { Router : categoryRouter } = require('./routes/categories');
const { STATIC } = require('./config/serverConfig');
const bodyParser = require('body-parser');
const {logger} = require('./helpers/logger');
const app = Express();
//logging
app.use(morgan('common', {stream: logger.stream}));
//cors
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

app.use(Express.static(path.join(__dirname, STATIC)));
//used for form submissions
app.use(bodyParser.urlencoded({ extended: false }));
//used for json submissions
app.use(bodyParser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);
app.use('/auth/', authRouter);
app.use('/users/', userRouter);
app.use('/categories/', categoryRouter);
app.use('*', (req, res) => {
  res.status(200).sendFile(path.join(__dirname + STATIC + '/index.html'));
});


exports.app = app;
