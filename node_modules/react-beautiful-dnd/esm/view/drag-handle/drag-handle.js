import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _DragHandle$contextTy;

import { Component } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';

import { styleContextKey, canLiftContextKey } from '../context-keys';
import shouldAllowDraggingFromTarget from './util/should-allow-dragging-from-target';
import createMouseSensor from './sensor/create-mouse-sensor';
import createKeyboardSensor from './sensor/create-keyboard-sensor';
import createTouchSensor from './sensor/create-touch-sensor';

var preventHtml5Dnd = function preventHtml5Dnd(event) {
  event.preventDefault();
};

var DragHandle = function (_Component) {
  _inherits(DragHandle, _Component);

  function DragHandle(props, context) {
    _classCallCheck(this, DragHandle);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.onKeyDown = function (event) {
      if (_this.mouseSensor.isCapturing()) {
        return;
      }

      _this.keyboardSensor.onKeyDown(event, _this.props);
    };

    _this.onMouseDown = function (event) {
      if (_this.keyboardSensor.isCapturing() || _this.mouseSensor.isCapturing()) {
        return;
      }

      _this.mouseSensor.onMouseDown(event);
    };

    _this.onTouchStart = function (event) {
      if (_this.mouseSensor.isCapturing() || _this.keyboardSensor.isCapturing()) {
        console.error('mouse or keyboard already listening when attempting to touch drag');
        return;
      }

      _this.touchSensor.onTouchStart(event);
    };

    _this.onTouchMove = function (event) {
      _this.touchSensor.onTouchMove(event);
    };

    _this.canStartCapturing = function (event) {
      if (_this.isAnySensorCapturing()) {
        return false;
      }

      if (!_this.canLift(_this.props.draggableId)) {
        return false;
      }

      return shouldAllowDraggingFromTarget(event, _this.props);
    };

    _this.isAnySensorCapturing = function () {
      return _this.sensors.some(function (sensor) {
        return sensor.isCapturing();
      });
    };

    _this.getProvided = memoizeOne(function (isEnabled) {
      if (!isEnabled) {
        return null;
      }

      var provided = {
        onMouseDown: _this.onMouseDown,
        onKeyDown: _this.onKeyDown,
        onTouchStart: _this.onTouchStart,
        onTouchMove: _this.onTouchMove,
        tabIndex: 0,
        'data-react-beautiful-dnd-drag-handle': _this.styleContext,

        'aria-roledescription': 'Draggable item. Press space bar to lift',
        draggable: false,
        onDragStart: preventHtml5Dnd
      };

      return provided;
    });


    var args = {
      callbacks: _this.props.callbacks,
      getDraggableRef: _this.props.getDraggableRef,
      canStartCapturing: _this.canStartCapturing
    };

    _this.mouseSensor = createMouseSensor(args);
    _this.keyboardSensor = createKeyboardSensor(args);
    _this.touchSensor = createTouchSensor(args);
    _this.sensors = [_this.mouseSensor, _this.keyboardSensor, _this.touchSensor];
    _this.styleContext = context[styleContextKey];

    _this.canLift = context[canLiftContextKey];
    return _this;
  }

  DragHandle.prototype.componentWillUnmount = function componentWillUnmount() {
    var _this2 = this;

    this.sensors.forEach(function (sensor) {
      var wasDragging = sensor.isDragging();

      sensor.unmount();

      if (wasDragging) {
        _this2.props.callbacks.onCancel();
      }
    });
  };

  DragHandle.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var _this3 = this;

    var isCapturing = this.isAnySensorCapturing();

    if (!isCapturing) {
      return;
    }

    var isDragStopping = this.props.isDragging && !nextProps.isDragging;

    if (isDragStopping) {
      this.sensors.forEach(function (sensor) {
        if (sensor.isCapturing()) {
          sensor.kill();
        }
      });
      return;
    }

    if (!nextProps.isEnabled) {
      this.sensors.forEach(function (sensor) {
        if (sensor.isCapturing()) {
          var wasDragging = sensor.isDragging();

          sensor.kill();

          if (wasDragging) {
            _this3.props.callbacks.onCancel();
          }
        }
      });
    }
  };

  DragHandle.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        isEnabled = _props.isEnabled;


    return children(this.getProvided(isEnabled));
  };

  return DragHandle;
}(Component);

DragHandle.contextTypes = (_DragHandle$contextTy = {}, _DragHandle$contextTy[styleContextKey] = PropTypes.string.isRequired, _DragHandle$contextTy[canLiftContextKey] = PropTypes.func.isRequired, _DragHandle$contextTy);
export default DragHandle;