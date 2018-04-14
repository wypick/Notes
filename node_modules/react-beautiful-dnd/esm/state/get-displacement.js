
import getDisplacementMap from './get-displacement-map';
import { isPartiallyVisible } from './visibility/is-visible';


export default (function (_ref) {
  var draggable = _ref.draggable,
      destination = _ref.destination,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var id = draggable.descriptor.id;
  var map = getDisplacementMap(previousImpact.movement.displaced);

  var isVisible = isPartiallyVisible({
    target: draggable.page.marginBox,
    destination: destination,
    viewport: viewport
  });

  var shouldAnimate = function () {
    if (!isVisible) {
      return false;
    }

    var previous = map[id];

    if (!previous) {
      return true;
    }

    return previous.shouldAnimate;
  }();

  var displacement = {
    draggableId: id,
    isVisible: isVisible,
    shouldAnimate: shouldAnimate
  };

  return displacement;
});