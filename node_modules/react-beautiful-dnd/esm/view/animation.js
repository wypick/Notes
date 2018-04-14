import _extends from 'babel-runtime/helpers/extends';


export var physics = function () {
  var base = {
    stiffness: 1000,
    damping: 60,

    precision: 0.99
  };

  var standard = _extends({}, base);

  var fast = _extends({}, base, {
    stiffness: base.stiffness * 2
  });

  return { standard: standard, fast: fast };
}();

export var css = {
  outOfTheWay: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)'
};