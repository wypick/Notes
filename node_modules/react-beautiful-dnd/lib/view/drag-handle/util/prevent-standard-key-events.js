'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _preventedKeys;

var _keyCodes = require('../../key-codes');

var keyCodes = _interopRequireWildcard(_keyCodes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var preventedKeys = (_preventedKeys = {}, _preventedKeys[keyCodes.enter] = true, _preventedKeys[keyCodes.tab] = true, _preventedKeys);

exports.default = function (event) {
  if (preventedKeys[event.keyCode]) {
    event.preventDefault();
  }
};