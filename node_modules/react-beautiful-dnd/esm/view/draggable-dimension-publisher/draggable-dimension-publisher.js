import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _DraggableDimensionPu;

import { Component } from 'react';

import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import getWindowScroll from '../window/get-window-scroll';
import { getDraggableDimension } from '../../state/dimension';
import { dimensionMarshalKey } from '../context-keys';
import getArea from '../../state/get-area';

var DraggableDimensionPublisher = function (_Component) {
  _inherits(DraggableDimensionPublisher, _Component);

  function DraggableDimensionPublisher() {
    var _temp, _this, _ret;

    _classCallCheck(this, DraggableDimensionPublisher);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.publishedDescriptor = null, _this.getMemoizedDescriptor = memoizeOne(function (id, droppableId, index) {
      return {
        id: id,
        droppableId: droppableId,
        index: index
      };
    }), _this.unpublish = function () {
      if (!_this.publishedDescriptor) {
        console.error('cannot unpublish descriptor when none is published');
        return;
      }

      var marshal = _this.context[dimensionMarshalKey];
      marshal.unregisterDraggable(_this.publishedDescriptor);
      _this.publishedDescriptor = null;
    }, _this.publish = function (descriptor) {
      if (descriptor === _this.publishedDescriptor) {
        return;
      }

      if (_this.publishedDescriptor) {
        _this.unpublish();
      }

      var marshal = _this.context[dimensionMarshalKey];
      marshal.registerDraggable(descriptor, _this.getDimension);
      _this.publishedDescriptor = descriptor;
    }, _this.getDimension = function () {
      var targetRef = _this.props.targetRef;

      if (!targetRef) {
        throw new Error('DraggableDimensionPublisher cannot calculate a dimension when not attached to the DOM');
      }

      var descriptor = _this.publishedDescriptor;

      if (!descriptor) {
        throw new Error('Cannot get dimension for unpublished draggable');
      }

      var style = window.getComputedStyle(targetRef);

      var margin = {
        top: parseInt(style.marginTop, 10),
        right: parseInt(style.marginRight, 10),
        bottom: parseInt(style.marginBottom, 10),
        left: parseInt(style.marginLeft, 10)
      };

      var paddingBox = getArea(targetRef.getBoundingClientRect());

      var dimension = getDraggableDimension({
        descriptor: descriptor,
        paddingBox: paddingBox,
        margin: margin,
        windowScroll: getWindowScroll()
      });

      return dimension;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  DraggableDimensionPublisher.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var draggableId = nextProps.draggableId,
        droppableId = nextProps.droppableId,
        index = nextProps.index,
        targetRef = nextProps.targetRef;


    if (!targetRef) {
      console.error('Updating draggable dimension handler without a targetRef');
      return;
    }

    var descriptor = this.getMemoizedDescriptor(draggableId, droppableId, index);

    this.publish(descriptor);
  };

  DraggableDimensionPublisher.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unpublish();
  };

  DraggableDimensionPublisher.prototype.render = function render() {
    return this.props.children;
  };

  return DraggableDimensionPublisher;
}(Component);

DraggableDimensionPublisher.contextTypes = (_DraggableDimensionPu = {}, _DraggableDimensionPu[dimensionMarshalKey] = PropTypes.object.isRequired, _DraggableDimensionPu);
export default DraggableDimensionPublisher;