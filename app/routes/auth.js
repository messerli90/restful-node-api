// DEPENDENCIES
// ==============================================
var bodyParser = require('body-parser');
var config = require('../../config');
var jwt = require('jsonwebtoken');
var secret = require('../../config.js').secret;

// Controllers
var authCtrl = require('../controllers/authCtrl');


// Create a JWT
var createToken = function(user_id, secret) {
  var token = jwt.sign({
    id: user_id
  }, secret, {
    expiresInMinutes: 60 * 24 * 7 // 7 days
  });
  return token;
};


// ROUTES
// ==============================================
module.exports = function(express) {
  // Define router
  var router = express.Router();

  router.route('/')
    .post(authCtrl.authorize, function(req, res) {
      // Issue token
      var token = createToken(req.user._id, secret);

      res.json({ success: true, message: 'User authenticated', token: token });
    });

  return router;
};