const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.post(
  '/category',
  categoryController.uploadFields,
  categoryController.createCategory,
);

router.get('/categories', categoryController.getAllCateories);

module.exports = router;
