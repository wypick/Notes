'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createScheduler = require('../util/create-scheduler');

var _createScheduler2 = _interopRequireDefault(_createScheduler);

var _isSloppyClickThresholdExceeded = require('../util/is-sloppy-click-threshold-exceeded');

var _isSloppyClickThresholdExceeded2 = _interopRequireDefault(_isSloppyClickThresholdExceeded);

var _getWindowFromRef = require('../../get-window-from-ref');

var _getWindowFromRef2 = _interopRequireDefault(_getWindowFromRef);

var _keyCodes = require('../../key-codes');

var keyCodes = _interopRequireWildcard(_keyCodes);

var _preventStandardKeyEvents = require('../util/prevent-standard-key-events');

var _preventStandardKeyEvents2 = _interopRequireDefault(_preventStandardKeyEvents);

var _createPostDragEventPreventer = require('../util/create-post-drag-event-preventer');

var _createPostDragEventPreventer2 = _interopRequireDefault(_createPostDragEventPreventer);

var _bindEvents = require('../util/bind-events');

var _createEventMarshal = require('../util/create-event-marshal');

var _createEventMarshal2 = _interopRequireDefault(_createEventMarshal);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var primaryButton = 0;
var noop = function noop() {};

var mouseDownMarshal = (0, _createEventMarshal2.default)();

exports.default = function (_ref) {
  var callbacks = _ref.callbacks,
      getDraggableRef = _ref.getDraggableRef,
      canStartCapturing = _ref.canStartCapturing;

  var state = {
    isDragging: false,
    pending: null
  };
  var setState = function setState(newState) {
    state = newState;
  };
  var isDragging = function isDragging() {
    return state.isDragging;
  };
  var isCapturing = function isCapturing() {
    return Boolean(state.pending || state.isDragging);
  };
  var schedule = (0, _createScheduler2.default)(callbacks);
  var getWindow = function getWindow() {
    return (0, _getWindowFromRef2.default)(getDraggableRef());
  };
  var postDragEventPreventer = (0, _createPostDragEventPreventer2.default)(getWindow);

  var startDragging = function startDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    setState({
      pending: null,
      isDragging: true
    });
    fn();
  };
  var stopDragging = function stopDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;
    var shouldBlockClick = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    schedule.cancel();
    unbindWindowEvents();
    mouseDownMarshal.reset();
    if (shouldBlockClick) {
      postDragEventPreventer.preventNext();
    }
    setState({
      isDragging: false,
      pending: null
    });
    fn();
  };
  var startPendingDrag = function startPendingDrag(point) {
    setState({ pending: point, isDragging: false });
    bindWindowEvents();
  };
  var stopPendingDrag = function stopPendingDrag() {
    stopDragging(noop, false);
  };

  var kill = function kill() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    if (state.pending) {
      stopPendingDrag();
      return;
    }
    stopDragging(fn);
  };

  var unmount = function unmount() {
    kill();
    postDragEventPreventer.abort();
  };

  var cancel = function cancel() {
    kill(callbacks.onCancel);
  };

  var windowBindings = [{
    eventName: 'mousemove',
    fn: function fn(event) {
      var button = event.button,
          clientX = event.clientX,
          clientY = event.clientY;

      if (button !== primaryButton) {
        return;
      }

      var point = {
        x: clientX,
        y: clientY
      };

      if (state.isDragging) {
        event.preventDefault();
        schedule.move(point);
        return;
      }

      if (!state.pending) {
        console.error('invalid state');
        return;
      }

      if (!(0, _isSloppyClickThresholdExceeded2.default)(state.pending, point)) {
        return;
      }

      event.preventDefault();
      startDragging(function () {
        return callbacks.onLift({
          client: point,
          autoScrollMode: 'FLUID'
        });
      });
    }
  }, {
    eventName: 'mouseup',
    fn: function fn(event) {
      if (state.pending) {
        stopPendingDrag();
        return;
      }

      event.preventDefault();
      stopDragging(callbacks.onDrop);
    }
  }, {
    eventName: 'mousedown',
    fn: function fn(event) {
      if (state.isDragging) {
        event.preventDefault();
      }

      stopDragging(callbacks.onCancel);
    }
  }, {
    eventName: 'keydown',
    fn: function fn(event) {
      if (!state.isDragging) {
        cancel();
        return;
      }

      if (event.keyCode === keyCodes.escape) {
        event.preventDefault();
        cancel();
        return;
      }

      (0, _preventStandardKeyEvents2.default)(event);
    }
  }, {
    eventName: 'resize',
    fn: cancel
  }, {
    eventName: 'scroll',

    options: { passive: true },
    fn: function fn() {
      if (state.pending) {
        stopPendingDrag();
        return;
      }
      schedule.windowScrollMove();
    }
  }, {
    eventName: 'webkitmouseforcechanged',
    fn: function fn(event) {
      if (event.webkitForce == null || MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN == null) {
        console.error('handling a mouse force changed event when it is not supported');
        return;
      }

      var forcePressThreshold = MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN;
      var isForcePressing = event.webkitForce >= forcePressThreshold;

      if (isForcePressing) {
        cancel();
      }
    }
  }];

  var bindWindowEvents = function bindWindowEvents() {
    var win = getWindow();
    (0, _bindEvents.bindEvents)(win, windowBindings, { capture: true });
  };

  var unbindWindowEvents = function unbindWindowEvents() {
    var win = getWindow();
    (0, _bindEvents.unbindEvents)(win, windowBindings, { capture: true });
  };

  var onMouseDown = function onMouseDown(event) {
    if (mouseDownMarshal.isHandled()) {
      return;
    }

    if (!canStartCapturing(event)) {
      return;
    }

    if (isCapturing()) {
      console.error('should not be able to perform a mouse down while a drag or pending drag is occurring');
      cancel();
      return;
    }

    var button = event.button,
        clientX = event.clientX,
        clientY = event.clientY;

    if (button !== primaryButton) {
      return;
    }

    mouseDownMarshal.handle();

    event.preventDefault();

    var point = {
      x: clientX,
      y: clientY
    };

    startPendingDrag(point);
  };

  var sensor = {
    onMouseDown: onMouseDown,
    kill: kill,
    isCapturing: isCapturing,
    isDragging: isDragging,
    unmount: unmount
  };

  return sensor;
};