
import isWithin from '../is-within';


export default (function (frame) {
  var isWithinVertical = isWithin(frame.top, frame.bottom);
  var isWithinHorizontal = isWithin(frame.left, frame.right);

  return function (point) {
    return isWithinVertical(point.y) && isWithinVertical(point.y) && isWithinHorizontal(point.x) && isWithinHorizontal(point.x);
  };
});