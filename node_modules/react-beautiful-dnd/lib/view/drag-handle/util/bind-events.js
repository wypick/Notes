'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unbindEvents = exports.bindEvents = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bindEvents = exports.bindEvents = function bindEvents(el, bindings, sharedOptions) {
  bindings.forEach(function (binding) {
    var options = (0, _extends3.default)({}, sharedOptions, binding.options);

    el.addEventListener(binding.eventName, binding.fn, options);
  });
};

var unbindEvents = exports.unbindEvents = function unbindEvents(el, bindings, sharedOptions) {
  bindings.forEach(function (binding) {
    var options = (0, _extends3.default)({}, sharedOptions, binding.options);

    el.removeEventListener(binding.eventName, binding.fn, options);
  });
};