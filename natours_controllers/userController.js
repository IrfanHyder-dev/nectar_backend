const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const Users = require('../natours_models/user_model');
const AppError = require('../utils/appErrors');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];

//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update', 400));
  }

  const filterBody = filterObj(req.body, 'email', 'name');
  if (req.file) filterBody.photo = req.file.filename;
  const updatedUser = await Users.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidator: true,
  });

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Users.findByIdAndUpdate(req.user.id, { active: false });
  res
    .status(204)
    .json({ success: true, message: 'User deleted successfully', data: null });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.updateUser = factory.updateOne(Users);
exports.deleteUser = factory.deleteOne(Users);
exports.getAllUsers = factory.getAll(Users);
exports.getUser = factory.getOne(Users);
