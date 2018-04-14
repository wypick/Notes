import _extends from 'babel-runtime/helpers/extends';

import { vertical, horizontal } from './axis';
import getArea from './get-area';
import { offsetByPosition, expandBySpacing, shrinkBySpacing } from './spacing';
import { subtract, negate } from './position';
import getMaxScroll from './get-max-scroll';


var origin = { x: 0, y: 0 };

export var noSpacing = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

export var getDraggableDimension = function getDraggableDimension(_ref) {
  var descriptor = _ref.descriptor,
      paddingBox = _ref.paddingBox,
      _ref$margin = _ref.margin,
      margin = _ref$margin === undefined ? noSpacing : _ref$margin,
      _ref$windowScroll = _ref.windowScroll,
      windowScroll = _ref$windowScroll === undefined ? origin : _ref$windowScroll;

  var pagePaddingBox = offsetByPosition(paddingBox, windowScroll);

  var dimension = {
    descriptor: descriptor,
    placeholder: {
      margin: margin,
      paddingBox: paddingBox
    },

    client: {
      paddingBox: paddingBox,
      marginBox: getArea(expandBySpacing(paddingBox, margin))
    },

    page: {
      paddingBox: getArea(pagePaddingBox),
      marginBox: getArea(expandBySpacing(pagePaddingBox, margin))
    }
  };

  return dimension;
};

export var clip = function clip(frame, subject) {
  var result = getArea({
    top: Math.max(subject.top, frame.top),
    right: Math.min(subject.right, frame.right),
    bottom: Math.min(subject.bottom, frame.bottom),
    left: Math.max(subject.left, frame.left)
  });

  if (result.width <= 0 || result.height <= 0) {
    return null;
  }

  return result;
};

export var scrollDroppable = function scrollDroppable(droppable, newScroll) {
  if (!droppable.viewport.closestScrollable) {
    console.error('Cannot scroll droppble that does not have a closest scrollable');
    return droppable;
  }

  var existingScrollable = droppable.viewport.closestScrollable;

  var frame = existingScrollable.frame;

  var scrollDiff = subtract(newScroll, existingScrollable.scroll.initial);

  var scrollDisplacement = negate(scrollDiff);

  var closestScrollable = {
    frame: existingScrollable.frame,
    shouldClipSubject: existingScrollable.shouldClipSubject,
    scroll: {
      initial: existingScrollable.scroll.initial,
      current: newScroll,
      diff: {
        value: scrollDiff,
        displacement: scrollDisplacement
      },

      max: existingScrollable.scroll.max
    }
  };

  var displacedSubject = offsetByPosition(droppable.viewport.subject, scrollDisplacement);

  var clipped = closestScrollable.shouldClipSubject ? clip(frame, displacedSubject) : getArea(displacedSubject);

  var viewport = {
    closestScrollable: closestScrollable,
    subject: droppable.viewport.subject,
    clipped: clipped
  };

  return _extends({}, droppable, {
    viewport: viewport
  });
};

export var getDroppableDimension = function getDroppableDimension(_ref2) {
  var descriptor = _ref2.descriptor,
      paddingBox = _ref2.paddingBox,
      closest = _ref2.closest,
      _ref2$direction = _ref2.direction,
      direction = _ref2$direction === undefined ? 'vertical' : _ref2$direction,
      _ref2$margin = _ref2.margin,
      margin = _ref2$margin === undefined ? noSpacing : _ref2$margin,
      _ref2$padding = _ref2.padding,
      padding = _ref2$padding === undefined ? noSpacing : _ref2$padding,
      _ref2$windowScroll = _ref2.windowScroll,
      windowScroll = _ref2$windowScroll === undefined ? origin : _ref2$windowScroll,
      _ref2$isEnabled = _ref2.isEnabled,
      isEnabled = _ref2$isEnabled === undefined ? true : _ref2$isEnabled;

  var client = {
    paddingBox: paddingBox,
    marginBox: getArea(expandBySpacing(paddingBox, margin)),
    contentBox: getArea(shrinkBySpacing(paddingBox, padding))
  };
  var page = {
    marginBox: getArea(offsetByPosition(client.marginBox, windowScroll)),
    paddingBox: getArea(offsetByPosition(client.paddingBox, windowScroll)),
    contentBox: getArea(offsetByPosition(client.contentBox, windowScroll))
  };
  var subject = page.marginBox;

  var closestScrollable = function () {
    if (!closest) {
      return null;
    }

    var frame = getArea(offsetByPosition(closest.framePaddingBox, windowScroll));

    var maxScroll = getMaxScroll({
      scrollHeight: closest.scrollHeight,
      scrollWidth: closest.scrollWidth,
      height: frame.height,
      width: frame.width
    });

    var result = {
      frame: frame,
      shouldClipSubject: closest.shouldClipSubject,
      scroll: {
        initial: closest.scroll,

        current: closest.scroll,
        max: maxScroll,
        diff: {
          value: origin,
          displacement: origin
        }
      }
    };

    return result;
  }();

  var clipped = closestScrollable && closestScrollable.shouldClipSubject ? clip(closestScrollable.frame, subject) : subject;

  var viewport = {
    closestScrollable: closestScrollable,
    subject: subject,
    clipped: clipped
  };

  var dimension = {
    descriptor: descriptor,
    isEnabled: isEnabled,
    axis: direction === 'vertical' ? vertical : horizontal,
    client: client,
    page: page,
    viewport: viewport
  };

  return dimension;
};