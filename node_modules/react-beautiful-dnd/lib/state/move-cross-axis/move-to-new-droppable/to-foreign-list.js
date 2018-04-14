'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moveToEdge = require('../../move-to-edge');

var _moveToEdge2 = _interopRequireDefault(_moveToEdge);

var _getDisplacement = require('../../get-displacement');

var _getDisplacement2 = _interopRequireDefault(_getDisplacement);

var _withDroppableDisplacement = require('../../with-droppable-displacement');

var _withDroppableDisplacement2 = _interopRequireDefault(_withDroppableDisplacement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var amount = _ref.amount,
      pageCenter = _ref.pageCenter,
      target = _ref.target,
      insideDroppable = _ref.insideDroppable,
      draggable = _ref.draggable,
      droppable = _ref.droppable,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var axis = droppable.axis;
  var isGoingBeforeTarget = Boolean(target && pageCenter[droppable.axis.line] < target.page.marginBox.center[droppable.axis.line]);

  if (!target) {

    var _newCenter = (0, _moveToEdge2.default)({
      source: draggable.page.paddingBox,
      sourceEdge: 'start',
      destination: droppable.page.contentBox,
      destinationEdge: 'start',
      destinationAxis: axis
    });

    var _newImpact = {
      movement: {
        displaced: [],
        amount: amount,
        isBeyondStartPosition: false
      },
      direction: axis.direction,
      destination: {
        droppableId: droppable.descriptor.id,
        index: 0
      }
    };

    return {
      pageCenter: (0, _withDroppableDisplacement2.default)(droppable, _newCenter),
      impact: _newImpact
    };
  }

  var targetIndex = insideDroppable.indexOf(target);
  var proposedIndex = isGoingBeforeTarget ? targetIndex : targetIndex + 1;

  if (targetIndex === -1) {
    console.error('could not find target inside destination');
    return null;
  }

  var newCenter = (0, _moveToEdge2.default)({
    source: draggable.page.paddingBox,
    sourceEdge: 'start',
    destination: target.page.marginBox,
    destinationEdge: isGoingBeforeTarget ? 'start' : 'end',
    destinationAxis: axis
  });

  var displaced = insideDroppable.slice(proposedIndex, insideDroppable.length).map(function (dimension) {
    return (0, _getDisplacement2.default)({
      draggable: dimension,
      destination: droppable,
      viewport: viewport.subject,
      previousImpact: previousImpact
    });
  });

  var newImpact = {
    movement: {
      displaced: displaced,
      amount: amount,
      isBeyondStartPosition: false
    },
    direction: axis.direction,
    destination: {
      droppableId: droppable.descriptor.id,
      index: proposedIndex
    }
  };

  return {
    pageCenter: (0, _withDroppableDisplacement2.default)(droppable, newCenter),
    impact: newImpact
  };
};