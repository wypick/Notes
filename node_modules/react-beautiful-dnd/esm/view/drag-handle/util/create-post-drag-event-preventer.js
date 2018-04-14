
import { bindEvents, unbindEvents } from './bind-events';

export default (function (getWindow) {
  var isBound = false;

  var bind = function bind() {
    if (isBound) {
      return;
    }
    isBound = true;
    bindEvents(getWindow(), pointerEvents, { capture: true });
  };

  var unbind = function unbind() {
    if (!isBound) {
      return;
    }
    isBound = false;
    unbindEvents(getWindow(), pointerEvents, { capture: true });
  };

  var pointerEvents = [{
    eventName: 'click',
    fn: function fn(event) {
      event.preventDefault();
      unbind();
    }
  }, {
    eventName: 'mousedown',

    fn: unbind
  }, {
    eventName: 'touchstart',
    fn: unbind
  }];

  var preventNext = function preventNext() {
    if (isBound) {
      unbind();
    }

    bind();
  };

  var preventer = {
    preventNext: preventNext,
    abort: unbind
  };

  return preventer;
});