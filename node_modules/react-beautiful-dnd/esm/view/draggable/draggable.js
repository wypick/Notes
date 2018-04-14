import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _Draggable$contextTyp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import invariant from 'invariant';

import DraggableDimensionPublisher from '../draggable-dimension-publisher/';
import Moveable from '../moveable/';
import DragHandle from '../drag-handle';
import getViewport from '../window/get-viewport';

import getCenterPosition from '../get-center-position';
import Placeholder from '../placeholder';
import { droppableIdKey, styleContextKey } from '../context-keys';
import * as timings from '../../debug/timings';


export var zIndexOptions = {
  dragging: 5000,
  dropAnimating: 4500
};

var Draggable = function (_Component) {
  _inherits(Draggable, _Component);

  function Draggable(props, context) {
    _classCallCheck(this, Draggable);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.state = {
      ref: null
    };

    _this.onMoveEnd = function () {
      if (!_this.props.isDropAnimating) {
        return;
      }

      _this.props.dropAnimationFinished();
    };

    _this.onLift = function (options) {
      timings.start('LIFT');
      _this.throwIfCannotDrag();
      var client = options.client,
          autoScrollMode = options.autoScrollMode;
      var _this$props = _this.props,
          lift = _this$props.lift,
          draggableId = _this$props.draggableId;
      var ref = _this.state.ref;


      if (!ref) {
        throw new Error('cannot lift at this time');
      }

      var initial = {
        selection: client,
        center: getCenterPosition(ref)
      };

      lift(draggableId, initial, getViewport(), autoScrollMode);
    };

    _this.onMove = function (client) {
      _this.throwIfCannotDrag();

      var _this$props2 = _this.props,
          draggableId = _this$props2.draggableId,
          dimension = _this$props2.dimension,
          move = _this$props2.move;

      if (!dimension) {
        return;
      }

      move(draggableId, client, getViewport());
    };

    _this.onMoveForward = function () {
      _this.throwIfCannotDrag();
      _this.props.moveForward(_this.props.draggableId);
    };

    _this.onMoveBackward = function () {
      _this.throwIfCannotDrag();
      _this.props.moveBackward(_this.props.draggableId);
    };

    _this.onCrossAxisMoveForward = function () {
      _this.throwIfCannotDrag();
      _this.props.crossAxisMoveForward(_this.props.draggableId);
    };

    _this.onCrossAxisMoveBackward = function () {
      _this.throwIfCannotDrag();
      _this.props.crossAxisMoveBackward(_this.props.draggableId);
    };

    _this.onWindowScroll = function () {
      _this.throwIfCannotDrag();
      _this.props.moveByWindowScroll(_this.props.draggableId, getViewport());
    };

    _this.onDrop = function () {
      _this.throwIfCannotDrag();
      _this.props.drop();
    };

    _this.onCancel = function () {
      _this.props.cancel();
    };

    _this.setRef = function (ref) {
      if (ref === null) {
        return;
      }

      if (ref === _this.state.ref) {
        return;
      }

      _this.setState({
        ref: ref
      });
    };

    _this.getDraggableRef = function () {
      return _this.state.ref;
    };

    _this.getDraggingStyle = memoizeOne(function (dimension, isDropAnimating, movementStyle) {
      var _dimension$client$pad = dimension.client.paddingBox,
          width = _dimension$client$pad.width,
          height = _dimension$client$pad.height,
          top = _dimension$client$pad.top,
          left = _dimension$client$pad.left;

      var style = {
        position: 'fixed',
        boxSizing: 'border-box',
        zIndex: isDropAnimating ? zIndexOptions.dropAnimating : zIndexOptions.dragging,
        width: width,
        height: height,
        top: top,
        left: left,
        margin: 0,
        pointerEvents: 'none',
        transition: 'none',
        transform: movementStyle.transform ? '' + movementStyle.transform : null
      };
      return style;
    });
    _this.getNotDraggingStyle = memoizeOne(function (movementStyle, shouldAnimateDisplacement) {
      var style = {
        transform: movementStyle.transform,

        transition: shouldAnimateDisplacement ? null : 'none'
      };
      return style;
    });
    _this.getProvided = memoizeOne(function (isDragging, isDropAnimating, shouldAnimateDisplacement, dimension, dragHandleProps, movementStyle) {
      var useDraggingStyle = isDragging || isDropAnimating;

      var draggableStyle = function () {
        if (!useDraggingStyle) {
          return _this.getNotDraggingStyle(movementStyle, shouldAnimateDisplacement);
        }

        invariant(dimension, 'draggable dimension required for dragging');

        return _this.getDraggingStyle(dimension, isDropAnimating, movementStyle);
      }();

      var provided = {
        innerRef: _this.setRef,
        draggableProps: {
          'data-react-beautiful-dnd-draggable': _this.styleContext,
          style: draggableStyle
        },
        dragHandleProps: dragHandleProps,
        placeholder: useDraggingStyle ? _this.getPlaceholder() : null
      };
      return provided;
    });
    _this.getSnapshot = memoizeOne(function (isDragging, isDropAnimating, draggingOver) {
      return {
        isDragging: isDragging || isDropAnimating,
        draggingOver: draggingOver
      };
    });
    _this.getSpeed = memoizeOne(function (isDragging, shouldAnimateDragMovement, isDropAnimating) {
      if (isDropAnimating) {
        return 'STANDARD';
      }

      if (isDragging && shouldAnimateDragMovement) {
        return 'FAST';
      }

      return 'INSTANT';
    });


    var callbacks = {
      onLift: _this.onLift,
      onMove: _this.onMove,
      onDrop: _this.onDrop,
      onCancel: _this.onCancel,
      onMoveBackward: _this.onMoveBackward,
      onMoveForward: _this.onMoveForward,
      onCrossAxisMoveForward: _this.onCrossAxisMoveForward,
      onCrossAxisMoveBackward: _this.onCrossAxisMoveBackward,
      onWindowScroll: _this.onWindowScroll
    };

    _this.callbacks = callbacks;
    _this.styleContext = context[styleContextKey];
    return _this;
  }

  Draggable.prototype.throwIfCannotDrag = function throwIfCannotDrag() {
    invariant(this.state.ref, 'Draggable: cannot drag as no DOM node has been provided');
    invariant(!this.props.isDragDisabled, 'Draggable: cannot drag as dragging is not enabled');
  };

  Draggable.prototype.getPlaceholder = function getPlaceholder() {
    var dimension = this.props.dimension;
    invariant(dimension, 'cannot get a drag placeholder when not dragging');

    return React.createElement(Placeholder, { placeholder: dimension.placeholder });
  };

  Draggable.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        draggableId = _props.draggableId,
        index = _props.index,
        offset = _props.offset,
        isDragging = _props.isDragging,
        isDropAnimating = _props.isDropAnimating,
        isDragDisabled = _props.isDragDisabled,
        dimension = _props.dimension,
        draggingOver = _props.draggingOver,
        direction = _props.direction,
        shouldAnimateDragMovement = _props.shouldAnimateDragMovement,
        shouldAnimateDisplacement = _props.shouldAnimateDisplacement,
        disableInteractiveElementBlocking = _props.disableInteractiveElementBlocking,
        children = _props.children;

    var droppableId = this.context[droppableIdKey];

    var speed = this.getSpeed(isDragging, shouldAnimateDragMovement, isDropAnimating);

    return React.createElement(
      DraggableDimensionPublisher,
      {
        draggableId: draggableId,
        droppableId: droppableId,
        index: index,
        targetRef: this.state.ref
      },
      React.createElement(
        Moveable,
        {
          speed: speed,
          destination: offset,
          onMoveEnd: this.onMoveEnd
        },
        function (movementStyle) {
          return React.createElement(
            DragHandle,
            {
              draggableId: draggableId,
              isDragging: isDragging,
              direction: direction,
              isEnabled: !isDragDisabled,
              callbacks: _this2.callbacks,
              getDraggableRef: _this2.getDraggableRef,

              canDragInteractiveElements: disableInteractiveElementBlocking
            },
            function (dragHandleProps) {
              return children(_this2.getProvided(isDragging, isDropAnimating, shouldAnimateDisplacement, dimension, dragHandleProps, movementStyle), _this2.getSnapshot(isDragging, isDropAnimating, draggingOver));
            }
          );
        }
      )
    );
  };

  return Draggable;
}(Component);

Draggable.contextTypes = (_Draggable$contextTyp = {}, _Draggable$contextTyp[droppableIdKey] = PropTypes.string.isRequired, _Draggable$contextTyp[styleContextKey] = PropTypes.string.isRequired, _Draggable$contextTyp);
export default Draggable;