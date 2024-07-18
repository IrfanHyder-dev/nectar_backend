const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./natours_app');

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port...`);
});

process.on('unhandledRejection', (err) => {
  console.log(
    `================ unhandeld errors  ${err.name}   ${err.message}`,
  );
  process.exit(1);
});
