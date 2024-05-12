'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');

const connectString = 'mongodb://localhost:27017/shopDev';

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    mongoose
      .connect(connectString)
      .then(() => {
        const numConnections = countConnect();
        console.log(`Numbers Connection :::: ${numConnections}`);
        console.log(`MongoDB connected successfully`);
      })
      .catch((err) => console.log(`Error connect: ${err}`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.getInstance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
