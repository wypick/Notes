'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var isMouseDownHandled = false;

  var handle = function handle() {
    if (isMouseDownHandled) {
      console.error('Cannot handle mouse down as it is already handled');
      return;
    }
    isMouseDownHandled = true;
  };

  var isHandled = function isHandled() {
    return isMouseDownHandled;
  };

  var reset = function reset() {
    isMouseDownHandled = false;
  };

  return {
    handle: handle,
    isHandled: isHandled,
    reset: reset
  };
};