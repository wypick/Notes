import _extends from 'babel-runtime/helpers/extends';

import createScheduler from '../util/create-scheduler';
import getWindowFromRef from '../../get-window-from-ref';
import createPostDragEventPreventer from '../util/create-post-drag-event-preventer';
import createEventMarshal from '../util/create-event-marshal';
import { bindEvents, unbindEvents } from '../util/bind-events';
import * as keyCodes from '../../key-codes';


export var timeForLongPress = 150;
export var forcePressThreshold = 0.15;
var touchStartMarshal = createEventMarshal();

var noop = function noop() {};

var initial = {
  isDragging: false,
  pending: null,
  hasMoved: false,
  longPressTimerId: null
};

export default (function (_ref) {
  var callbacks = _ref.callbacks,
      getDraggableRef = _ref.getDraggableRef,
      canStartCapturing = _ref.canStartCapturing;

  var state = initial;

  var getWindow = function getWindow() {
    return getWindowFromRef(getDraggableRef());
  };
  var setState = function setState(partial) {
    state = _extends({}, state, partial);
  };
  var isDragging = function isDragging() {
    return state.isDragging;
  };
  var isCapturing = function isCapturing() {
    return Boolean(state.pending || state.isDragging || state.longPressTimerId);
  };
  var schedule = createScheduler(callbacks);
  var postDragEventPreventer = createPostDragEventPreventer(getWindow);

  var startDragging = function startDragging() {
    var pending = state.pending;

    if (!pending) {
      console.error('cannot start a touch drag without a pending position');
      kill();
      return;
    }

    setState({
      isDragging: true,

      hasMoved: false,

      pending: null,
      longPressTimerId: null
    });

    callbacks.onLift({
      client: pending,
      autoScrollMode: 'FLUID'
    });
  };
  var stopDragging = function stopDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    schedule.cancel();
    touchStartMarshal.reset();
    unbindWindowEvents();
    postDragEventPreventer.preventNext();
    setState(initial);
    fn();
  };

  var startPendingDrag = function startPendingDrag(event) {
    var touch = event.touches[0];
    var clientX = touch.clientX,
        clientY = touch.clientY;

    var point = {
      x: clientX,
      y: clientY
    };

    var longPressTimerId = setTimeout(startDragging, timeForLongPress);

    setState({
      longPressTimerId: longPressTimerId,
      pending: point,
      isDragging: false,
      hasMoved: false
    });
    bindWindowEvents();
  };

  var stopPendingDrag = function stopPendingDrag() {
    if (state.longPressTimerId) {
      clearTimeout(state.longPressTimerId);
    }
    schedule.cancel();
    touchStartMarshal.reset();
    unbindWindowEvents();

    setState(initial);
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
    eventName: 'touchmove',

    options: { passive: false },
    fn: function fn(event) {
      if (!state.isDragging) {
        stopPendingDrag();
        return;
      }

      if (!state.hasMoved) {
        setState({
          hasMoved: true
        });
      }

      var _event$touches$ = event.touches[0],
          clientX = _event$touches$.clientX,
          clientY = _event$touches$.clientY;


      var point = {
        x: clientX,
        y: clientY
      };

      event.preventDefault();
      schedule.move(point);
    }
  }, {
    eventName: 'touchend',
    fn: function fn(event) {
      if (!state.isDragging) {
        stopPendingDrag();
        return;
      }

      event.preventDefault();
      stopDragging(callbacks.onDrop);
    }
  }, {
    eventName: 'touchcancel',
    fn: function fn(event) {
      if (!state.isDragging) {
        stopPendingDrag();
        return;
      }

      event.preventDefault();
      stopDragging(callbacks.onCancel);
    }
  }, {
    eventName: 'touchstart',
    fn: cancel
  }, {
    eventName: 'orientationchange',
    fn: cancel
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
    eventName: 'contextmenu',
    fn: function fn(event) {
      event.preventDefault();
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
      }
      cancel();
    }
  }, {
    eventName: 'touchforcechange',
    fn: function fn(event) {
      if (state.hasMoved) {
        event.preventDefault();
        return;
      }

      var touch = event.touches[0];

      if (touch.force >= forcePressThreshold) {
        cancel();
      }
    }
  }];

  var bindWindowEvents = function bindWindowEvents() {
    bindEvents(getWindow(), windowBindings, { capture: true });
  };

  var unbindWindowEvents = function unbindWindowEvents() {
    unbindEvents(getWindow(), windowBindings, { capture: true });
  };

  var onTouchStart = function onTouchStart(event) {
    if (touchStartMarshal.isHandled()) {
      return;
    }

    if (!canStartCapturing(event)) {
      return;
    }

    if (isCapturing()) {
      console.error('should not be able to perform a touch start while a drag or pending drag is occurring');
      cancel();
      return;
    }

    touchStartMarshal.handle();

    startPendingDrag(event);
  };

  var onTouchMove = function onTouchMove() {
    if (state.pending) {
      stopPendingDrag();
    }
  };

  var sensor = {
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    kill: kill,
    isCapturing: isCapturing,
    isDragging: isDragging,
    unmount: unmount
  };

  return sensor;
});