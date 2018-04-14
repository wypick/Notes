'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moveToEdge = require('./move-to-edge');

var _moveToEdge2 = _interopRequireDefault(_moveToEdge);

var _getDraggablesInsideDroppable = require('./get-draggables-inside-droppable');

var _getDraggablesInsideDroppable2 = _interopRequireDefault(_getDraggablesInsideDroppable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var movement = _ref.movement,
      draggable = _ref.draggable,
      draggables = _ref.draggables,
      destination = _ref.destination;

  var homeCenter = draggable.client.marginBox.center;

  if (destination == null) {
    return homeCenter;
  }

  var displaced = movement.displaced,
      isBeyondStartPosition = movement.isBeyondStartPosition;

  var axis = destination.axis;

  var isWithinHomeDroppable = destination.descriptor.id === draggable.descriptor.droppableId;

  if (isWithinHomeDroppable && !displaced.length) {
    return homeCenter;
  }

  var draggablesInDestination = (0, _getDraggablesInsideDroppable2.default)(destination, draggables);

  var destinationFragment = function () {
    if (isWithinHomeDroppable) {
      return draggables[displaced[0].draggableId].client.marginBox;
    }

    if (displaced.length) {
      return draggables[displaced[0].draggableId].client.marginBox;
    }

    if (draggablesInDestination.length) {
      return draggablesInDestination[draggablesInDestination.length - 1].client.marginBox;
    }

    return destination.client.contentBox;
  }();

  var _ref2 = function () {
    if (isWithinHomeDroppable) {
      if (isBeyondStartPosition) {
        return { sourceEdge: 'end', destinationEdge: 'end' };
      }

      return { sourceEdge: 'start', destinationEdge: 'start' };
    }

    if (!displaced.length && draggablesInDestination.length) {
      return { sourceEdge: 'start', destinationEdge: 'end' };
    }

    return { sourceEdge: 'start', destinationEdge: 'start' };
  }(),
      sourceEdge = _ref2.sourceEdge,
      destinationEdge = _ref2.destinationEdge;

  var source = draggable.client.marginBox;

  var targetCenter = (0, _moveToEdge2.default)({
    source: source,
    sourceEdge: sourceEdge,
    destination: destinationFragment,
    destinationEdge: destinationEdge,
    destinationAxis: axis
  });

  return targetCenter;
};