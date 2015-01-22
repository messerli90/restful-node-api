var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = require('../../config.js').secret;

// POST /api/v1/users
exports.create = function(req, res) {
  // Create a new user
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });
  // Save created User
  user.save(function(err) {
    // Username already exists
    if (err.code == 11000) {
      res.json({
        success: false,
        'message': 'Failed. A user with that username already exists.'
      });
    } else {
      res.send(err);
    }
    // Success
    res.json({
      message: 'User created.'
    });
  });
};

// GET /api/v1/users
exports.getAll = function(req, res) {
  // Find all users
  User.find(function(err, users) {
    if (err) res.send(err);
    // Success
    res.json(users);
  });
};

// GET /api/v1/users/:user_id
exports.getOne = function(req, res) {
  // Find user
  User.findById(req.params.user_id, function(err, user) {
    if (err) res.send(err);
    // Success
    res.json(user);
  });
};

// PUT /api/v1/users/:user_id
exports.update = function(req, res) {
  // Find user
  User.findById(req.params.user_id, function(err, user) {
    if (err) res.send(err);

    // Update only data that exists in request
    if (req.body.name) user.name = req.body.name;
    if (req.body.username) user.username = req.body.username;
    if (req.body.password) user.password = req.body.password;

    user.updated_at = Date.now();

    user.save(function(err) {
      if (err) res.send(err);

      res.json({
        message: 'User updated.'
      });
    });
  });
};

// DELETE /api/v1/users/:user_id
exports.delete = function(req, res) {
  User.remove({
    _id: req.params.user_id
  }, function(err, user) {
    if (err) res.send(err);

    res.json({
      message: 'User deleted.'
    });
  });
};


// Middleware to check if object belongs to user making call
exports.belongsTo = function(req, res, next) {
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

      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        if (!user) {
          res.json({
            success: false,
            message: 'User doesn\'t exist'
          });
        } else {
          // Success
          if (user._id != req.decoded.id) {
            console.log(req.decoded.id);
            res.status(403).send({
              success: false,
              message: 'Does not belong to user.'
            });
          } else {
            next();
          }
        }
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