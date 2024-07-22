const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categroyName: {
    type: String,
    unique: true,
    required: [true, 'Please provide a category name'],
  },
  image: {
    type: String,
    required: false,
  },
  color: { type: String },
});

const Categroy = mongoose.model('Category', categorySchema);
module.exports = Categroy;
