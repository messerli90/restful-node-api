var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define Comment ChildSchema
var CommentSchema = new Schema({
  _user: Schema.Types.ObjectId,
  text: String,
  updated_at: {
    type: Date,
    default: Date.now()
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

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
  tags: [String],
  comments: [CommentSchema],
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