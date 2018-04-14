'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bindEvents = require('./bind-events');

exports.default = function (getWindow) {
  var isBound = false;

  var bind = function bind() {
    if (isBound) {
      return;
    }
    isBound = true;
    (0, _bindEvents.bindEvents)(getWindow(), pointerEvents, { capture: true });
  };

  var unbind = function unbind() {
    if (!isBound) {
      return;
    }
    isBound = false;
    (0, _bindEvents.unbindEvents)(getWindow(), pointerEvents, { capture: true });
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
};