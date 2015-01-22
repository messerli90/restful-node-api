// DEPENDENCIES
// ==============================================
var bodyParser = require('body-parser');
var config = require('../../config');

// Controllers
var authCtrl = require('../controllers/authCtrl');
var userCtrl = require('../controllers/userCtrl');
var productCtrl = require('../controllers/productCtrl');


// ROUTES
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
    .put(authCtrl.isAuthenticated, userCtrl.belongsTo, userCtrl.update)
    .delete(authCtrl.isAuthenticated, userCtrl.belongsTo, userCtrl.delete);
  // /api/v1/users/:user_id/products
  router.route('/users/:user_id/products')
    .get(userCtrl.getProducts);


  // PRODUCT ROUTES -----------------------------
  // /api/v1/products
  router.route('/products')
    .post(authCtrl.isAuthenticated, productCtrl.create)
    .get(productCtrl.getAll);
  // /api/v1/products/:product_id
  router.route('/products/:product_id')
    .get(productCtrl.getOne)
    .put(authCtrl.isAuthenticated, productCtrl.belongsToUser, productCtrl.update)
    .delete(authCtrl.isAuthenticated, productCtrl.belongsToUser, productCtrl.delete);

  // RETURN ROUTER
  return router;
};