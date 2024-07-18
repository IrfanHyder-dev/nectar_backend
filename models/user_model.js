const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.correctPassword = async function (password, newPassword) {
  return await bcrypt.compare(newPassword, password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
