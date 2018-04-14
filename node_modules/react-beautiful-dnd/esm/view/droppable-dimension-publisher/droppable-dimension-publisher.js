import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _DroppableDimensionPu;

import { Component } from 'react';

import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import rafSchedule from 'raf-schd';
import getWindowScroll from '../window/get-window-scroll';
import getArea from '../../state/get-area';
import { getDroppableDimension } from '../../state/dimension';
import getClosestScrollable from '../get-closest-scrollable';
import { dimensionMarshalKey } from '../context-keys';


var origin = { x: 0, y: 0 };

var DroppableDimensionPublisher = function (_Component) {
  _inherits(DroppableDimensionPublisher, _Component);

  function DroppableDimensionPublisher(props, context) {
    _classCallCheck(this, DroppableDimensionPublisher);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.closestScrollable = null;
    _this.isWatchingScroll = false;
    _this.scrollOptions = null;
    _this.publishedDescriptor = null;

    _this.getClosestScroll = function () {
      if (!_this.closestScrollable) {
        return origin;
      }

      var offset = {
        x: _this.closestScrollable.scrollLeft,
        y: _this.closestScrollable.scrollTop
      };

      return offset;
    };

    _this.memoizedUpdateScroll = memoizeOne(function (x, y) {
      if (!_this.publishedDescriptor) {
        console.error('Cannot update scroll on unpublished droppable');
        return;
      }

      var newScroll = { x: x, y: y };
      var marshal = _this.context[dimensionMarshalKey];
      marshal.updateDroppableScroll(_this.publishedDescriptor.id, newScroll);
    });

    _this.updateScroll = function () {
      var offset = _this.getClosestScroll();
      _this.memoizedUpdateScroll(offset.x, offset.y);
    };

    _this.scheduleScrollUpdate = rafSchedule(_this.updateScroll);

    _this.onClosestScroll = function () {
      if (!_this.scrollOptions) {
        console.error('Cannot find scroll options while scrolling');
        return;
      }
      if (_this.scrollOptions.shouldPublishImmediately) {
        _this.updateScroll();
        return;
      }
      _this.scheduleScrollUpdate();
    };

    _this.scroll = function (change) {
      if (_this.closestScrollable == null) {
        console.error('Cannot scroll a droppable with no closest scrollable');
        return;
      }

      if (!_this.isWatchingScroll) {
        console.error('Updating Droppable scroll while not watching for updates');
        return;
      }

      _this.closestScrollable.scrollTop += change.y;
      _this.closestScrollable.scrollLeft += change.x;
    };

    _this.watchScroll = function (options) {
      if (!_this.props.targetRef) {
        console.error('cannot watch droppable scroll if not in the dom');
        return;
      }

      if (_this.closestScrollable == null) {
        return;
      }

      if (_this.isWatchingScroll) {
        return;
      }

      _this.isWatchingScroll = true;
      _this.scrollOptions = options;
      _this.closestScrollable.addEventListener('scroll', _this.onClosestScroll, { passive: true });
    };

    _this.unwatchScroll = function () {
      if (!_this.isWatchingScroll) {
        return;
      }

      _this.isWatchingScroll = false;
      _this.scrollOptions = null;
      _this.scheduleScrollUpdate.cancel();

      if (!_this.closestScrollable) {
        console.error('cannot unbind event listener if element is null');
        return;
      }

      _this.closestScrollable.removeEventListener('scroll', _this.onClosestScroll);
    };

    _this.getMemoizedDescriptor = memoizeOne(function (id, type) {
      return {
        id: id,
        type: type
      };
    });

    _this.unpublish = function () {
      if (!_this.publishedDescriptor) {
        console.error('cannot unpublish descriptor when none is published');
        return;
      }

      var marshal = _this.context[dimensionMarshalKey];
      marshal.unregisterDroppable(_this.publishedDescriptor);
      _this.publishedDescriptor = null;
    };

    _this.publish = function (descriptor) {
      if (descriptor === _this.publishedDescriptor) {
        return;
      }

      if (_this.publishedDescriptor) {
        _this.unpublish();
      }

      var marshal = _this.context[dimensionMarshalKey];
      marshal.registerDroppable(descriptor, _this.callbacks);
      _this.publishedDescriptor = descriptor;
    };

    _this.getDimension = function () {
      var _this$props = _this.props,
          direction = _this$props.direction,
          ignoreContainerClipping = _this$props.ignoreContainerClipping,
          isDropDisabled = _this$props.isDropDisabled,
          targetRef = _this$props.targetRef;


      if (!targetRef) {
        throw new Error('DimensionPublisher cannot calculate a dimension when not attached to the DOM');
      }

      if (_this.isWatchingScroll) {
        throw new Error('Attempting to recapture Droppable dimension while already watching scroll on previous capture');
      }

      var descriptor = _this.publishedDescriptor;

      if (!descriptor) {
        throw new Error('Cannot get dimension for unpublished droppable');
      }

      _this.closestScrollable = getClosestScrollable(targetRef);
      var style = window.getComputedStyle(targetRef);

      var margin = {
        top: parseInt(style.marginTop, 10),
        right: parseInt(style.marginRight, 10),
        bottom: parseInt(style.marginBottom, 10),
        left: parseInt(style.marginLeft, 10)
      };
      var padding = {
        top: parseInt(style.paddingTop, 10),
        right: parseInt(style.paddingRight, 10),
        bottom: parseInt(style.paddingBottom, 10),
        left: parseInt(style.paddingLeft, 10)
      };

      var paddingBox = getArea(targetRef.getBoundingClientRect());

      var closest = function () {
        var closestScrollable = _this.closestScrollable;

        if (!closestScrollable) {
          return null;
        }

        var framePaddingBox = getArea(closestScrollable.getBoundingClientRect());
        var scroll = _this.getClosestScroll();
        var scrollWidth = closestScrollable.scrollWidth;
        var scrollHeight = closestScrollable.scrollHeight;

        return {
          framePaddingBox: framePaddingBox,
          scrollWidth: scrollWidth,
          scrollHeight: scrollHeight,
          scroll: scroll,
          shouldClipSubject: !ignoreContainerClipping
        };
      }();

      var dimension = getDroppableDimension({
        descriptor: descriptor,
        direction: direction,
        paddingBox: paddingBox,
        closest: closest,
        margin: margin,
        padding: padding,
        windowScroll: getWindowScroll(),
        isEnabled: !isDropDisabled
      });

      return dimension;
    };

    var callbacks = {
      getDimension: _this.getDimension,
      watchScroll: _this.watchScroll,
      unwatchScroll: _this.unwatchScroll,
      scroll: _this.scroll
    };
    _this.callbacks = callbacks;
    return _this;
  }

  DroppableDimensionPublisher.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (!nextProps.targetRef) {
      console.error('Cannot update droppable dimension publisher without a target ref');
      return;
    }

    var droppableId = nextProps.droppableId,
        type = nextProps.type;

    var descriptor = this.getMemoizedDescriptor(droppableId, type);

    this.publish(descriptor);

    if (this.props.isDropDisabled === nextProps.isDropDisabled) {
      return;
    }

    var marshal = this.context[dimensionMarshalKey];
    marshal.updateDroppableIsEnabled(nextProps.droppableId, !nextProps.isDropDisabled);
  };

  DroppableDimensionPublisher.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.isWatchingScroll) {
      console.warn('unmounting droppable while it was watching scroll');
      this.unwatchScroll();
    }

    this.unpublish();
  };

  DroppableDimensionPublisher.prototype.render = function render() {
    return this.props.children;
  };

  return DroppableDimensionPublisher;
}(Component);

DroppableDimensionPublisher.contextTypes = (_DroppableDimensionPu = {}, _DroppableDimensionPu[dimensionMarshalKey] = PropTypes.object.isRequired, _DroppableDimensionPu);
export default DroppableDimensionPublisher;