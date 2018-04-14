
import { add } from './position';


export default (function (droppable, point) {
  var closestScrollable = droppable.viewport.closestScrollable;
  if (!closestScrollable) {
    return point;
  }

  return add(point, closestScrollable.scroll.diff.displacement);
});