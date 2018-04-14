
import { patch } from '../position';
import getDisplacement from '../get-displacement';
import withDroppableScroll from '../with-droppable-scroll';

export default (function (_ref) {
  var pageCenter = _ref.pageCenter,
      draggable = _ref.draggable,
      destination = _ref.destination,
      insideDestination = _ref.insideDestination,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var axis = destination.axis;

  var currentCenter = withDroppableScroll(destination, pageCenter);

  var displaced = insideDestination.filter(function (child) {
    var threshold = child.page.paddingBox[axis.end];
    return threshold > currentCenter[axis.line];
  }).map(function (dimension) {
    return getDisplacement({
      draggable: dimension,
      destination: destination,
      previousImpact: previousImpact,
      viewport: viewport.subject
    });
  });

  var newIndex = insideDestination.length - displaced.length;

  var movement = {
    amount: patch(axis.line, draggable.page.marginBox[axis.size]),
    displaced: displaced,
    isBeyondStartPosition: false
  };

  var impact = {
    movement: movement,
    direction: axis.direction,
    destination: {
      droppableId: destination.descriptor.id,
      index: newIndex
    }
  };

  return impact;
});