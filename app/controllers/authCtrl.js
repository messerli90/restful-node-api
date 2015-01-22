// Dependencies
var passport = require('passport');
var jwt = require('jsonwebtoken');
var secret = require('../../config.js').secret;

// Strategies
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;

// Models
var User = require('../models/user');

// Local Strategy
passport.use(new LocalStrategy({
    // Set custom parameters
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, callback) {
    User.findOne({
        username: username
      },
      function(err, user) {
        if (err) {
          return callback(err);
        }

        // No user found with that username
        if (!user) {
          return callback(null, false, {
            message: 'Incorrect username.'
          });
        }

        // Validate password
        user.validPassword(password, function(err, isMatch) {
          if (err) {
            return callback(err);
          }

          // Password mismatch
          if (!isMatch) {
            return callback(null, false, {
              message: 'Incorrect password.'
            });
          }

          // Success

          return callback(null, user);
        });
      });
  }
));

// Basic Strategy
passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({
        username: username
      }, '+password', // include password in query
      function(err, user) {
        if (err) {
          return callback(err);
        }
        // No user found with that username
        if (!user) {
          return callback(null, false, {
            message: 'Invalid Username.'
          });
        }
        // Make sure the password is correct
        user.verifyPassword(password, function(err, isMatch) {
          if (err) {
            return callback(err);
          }
          // Password did not match
          if (!isMatch) {
            return callback(null, false, {
              message: 'Invalid Password.'
            });
          }
          // Success
          return callback(null, user);
        });
      });
  }
));

// Check token to authenticate
exports.isAuthenticated = function(req, res, next) {
  // Check header, url params, or post params for token
  var token = req.body.token || req.params.token || req.headers['x-access-token'];

  // Decode token
  if (token) {
    // verify token and expiration
    jwt.verify(token, secret, function(err, decoded) {
      if (err) res.status(403).json({
        success: false,
        message: 'Failed to authenticate token.'
      });

      req.decoded = decoded;

      User.findOne({
        _id: decoded.id
      }, function(err, user) {
        if (err) res.send(err);
        req.user = user;
        next();
      });

    });
  } else {
    // No token
    res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
};

// TODO: DRY this code
var tokenCheck = function(req, res) {

};


exports.authorize = passport.authenticate(['basic', 'local'], {
  session: false
});