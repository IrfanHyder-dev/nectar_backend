const multer = require('multer');
const sharp = require('sharp');
const Category = require('../models/category_model');
const AppError = require('../utils/appErrors');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });
exports.uploadFields = upload.single('image');

function formatText(input) {
  return input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}
exports.createCategory = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No image uploaded', 400));

  let fileType =
    req.file.mimetype === 'image/svg+xml' ? 'svg' : req.file.mimetype;
  fileType = fileType.replace('image/', '');
  req.file.filename = `category-${formatText(req.body.categoryName)}-${Date.now()}-cover.${fileType}`;

  await sharp(req.file.buffer).toFile(
    `public/img/category/${req.file.filename}`,
  );
  const imageUrl = `/public/img/category/${req.file.filename}`;
  req.body.image = imageUrl;
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category,
  });
});

exports.getAllCateories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  if (!categories) return next(new AppError('No categories found', 404));

  res.status(200).json({
    success: true,
    message: 'All Categories',
    data: {
      categories,
    },
  });
});
