var _scrollJumpKeys;

import createScheduler from '../util/create-scheduler';
import preventStandardKeyEvents from '../util/prevent-standard-key-events';
import * as keyCodes from '../../key-codes';
import getWindowFromRef from '../../get-window-from-ref';
import getCenterPosition from '../../get-center-position';
import { bindEvents, unbindEvents } from '../util/bind-events';


var scrollJumpKeys = (_scrollJumpKeys = {}, _scrollJumpKeys[keyCodes.pageDown] = true, _scrollJumpKeys[keyCodes.pageUp] = true, _scrollJumpKeys[keyCodes.home] = true, _scrollJumpKeys[keyCodes.end] = true, _scrollJumpKeys);

var noop = function noop() {};

export default (function (_ref) {
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
    return getWindowFromRef(getDraggableRef());
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
  var schedule = createScheduler(callbacks);

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

      var center = getCenterPosition(ref);

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

    preventStandardKeyEvents(event);
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
    bindEvents(getWindow(), windowBindings, { capture: true });
  };

  var unbindWindowEvents = function unbindWindowEvents() {
    unbindEvents(getWindow(), windowBindings, { capture: true });
  };

  var sensor = {
    onKeyDown: onKeyDown,
    kill: kill,
    isDragging: isDragging,

    isCapturing: isDragging,

    unmount: kill
  };

  return sensor;
});