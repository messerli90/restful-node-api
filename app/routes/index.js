// DEPENDENCIES
// ==============================================
var bodyParser = require('body-parser');
var config = require('../../config');

// Controllers
var authCtrl = require('../controllers/authCtrl');
var userCtrl = require('../controllers/userCtrl');


// CONFIGURATION
// ==============================================
module.exports = function(app, express) {
  // Define router
  var router = express.Router();

  // USER ROUTES --------------------------------
  // /api/v1/users
  router.route('/users')
    .get(authCtrl.isAuthenticated, userCtrl.getAll)
    .post(userCtrl.create);
  // /api/v1/users/:user_id
  router.route('/users/:user_id')
    .get(authCtrl.isAuthenticated, userCtrl.getOne)
    .put(authCtrl.isAuthenticated, userCtrl.belongsTo, userCtrl.update);

  // RETURN ROUTER
  return router;
};