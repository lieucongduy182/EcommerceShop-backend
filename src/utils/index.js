'use strict';

const _ = require('lodash');

class Utils {
  getInfoData({ fields = [], object = {} }) {
    return _.pick(object, fields);
  }
}

module.exports = new Utils();
