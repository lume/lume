"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testWithSeparator = testWithSeparator;
exports.checkValues = checkValues;

function testWithSeparator(a, separator, ...values) {
  let string = `${values[0]}${separator} ${values[1]}${separator} ${values[2]}`;
  expect(() => a.fromString(string, separator)).not.toThrow(); // a.fromString(string, separator)

  checkValues(a, ...values);
  string = `${values[0]}${separator}      ${values[1]}${separator}${values[2]}    `;
  expect(() => a.fromString(string, separator)).not.toThrow();
  checkValues(a, ...values);
  string = `  ${values[0]}  ${values[1]}${separator}     ${values[2]}  `;
  expect(() => a.fromString(string, separator)).not.toThrow();
  checkValues(a, ...values);
}

function checkValues(v, x, y, z) {
  expect(v.x).toBe(x);
  expect(v.y).toBe(y);
  expect(v.z).toBe(z);
}