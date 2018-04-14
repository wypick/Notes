'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _position = require('../position');

var _canScroll = require('./can-scroll');

exports.default = function (_ref) {
  var move = _ref.move,
      scrollDroppable = _ref.scrollDroppable,
      scrollWindow = _ref.scrollWindow;

  var moveByOffset = function moveByOffset(state, offset) {
    var drag = state.drag;
    if (!drag) {
      console.error('Cannot move by offset when not dragging');
      return;
    }

    var client = (0, _position.add)(drag.current.client.selection, offset);
    move(drag.initial.descriptor.id, client, drag.current.viewport, true);
  };

  var scrollDroppableAsMuchAsItCan = function scrollDroppableAsMuchAsItCan(droppable, change) {
    if (!(0, _canScroll.canScrollDroppable)(droppable, change)) {
      return change;
    }

    var overlap = (0, _canScroll.getDroppableOverlap)(droppable, change);

    if (!overlap) {
      scrollDroppable(droppable.descriptor.id, change);
      return null;
    }

    var whatTheDroppableCanScroll = (0, _position.subtract)(change, overlap);
    scrollDroppable(droppable.descriptor.id, whatTheDroppableCanScroll);

    var remainder = (0, _position.subtract)(change, whatTheDroppableCanScroll);
    return remainder;
  };

  var scrollWindowAsMuchAsItCan = function scrollWindowAsMuchAsItCan(viewport, change) {
    if (!(0, _canScroll.canScrollWindow)(viewport, change)) {
      return change;
    }

    var overlap = (0, _canScroll.getWindowOverlap)(viewport, change);

    if (!overlap) {
      scrollWindow(change);
      return null;
    }

    var whatTheWindowCanScroll = (0, _position.subtract)(change, overlap);
    scrollWindow(whatTheWindowCanScroll);

    var remainder = (0, _position.subtract)(change, whatTheWindowCanScroll);
    return remainder;
  };

  var jumpScroller = function jumpScroller(state) {
    var drag = state.drag;

    if (!drag) {
      return;
    }

    var request = drag.scrollJumpRequest;

    if (!request) {
      return;
    }

    var destination = drag.impact.destination;

    if (!destination) {
      console.error('Cannot perform a jump scroll when there is no destination');
      return;
    }

    var droppableRemainder = scrollDroppableAsMuchAsItCan(state.dimension.droppable[destination.droppableId], request);

    if (!droppableRemainder) {
      return;
    }

    var viewport = drag.current.viewport;
    var windowRemainder = scrollWindowAsMuchAsItCan(viewport, droppableRemainder);

    if (!windowRemainder) {
      return;
    }

    moveByOffset(state, windowRemainder);
  };

  return jumpScroller;
};