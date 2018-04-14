

var origin = { x: 0, y: 0 };

export var noMovement = {
  displaced: [],
  amount: origin,
  isBeyondStartPosition: false
};

var noImpact = {
  movement: noMovement,
  direction: null,
  destination: null
};

export default noImpact;