'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _scrollJumpKeys;

var _createScheduler = require('../util/create-scheduler');

var _createScheduler2 = _interopRequireDefault(_createScheduler);

var _preventStandardKeyEvents = require('../util/prevent-standard-key-events');

var _preventStandardKeyEvents2 = _interopRequireDefault(_preventStandardKeyEvents);

var _keyCodes = require('../../key-codes');

var keyCodes = _interopRequireWildcard(_keyCodes);

var _getWindowFromRef = require('../../get-window-from-ref');

var _getWindowFromRef2 = _interopRequireDefault(_getWindowFromRef);

var _getCenterPosition = require('../../get-center-position');

var _getCenterPosition2 = _interopRequireDefault(_getCenterPosition);

var _bindEvents = require('../util/bind-events');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scrollJumpKeys = (_scrollJumpKeys = {}, _scrollJumpKeys[keyCodes.pageDown] = true, _scrollJumpKeys[keyCodes.pageUp] = true, _scrollJumpKeys[keyCodes.home] = true, _scrollJumpKeys[keyCodes.end] = true, _scrollJumpKeys);

var noop = function noop() {};

exports.default = function (_ref) {
  var callbacks = _ref.callbacks,
      getDraggableRef = _ref.getDraggableRef,
      canStartCapturing = _ref.canStartCapturing;

  var state = {
    isDragging: false
  };
  var setState = function setState(newState) {
    state = newState;
  };
  var getWindow = function getWindow() {
    return (0, _getWindowFromRef2.default)(getDraggableRef());
  };

  var startDragging = function startDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    setState({
      isDragging: true
    });
    bindWindowEvents();
    fn();
  };
  var stopDragging = function stopDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    schedule.cancel();
    unbindWindowEvents();
    setState({ isDragging: false });
    fn();
  };
  var kill = function kill() {
    return stopDragging();
  };
  var cancel = function cancel() {
    stopDragging(callbacks.onCancel);
  };
  var isDragging = function isDragging() {
    return state.isDragging;
  };
  var schedule = (0, _createScheduler2.default)(callbacks);

  var onKeyDown = function onKeyDown(event, props) {
    var direction = props.direction;

    if (!isDragging()) {
      if (event.defaultPrevented) {
        return;
      }

      if (!canStartCapturing(event)) {
        return;
      }

      if (event.keyCode !== keyCodes.space) {
        return;
      }

      var ref = getDraggableRef();

      if (!ref) {
        console.error('cannot start a keyboard drag without a draggable ref');
        return;
      }

      var center = (0, _getCenterPosition2.default)(ref);

      event.preventDefault();
      startDragging(function () {
        return callbacks.onLift({
          client: center,
          autoScrollMode: 'JUMP'
        });
      });
      return;
    }

    if (event.keyCode === keyCodes.escape) {
      event.preventDefault();
      cancel();
      return;
    }

    if (event.keyCode === keyCodes.space) {
      event.preventDefault();
      stopDragging(callbacks.onDrop);
      return;
    }

    if (!direction) {
      console.error('Cannot handle keyboard movement event if direction is not provided');

      event.preventDefault();
      cancel();
      return;
    }

    var executeBasedOnDirection = function executeBasedOnDirection(fns) {
      if (direction === 'vertical') {
        fns.vertical();
        return;
      }
      fns.horizontal();
    };

    if (event.keyCode === keyCodes.arrowDown) {
      event.preventDefault();
      executeBasedOnDirection({
        vertical: schedule.moveForward,
        horizontal: schedule.crossAxisMoveForward
      });
      return;
    }

    if (event.keyCode === keyCodes.arrowUp) {
      event.preventDefault();
      executeBasedOnDirection({
        vertical: schedule.moveBackward,
        horizontal: schedule.crossAxisMoveBackward
      });
      return;
    }

    if (event.keyCode === keyCodes.arrowRight) {
      event.preventDefault();
      executeBasedOnDirection({
        vertical: schedule.crossAxisMoveForward,
        horizontal: schedule.moveForward
      });
      return;
    }

    if (event.keyCode === keyCodes.arrowLeft) {
      event.preventDefault();
      executeBasedOnDirection({
        vertical: schedule.crossAxisMoveBackward,
        horizontal: schedule.moveBackward
      });
    }

    if (scrollJumpKeys[event.keyCode]) {
      event.preventDefault();
      return;
    }

    (0, _preventStandardKeyEvents2.default)(event);
  };

  var windowBindings = [{
    eventName: 'mousedown',
    fn: cancel
  }, {
    eventName: 'mouseup',
    fn: cancel
  }, {
    eventName: 'click',
    fn: cancel
  }, {
    eventName: 'touchstart',
    fn: cancel
  }, {
    eventName: 'resize',
    fn: cancel
  }, {
    eventName: 'wheel',
    fn: cancel
  }, {
    eventName: 'scroll',
    fn: callbacks.onWindowScroll
  }];

  var bindWindowEvents = function bindWindowEvents() {
    (0, _bindEvents.bindEvents)(getWindow(), windowBindings, { capture: true });
  };

  var unbindWindowEvents = function unbindWindowEvents() {
    (0, _bindEvents.unbindEvents)(getWindow(), windowBindings, { capture: true });
  };

  var sensor = {
    onKeyDown: onKeyDown,
    kill: kill,
    isDragging: isDragging,

    isCapturing: isDragging,

    unmount: kill
  };

  return sensor;
};