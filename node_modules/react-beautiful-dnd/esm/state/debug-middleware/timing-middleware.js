

export default (function () {
  return function (next) {
    return function (action) {
      var key = 'action: ' + action.type;
      console.time(key);

      var result = next(action);

      console.timeEnd(key);

      return result;
    };
  };
});