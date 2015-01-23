// Model
var Product = require('../models/product.js');

// Middleware to check ownership
exports.belongsToUser = function(req, res, next) {
  Product.findById(req.params.product_id, function(err, product) {
    if (err) return res.send(err);
    if (product._user.toString() != req.user._id.toString()) {
      res.status(403).send({
        success: false,
        message: 'Does not belong to user.',
        creator: product._user,
        user: req.user._id
      });
    } else {
      next();
    }
  });
};

// POST /api/v1/products
exports.create = function(req, res) {
  // Create new Product
  var product = new Product();
  product.name = req.body.name;
  product.desc = req.body.desc;
  product._user = req.user._id;
  if (req.body.tags) {
    req.body.tags.forEach(function(tag) {
      product.tags.addToSet(tag);
    });
  }


  // Save Product
  product.save(function(err) {
    if (err) return res.send(err);
    res.json({
      message: 'Product created.',
      data: product
    });
  });
};

// GET /api/v1/products
exports.getAll = function(req, res) {
  // Get all products
  Product.find(function(err, products) {
    if (err) return res.send(err);
    res.json(products);
  });
};

// GET /api/v1/products/:product_id
exports.getOne = function(req, res) {
  // Get product
  Product.findById(req.params.product_id, function(err, product) {
    if (err) return res.send(err);

    res.json(product);
  });
};

// PUT /api/v1/products/:product_id
exports.update = function(req, res) {
  // Get product
  Product.findById(req.params.product_id, function(err, product) {
    if (err) return res.send(err);

    // Update product
    if (req.body.name) product.name = req.body.name;
    if (req.body.desc) product.desc = req.body.desc;
    if (req.body.tags) {
      req.body.tags.forEach(function(tag) {
        product.tags.addToSet(tag);
      });
    }

    product.updated_at = Date.now();
    // Save product
    product.save(function(err) {
      if (err) return res.send(err);

      res.json({
        message: 'Product updated',
        data: product
      });
    });
  });
};

// DELETE /api/v1/users/:product_id
exports.delete = function(req, res) {
  Product.remove({
    _id: req.params.product_id
  }, function(err, product) {
    if (err) return res.send(err);

    res.json({
      message: 'Product deleted.'
    });
  });
};