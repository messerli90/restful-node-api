
// DEPENDENCIES
// ==============================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var passport = require('passport');
var config = require('./config');

// CONFIGURATION
// ==============================================
// Connect to DB
var db = config.database;
mongoose.connect(db);

// BodyParser for POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handle CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// Log all requests to the console
app.use(morgan('dev'));

// Static files location
app.use(express.static(__dirname + '/public'));

// Initialize Passport!!! (This only wasted 2h of my time)
app.use(passport.initialize());

// ROUTER
// ==============================================

// API
var apiRouter = require('./app/routes/index.js')(app, express);
app.use('/api/v1', apiRouter);

// Front End
app.get('*', function(req, res) {
  res.send('Welcome to the front end');
});

// START SERVER
// ==============================================
app.listen(config.port);
console.log('Serving beer on port ' + config.port);