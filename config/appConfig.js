/**
 * Include at the top of application to initialize env vars etc.
 */
const dotenv = require('dotenv');

dotenv.config(); // read .env files into process.env

const config = {
  dbConfig: {
    env: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: true,
    },
    credentials: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
  },
};

module.exports = config;
