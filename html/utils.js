"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dashCase = dashCase;
exports.empty = empty;
exports.unique = unique;
exports.pick = pick;
exports.identity = identity;

function dashCase(str) {
  return typeof str === 'string' ? str.split(/([_A-Z])/).reduce((one, two, idx) => {
    const dash = !one || idx % 2 === 0 ? '' : '-';
    two = two === '_' ? '' : two;
    return `${one}${dash}${two.toLowerCase()}`;
  }) : str;
}

function empty(val) {
  return val == null;
} // return a new array with unique items (duplicates removed)


function unique(array) {
  return Array.from(new Set(array));
} // return a new object with `properties` picked from `source`


function pick(source, properties) {
  let result = {};
  properties.forEach(prop => {
    result[prop] = source[prop];
  });
  return result;
}

function identity(v) {
  return v;
}