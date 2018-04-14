

export var add = function add(point1, point2) {
  return {
    x: point1.x + point2.x,
    y: point1.y + point2.y
  };
};

export var subtract = function subtract(point1, point2) {
  return {
    x: point1.x - point2.x,
    y: point1.y - point2.y
  };
};

export var isEqual = function isEqual(point1, point2) {
  return point1.x === point2.x && point1.y === point2.y;
};

export var negate = function negate(point) {
  return {
    x: point.x !== 0 ? -point.x : 0,
    y: point.y !== 0 ? -point.y : 0
  };
};

export var absolute = function absolute(point) {
  return {
    x: Math.abs(point.x),
    y: Math.abs(point.y)
  };
};

export var patch = function patch(line, value) {
  var _ref;

  var otherValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return _ref = {}, _ref[line] = value, _ref[line === 'x' ? 'y' : 'x'] = otherValue, _ref;
};

export var distance = function distance(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

export var closest = function closest(target, points) {
  return Math.min.apply(Math, points.map(function (point) {
    return distance(target, point);
  }));
};

export var apply = function apply(fn) {
  return function (point) {
    return {
      x: fn(point.x),
      y: fn(point.y)
    };
  };
};