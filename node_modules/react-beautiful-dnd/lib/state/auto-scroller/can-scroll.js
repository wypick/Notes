'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDroppableOverlap = exports.getWindowOverlap = exports.canScrollDroppable = exports.canScrollWindow = exports.canPartiallyScroll = exports.getOverlap = undefined;

var _position = require('../position');

var origin = { x: 0, y: 0 };

var smallestSigned = (0, _position.apply)(function (value) {
  if (value === 0) {
    return 0;
  }
  return value > 0 ? 1 : -1;
});

var getOverlap = exports.getOverlap = function () {
  var getRemainder = function getRemainder(target, max) {
    if (target < 0) {
      return target;
    }
    if (target > max) {
      return target - max;
    }
    return 0;
  };

  return function (_ref) {
    var current = _ref.current,
        max = _ref.max,
        change = _ref.change;

    var targetScroll = (0, _position.add)(current, change);

    var overlap = {
      x: getRemainder(targetScroll.x, max.x),
      y: getRemainder(targetScroll.y, max.y)
    };

    if ((0, _position.isEqual)(overlap, origin)) {
      return null;
    }

    return overlap;
  };
}();

var canPartiallyScroll = exports.canPartiallyScroll = function canPartiallyScroll(_ref2) {
  var max = _ref2.max,
      current = _ref2.current,
      change = _ref2.change;

  var smallestChange = smallestSigned(change);

  var overlap = getOverlap({
    max: max, current: current, change: smallestChange
  });

  if (!overlap) {
    return true;
  }

  if (smallestChange.x !== 0 && overlap.x === 0) {
    return true;
  }

  if (smallestChange.y !== 0 && overlap.y === 0) {
    return true;
  }

  return false;
};

var canScrollWindow = exports.canScrollWindow = function canScrollWindow(viewport, change) {
  return canPartiallyScroll({
    current: viewport.scroll,
    max: viewport.maxScroll,
    change: change
  });
};

var canScrollDroppable = exports.canScrollDroppable = function canScrollDroppable(droppable, change) {
  var closestScrollable = droppable.viewport.closestScrollable;

  if (!closestScrollable) {
    return false;
  }

  return canPartiallyScroll({
    current: closestScrollable.scroll.current,
    max: closestScrollable.scroll.max,
    change: change
  });
};

var getWindowOverlap = exports.getWindowOverlap = function getWindowOverlap(viewport, change) {
  if (!canScrollWindow(viewport, change)) {
    return null;
  }

  var max = viewport.maxScroll;
  var current = viewport.scroll;

  return getOverlap({
    current: current,
    max: max,
    change: change
  });
};

var getDroppableOverlap = exports.getDroppableOverlap = function getDroppableOverlap(droppable, change) {
  if (!canScrollDroppable(droppable, change)) {
    return null;
  }

  var closestScrollable = droppable.viewport.closestScrollable;

  if (!closestScrollable) {
    return null;
  }

  return getOverlap({
    current: closestScrollable.scroll.current,
    max: closestScrollable.scroll.max,
    change: change
  });
};