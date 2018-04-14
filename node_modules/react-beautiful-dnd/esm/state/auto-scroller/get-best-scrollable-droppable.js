import _Object$keys from 'babel-runtime/core-js/object/keys';

import memoizeOne from 'memoize-one';
import isPositionInFrame from '../visibility/is-position-in-frame';


var getScrollableDroppables = memoizeOne(function (droppables) {
  return _Object$keys(droppables).map(function (id) {
    return droppables[id];
  }).filter(function (droppable) {
    if (!droppable.isEnabled) {
      return false;
    }

    if (!droppable.viewport.closestScrollable) {
      return false;
    }

    return true;
  });
});

var getScrollableDroppableOver = function getScrollableDroppableOver(target, droppables) {
  var maybe = getScrollableDroppables(droppables).find(function (droppable) {
    if (!droppable.viewport.closestScrollable) {
      throw new Error('Invalid result');
    }
    return isPositionInFrame(droppable.viewport.closestScrollable.frame)(target);
  });

  return maybe;
};

export default (function (_ref) {
  var center = _ref.center,
      destination = _ref.destination,
      droppables = _ref.droppables;


  if (destination) {
    var _dimension = droppables[destination.droppableId];
    if (!_dimension.viewport.closestScrollable) {
      return null;
    }
    return _dimension;
  }

  var dimension = getScrollableDroppableOver(center, droppables);

  return dimension;
});