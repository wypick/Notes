
import { subtract } from '../position';
import { offsetByPosition } from '../spacing';
import { isTotallyVisible } from '../visibility/is-visible';


export default (function (_ref) {
  var draggable = _ref.draggable,
      destination = _ref.destination,
      newPageCenter = _ref.newPageCenter,
      viewport = _ref.viewport;

  var diff = subtract(newPageCenter, draggable.page.paddingBox.center);
  var shifted = offsetByPosition(draggable.page.paddingBox, diff);

  return isTotallyVisible({
    target: shifted,
    destination: destination,
    viewport: viewport
  });
});