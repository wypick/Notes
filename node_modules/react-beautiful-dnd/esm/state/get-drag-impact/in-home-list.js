
import { patch } from '../position';
import getDisplacement from '../get-displacement';
import withDroppableScroll from '../with-droppable-scroll';

export default (function (_ref) {
  var pageCenter = _ref.pageCenter,
      draggable = _ref.draggable,
      home = _ref.home,
      insideHome = _ref.insideHome,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var axis = home.axis;

  var originalCenter = draggable.page.paddingBox.center;

  var currentCenter = withDroppableScroll(home, pageCenter);

  var isBeyondStartPosition = currentCenter[axis.line] - originalCenter[axis.line] > 0;

  var amount = patch(axis.line, draggable.client.marginBox[axis.size]);

  var displaced = insideHome.filter(function (child) {
    if (child === draggable) {
      return false;
    }

    var area = child.page.paddingBox;

    if (isBeyondStartPosition) {
      if (area.center[axis.line] < originalCenter[axis.line]) {
        return false;
      }

      return currentCenter[axis.line] > area[axis.start];
    }

    if (originalCenter[axis.line] < area.center[axis.line]) {
      return false;
    }

    return currentCenter[axis.line] < area[axis.end];
  }).map(function (dimension) {
    return getDisplacement({
      draggable: dimension,
      destination: home,
      previousImpact: previousImpact,
      viewport: viewport.subject
    });
  });

  var ordered = isBeyondStartPosition ? displaced.reverse() : displaced;
  var index = function () {
    var startIndex = insideHome.indexOf(draggable);
    var length = ordered.length;
    if (!length) {
      return startIndex;
    }

    if (isBeyondStartPosition) {
      return startIndex + length;
    }

    return startIndex - length;
  }();

  var movement = {
    amount: amount,
    displaced: ordered,
    isBeyondStartPosition: isBeyondStartPosition
  };

  var impact = {
    movement: movement,
    direction: axis.direction,
    destination: {
      droppableId: home.descriptor.id,
      index: index
    }
  };

  return impact;
});