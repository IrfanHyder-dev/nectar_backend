const express = require('express');
// const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const AppError = require('./utils/appErrors');
const globalErrorHandler = require('./controllers/errorController');
// dotenv.config({ path: './config.env' });

const app = express();
// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res, next) => {
  console.log(`api body is ${req.body}`);
  res.status(200).json({ message: 'API is running' });
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1', categoryRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
