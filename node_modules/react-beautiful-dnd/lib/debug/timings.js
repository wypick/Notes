'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var records = {};

var flag = '__react-beautiful-dnd-debug-timings-hook__';

var isTimingsEnabled = function isTimingsEnabled() {
  return Boolean(window[flag]);
};

var start = exports.start = function start(key) {
  if (!isTimingsEnabled()) {
    return;
  }
  var now = performance.now();

  records[key] = now;
};

var finish = exports.finish = function finish(key) {
  if (!isTimingsEnabled()) {
    return;
  }
  var now = performance.now();

  var previous = records[key];

  if (previous == null) {
    console.error('cannot finish timing as no previous time found');
    return;
  }

  var result = now - previous;

  console.log('%cTiming (' + key + '): %c' + result + ' %cms', 'font-weight: bold;', 'color: blue;', 'color: grey;');
};