'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getArea = require('../../state/get-area');

var _getArea2 = _interopRequireDefault(_getArea);

var _getWindowScroll = require('./get-window-scroll');

var _getWindowScroll2 = _interopRequireDefault(_getWindowScroll);

var _getMaxScroll = require('../../state/get-max-scroll');

var _getMaxScroll2 = _interopRequireDefault(_getMaxScroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var scroll = (0, _getWindowScroll2.default)();

  var top = scroll.y;
  var left = scroll.x;

  var doc = document.documentElement;

  var width = doc.clientWidth;
  var height = doc.clientHeight;

  var right = left + width;
  var bottom = top + height;

  var subject = (0, _getArea2.default)({
    top: top, left: left, right: right, bottom: bottom
  });

  var maxScroll = (0, _getMaxScroll2.default)({
    scrollHeight: doc.scrollHeight,
    scrollWidth: doc.scrollWidth,
    width: subject.width,
    height: subject.height
  });

  var viewport = {
    subject: subject,
    maxScroll: maxScroll,
    scroll: scroll
  };

  return viewport;
};