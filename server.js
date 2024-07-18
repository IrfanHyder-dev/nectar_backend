const ngrok = require('ngrok');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});
const PORT = process.env.PORT || 80;
app.listen(PORT, async () => {
  console.log(`App running on port ${PORT}....`);

  console.log(`current environment is ${process.env.NODE_ENV}...`);

  if (process.env.NODE_ENV === 'ngrok') {
    try {
      const url = await ngrok.connect(PORT);
      console.log(`ngrok url is =====> ${url}`);
    } catch (error) {
      console.log(
        `got error while connecting to ngrok server. error is ${error}`,
      );
    }
  }
});

process.on('unhandledRejection', (err) => {
  console.log(
    `================ unhandeld errors  ${err.name}   ${err.message}`,
  );
  process.exit(1);
});
