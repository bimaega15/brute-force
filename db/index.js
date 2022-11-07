const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAME_DB,
  process.env.PASSWORD_DB,
  {
    host: process.env.HOST,
    dialect: process.env.USE_DB,
  }
);

module.exports = {
  sequelize,
};
