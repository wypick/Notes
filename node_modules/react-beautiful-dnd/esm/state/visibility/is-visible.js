
import isPartiallyVisibleThroughFrame from './is-partially-visible-through-frame';
import isTotallyVisibleThroughFrame from './is-totally-visible-through-frame';
import { offsetByPosition } from '../spacing';


var origin = { x: 0, y: 0 };

var isVisible = function isVisible(_ref) {
  var target = _ref.target,
      destination = _ref.destination,
      viewport = _ref.viewport,
      isVisibleThroughFrameFn = _ref.isVisibleThroughFrameFn;

  var displacement = destination.viewport.closestScrollable ? destination.viewport.closestScrollable.scroll.diff.displacement : origin;
  var withDisplacement = offsetByPosition(target, displacement);

  if (!destination.viewport.clipped) {
    return false;
  }

  var isVisibleInDroppable = isVisibleThroughFrameFn(destination.viewport.clipped)(withDisplacement);

  var isVisibleInViewport = isVisibleThroughFrameFn(viewport)(withDisplacement);

  return isVisibleInDroppable && isVisibleInViewport;
};

export var isPartiallyVisible = function isPartiallyVisible(_ref2) {
  var target = _ref2.target,
      destination = _ref2.destination,
      viewport = _ref2.viewport;
  return isVisible({
    target: target,
    destination: destination,
    viewport: viewport,
    isVisibleThroughFrameFn: isPartiallyVisibleThroughFrame
  });
};

export var isTotallyVisible = function isTotallyVisible(_ref3) {
  var target = _ref3.target,
      destination = _ref3.destination,
      viewport = _ref3.viewport;
  return isVisible({
    target: target,
    destination: destination,
    viewport: viewport,
    isVisibleThroughFrameFn: isTotallyVisibleThroughFrame
  });
};