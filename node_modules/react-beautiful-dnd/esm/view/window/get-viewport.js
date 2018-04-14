
import getArea from '../../state/get-area';
import getWindowScroll from './get-window-scroll';
import getMaxScroll from '../../state/get-max-scroll';

export default (function () {
  var scroll = getWindowScroll();

  var top = scroll.y;
  var left = scroll.x;

  var doc = document.documentElement;

  var width = doc.clientWidth;
  var height = doc.clientHeight;

  var right = left + width;
  var bottom = top + height;

  var subject = getArea({
    top: top, left: left, right: right, bottom: bottom
  });

  var maxScroll = getMaxScroll({
    scrollHeight: doc.scrollHeight,
    scrollWidth: doc.scrollWidth,
    width: subject.width,
    height: subject.height
  });

  var viewport = {
    subject: subject,
    maxScroll: maxScroll,
    scroll: scroll
  };

  return viewport;
});