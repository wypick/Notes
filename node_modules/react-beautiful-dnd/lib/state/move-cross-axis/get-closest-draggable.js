'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _position = require('../position');

var _isVisible = require('../visibility/is-visible');

var _withDroppableDisplacement = require('../with-droppable-displacement');

var _withDroppableDisplacement2 = _interopRequireDefault(_withDroppableDisplacement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var axis = _ref.axis,
      viewport = _ref.viewport,
      pageCenter = _ref.pageCenter,
      destination = _ref.destination,
      insideDestination = _ref.insideDestination;

  if (!insideDestination.length) {
    return null;
  }

  var result = insideDestination.filter(function (draggable) {
    return (0, _isVisible.isTotallyVisible)({
      target: draggable.page.marginBox,
      destination: destination,
      viewport: viewport.subject
    });
  }).sort(function (a, b) {
    var distanceToA = (0, _position.distance)(pageCenter, (0, _withDroppableDisplacement2.default)(destination, a.page.marginBox.center));
    var distanceToB = (0, _position.distance)(pageCenter, (0, _withDroppableDisplacement2.default)(destination, b.page.marginBox.center));

    if (distanceToA < distanceToB) {
      return -1;
    }

    if (distanceToB < distanceToA) {
      return 1;
    }

    return a.page.marginBox[axis.start] - b.page.marginBox[axis.start];
  });

  return result.length ? result[0] : null;
};