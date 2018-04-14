import _Object$keys from 'babel-runtime/core-js/object/keys';

import memoizeOne from 'memoize-one';
import getArea from './get-area';
import getDraggablesInsideDroppable from './get-draggables-inside-droppable';
import isPositionInFrame from './visibility/is-position-in-frame';
import { patch } from './position';
import { expandByPosition } from './spacing';
import { clip } from './dimension';


var getRequiredGrowth = memoizeOne(function (draggable, draggables, droppable) {

  var getResult = function getResult(existingSpace) {
    var requiredSpace = draggable.page.marginBox[droppable.axis.size];

    if (requiredSpace <= existingSpace) {
      return null;
    }
    var requiredGrowth = patch(droppable.axis.line, requiredSpace - existingSpace);

    return requiredGrowth;
  };

  var dimensions = getDraggablesInsideDroppable(droppable, draggables);

  if (!dimensions.length) {
    var _existingSpace = droppable.page.marginBox[droppable.axis.size];
    return getResult(_existingSpace);
  }

  var endOfDraggables = dimensions[dimensions.length - 1].page.marginBox[droppable.axis.end];
  var endOfDroppable = droppable.page.marginBox[droppable.axis.end];
  var existingSpace = endOfDroppable - endOfDraggables;

  return getResult(existingSpace);
});

var getWithGrowth = memoizeOne(function (area, growth) {
  return getArea(expandByPosition(area, growth));
});

var getClippedAreaWithPlaceholder = function getClippedAreaWithPlaceholder(_ref) {
  var draggable = _ref.draggable,
      draggables = _ref.draggables,
      droppable = _ref.droppable,
      previousDroppableOverId = _ref.previousDroppableOverId;

  var isHome = draggable.descriptor.droppableId === droppable.descriptor.id;
  var wasOver = Boolean(previousDroppableOverId && previousDroppableOverId === droppable.descriptor.id);
  var clipped = droppable.viewport.clipped;

  if (!clipped) {
    return clipped;
  }

  if (isHome || !wasOver) {
    return clipped;
  }

  var requiredGrowth = getRequiredGrowth(draggable, draggables, droppable);

  if (!requiredGrowth) {
    return clipped;
  }

  var subjectWithGrowth = getWithGrowth(clipped, requiredGrowth);
  var closestScrollable = droppable.viewport.closestScrollable;

  if (!closestScrollable) {
    return subjectWithGrowth;
  }

  if (!closestScrollable.shouldClipSubject) {
    return subjectWithGrowth;
  }

  return clip(closestScrollable.frame, subjectWithGrowth);
};

export default (function (_ref2) {
  var target = _ref2.target,
      draggable = _ref2.draggable,
      draggables = _ref2.draggables,
      droppables = _ref2.droppables,
      previousDroppableOverId = _ref2.previousDroppableOverId;

  var maybe = _Object$keys(droppables).map(function (id) {
    return droppables[id];
  }).filter(function (droppable) {
    return droppable.isEnabled;
  }).find(function (droppable) {
    var withPlaceholder = getClippedAreaWithPlaceholder({
      draggable: draggable, draggables: draggables, droppable: droppable, previousDroppableOverId: previousDroppableOverId
    });

    if (!withPlaceholder) {
      return false;
    }

    return isPositionInFrame(withPlaceholder)(target);
  });

  return maybe ? maybe.descriptor.id : null;
});