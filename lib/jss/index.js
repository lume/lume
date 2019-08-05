"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jss = _interopRequireDefault(require("jss"));

var _jssNested = _interopRequireDefault(require("jss-nested"));

var _jssExtend = _interopRequireDefault(require("jss-extend"));

var _jssPx = _interopRequireDefault(require("jss-px"));

var _jssVendorPrefixer = _interopRequireDefault(require("jss-vendor-prefixer"));

var _jssCamelCase = _interopRequireDefault(require("jss-camel-case"));

var _jssPropsSort = _interopRequireDefault(require("jss-props-sort"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jss = _jss.default.create();

jss.use((0, _jssNested.default)());
jss.use((0, _jssExtend.default)());
jss.use((0, _jssPx.default)());
jss.use((0, _jssVendorPrefixer.default)());
jss.use((0, _jssCamelCase.default)());
jss.use((0, _jssPropsSort.default)());
var _default = jss;
exports.default = _default;