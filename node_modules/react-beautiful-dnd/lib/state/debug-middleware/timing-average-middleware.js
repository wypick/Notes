'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var average = function average(values) {
  var sum = values.reduce(function (previous, current) {
    return previous + current;
  }, 0);
  return sum / values.length;
};

exports.default = function (groupSize) {
  console.log('Starting average action timer middleware');
  console.log('Will take an average every ' + groupSize + ' actions');
  var bucket = {};

  return function () {
    return function (next) {
      return function (action) {
        var start = performance.now();

        var result = next(action);

        var end = performance.now();

        var duration = end - start;

        if (!bucket[action.type]) {
          bucket[action.type] = [duration];
          return result;
        }

        bucket[action.type].push(duration);

        if (bucket[action.type].length < groupSize) {
          return result;
        }

        console.warn('Average time for ' + action.type, average(bucket[action.type]));

        bucket[action.type] = [];

        return result;
      };
    };
  };
};