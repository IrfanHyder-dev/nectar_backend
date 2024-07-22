const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user_model');
const AppError = require('../utils/appErrors');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only images are allowed.', 400));
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadImage = upload.single('image');
// upload.fields([{ name: 'image', maxCount: 1 }]);
exports.resizeUserImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-222-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  // Construct the image URL
  const imageUrl = `${req.protocol}://${req.get('host')}/public/img/users/${req.file.filename}`;
  res.status(200).json({
    success: true,
    image: imageUrl,
  });
});
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res, msg) => {
  const token = signToken(user._id);
  console.log(`Token: ${token}`);
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    message: msg,
    data: {
      authtoken: token,
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  createSendToken(newUser, 201, res, 'Account created successfully.');
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(user.password, password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res, 'Logged in successfully.');
});
