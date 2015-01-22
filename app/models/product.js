var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define Product Schema
var ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: String,
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // tags: [{
  //   _id: false,
  //   name: String
  // }],
  tags: [String],
  comments: [{
    _user: Schema.Types.ObjectId,
    text: String,
    created_at: {
      type: Date,
      default: Date.now()
    }
  }],
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  }
});

// Export Product model
module.exports = mongoose.model('Product', ProductSchema);