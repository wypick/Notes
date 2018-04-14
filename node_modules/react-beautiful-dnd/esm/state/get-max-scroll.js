
import { subtract } from './position';

export default (function (_ref) {
  var scrollHeight = _ref.scrollHeight,
      scrollWidth = _ref.scrollWidth,
      height = _ref.height,
      width = _ref.width;

  var maxScroll = subtract({ x: scrollWidth, y: scrollHeight }, { x: width, y: height });

  var adjustedMaxScroll = {
    x: Math.max(0, maxScroll.x),
    y: Math.max(0, maxScroll.y)
  };

  return adjustedMaxScroll;
});