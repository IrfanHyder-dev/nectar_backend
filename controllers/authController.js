const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const AppError = require('../utils/appErrors');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res,msg) => {
  const token = signToken(user._id);
  console.log(`Token: ${token}`);
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    message:msg,
    data:{
      authtoken:token,
      user:user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  createSendToken(newUser, 201, res,'Account created successfully.');
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
// console.log(user);
// console.log(!user);
// console.log((await user.correctPassword( user.password,password)));
  if (!user || !(await user.correctPassword(user.password,password))) {
   return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res, "Logged in successfully.");
});
