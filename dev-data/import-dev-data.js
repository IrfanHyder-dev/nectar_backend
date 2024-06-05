const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/tour_model');
const Users = require('../models/user_model');
const Reviews = require('../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful');
  });
/// Read json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours.json`, 'utf-8'),
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'),
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/data/reviews.json`, 'utf-8'),
);

///  import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    await Users.create(users, { validateBeforeSave: false });
    await Reviews.create(reviews);
    console.log('Data successfuly loaded');
    process.exit();
  } catch (err) {
    console.log('================ error while importing data', err);
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Users.deleteMany();
    await Reviews.deleteMany();
    console.log('Data successfuly deleted');
    process.exit();
  } catch (err) {
    console.log('================ error while importing data', err);
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
