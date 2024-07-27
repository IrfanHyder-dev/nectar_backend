const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    unique: false,
    required: [true, 'Please provide a category name'],
  },
  image: {
    type: String,
    required: false,
  },
  color: { type: String },
});

// categorySchema.post(/^find/,(doc,next) =>{
//   const imageUrl = `${req.protocol}://${req.get('host')}/public/img/users/`;
//   doc.forEach(doc =>{
//     doc.image = `${imageUrl}${doc.image}`;
//   });
//   next();
// });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
