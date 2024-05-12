'use strict';

const mongoose = require('mongoose');
const os = require('os');

const _SECONDS_TO_CHECK = 5000;

const countConnect = () => {
  const numConnections = mongoose.connections.length;
  return numConnections;
};

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnections = countConnect();
    // get memory and cores
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Example maximum number of connections based on number of cores
    const maximumConnections = numCores * 5;

    console.log(`Active connections::: ${numConnections}`);
    console.log(`Memory Usage::: ${memoryUsage / 1024 / 1024} MB`);
    if (numConnections > maximumConnections) {
      console.log('Connection overload detected');
    }
  }, _SECONDS_TO_CHECK);
};

module.exports = {
  countConnect,
  checkOverload
};
