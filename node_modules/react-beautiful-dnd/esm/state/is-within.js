

export default (function (lowerBound, upperBound) {
  return function (value) {
    return value <= upperBound && value >= lowerBound;
  };
});