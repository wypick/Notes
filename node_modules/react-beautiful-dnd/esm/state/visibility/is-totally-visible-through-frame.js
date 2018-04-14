
import isWithin from '../is-within';


export default (function (frame) {
  var isWithinVertical = isWithin(frame.top, frame.bottom);
  var isWithinHorizontal = isWithin(frame.left, frame.right);

  return function (subject) {
    var isContained = isWithinVertical(subject.top) && isWithinVertical(subject.bottom) && isWithinHorizontal(subject.left) && isWithinHorizontal(subject.right);

    return isContained;
  };
});