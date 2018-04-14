
import { distance } from '../position';
import { isTotallyVisible } from '../visibility/is-visible';
import withDroppableDisplacement from '../with-droppable-displacement';


export default (function (_ref) {
  var axis = _ref.axis,
      viewport = _ref.viewport,
      pageCenter = _ref.pageCenter,
      destination = _ref.destination,
      insideDestination = _ref.insideDestination;

  if (!insideDestination.length) {
    return null;
  }

  var result = insideDestination.filter(function (draggable) {
    return isTotallyVisible({
      target: draggable.page.marginBox,
      destination: destination,
      viewport: viewport.subject
    });
  }).sort(function (a, b) {
    var distanceToA = distance(pageCenter, withDroppableDisplacement(destination, a.page.marginBox.center));
    var distanceToB = distance(pageCenter, withDroppableDisplacement(destination, b.page.marginBox.center));

    if (distanceToA < distanceToB) {
      return -1;
    }

    if (distanceToB < distanceToA) {
      return 1;
    }

    return a.page.marginBox[axis.start] - b.page.marginBox[axis.start];
  });

  return result.length ? result[0] : null;
});