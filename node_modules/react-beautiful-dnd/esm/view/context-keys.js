
var prefix = function prefix(key) {
  return 'private-react-beautiful-dnd-key-do-not-use-' + key;
};

export var storeKey = prefix('store');
export var droppableIdKey = prefix('droppable-id');
export var dimensionMarshalKey = prefix('dimension-marshal');
export var styleContextKey = prefix('style-context');
export var canLiftContextKey = prefix('can-lift');