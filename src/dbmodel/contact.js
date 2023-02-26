const { Sequelize, DataTypes } = require('sequelize');
const mysql = require("mysql2");
require("dotenv").config();

const DATABASE = process.env.DATABASE;
const USERNAME = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const connection = mysql.createConnection({
  host: 'localhost',
  user: USERNAME,
  password: PASSWORD,
});

connection.query(
  `CREATE DATABASE IF NOT EXISTS ${DATABASE}`,
  function (err, results) {
    console.log(results);
    console.log(err);
  }
);

connection.end();

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
});

const Contacts = sequelize.define('Contacts', {
    contact_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile_number: DataTypes.STRING
}, {
    freezeTableName: true
});

Contacts.sync();

module.exports = Contacts;