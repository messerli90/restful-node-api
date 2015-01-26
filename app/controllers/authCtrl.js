// Dependencies
var passport = require('passport');
var jwt = require('jsonwebtoken');
var secret = require('../../config.js').secret;
var Client = require('../models/client');
var Token = require('../models/token');

// Strategies
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

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

// OAuth2.0 Client
passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    Client.findOne({
      id: username
    }, function(err, client) {
      if (err) return callback(err);

      // No client found with that id or bad password
      if (!client || client.secret !== password) return callback(null, false);

      // Success
      return callback(null, client);
    });
  }
));

// Bearer
passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({ value: accessToken },
      function(err, token) {
        if (err) return callback(err);

        // No token found
        if (!token) return callback(null, false);

        User.findOne({ _id: token.userId }, function(err, user) {
          if (err) return callback(err);

          // No user found
          if (!user) return callback(null, false);

          // Simple example with no scope
          callback(null, user, { scope: '*' });
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
      if (err) return res.status(403).json({
        success: false,
        message: 'Failed to authenticate token.'
      });

      req.decoded = decoded;

      User.findOne({
        _id: decoded.id
      }, function(err, user) {
        if (err) return res.send(err);
        req.user = user;
        next();
      });

    });
  } else {
    // No token
    return res.status(403).send({
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

exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false });

exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });