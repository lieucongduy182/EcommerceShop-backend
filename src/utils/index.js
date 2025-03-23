'use strict';

const _ = require('lodash');
const { Types } = require('mongoose');

class Utils {
  convertToObjectId(id) {
    return new Types.ObjectId(id);
  }

  getInfoData({ fields = [], object = {} }) {
    return _.pick(object, fields);
  }

  getSelectData(select = []) {
    return Object.fromEntries(select.map((field) => [field, 1]));
  }

  getUnSelectData(unSelect = []) {
    return Object.fromEntries(unSelect.map((field) => [field, 0]));
  }

  removeEmptyFields(object) {
    const removeEmpty = (obj) => {
      Object.entries(obj).forEach(([key, val]) => {
        if (val && typeof val === 'object') removeEmpty(val);
        if (val === null || val === undefined || val === '') delete obj[key];
      });
    };
    removeEmpty(object);
    return object;
  }

  parseNestedObject(object) {
    const result = {};
    const flatten = (obj, parentKey = '') => {
      Object.entries(obj).forEach(([key, val]) => {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (val && typeof val === 'object') {
          flatten(val, newKey);
        } else {
          result[newKey] = val;
        }
      });
    };

    flatten(object);
    return result;
  }
}

module.exports = new Utils();
