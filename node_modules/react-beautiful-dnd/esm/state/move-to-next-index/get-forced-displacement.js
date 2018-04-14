
import getDisplacement from '../get-displacement';


export var withFirstAdded = function withFirstAdded(_ref) {
  var add = _ref.add,
      previousImpact = _ref.previousImpact,
      droppable = _ref.droppable,
      draggables = _ref.draggables,
      viewport = _ref.viewport;

  var newDisplacement = {
    draggableId: add,
    isVisible: true,
    shouldAnimate: true
  };

  var added = [newDisplacement].concat(previousImpact.movement.displaced);

  var withUpdatedVisibility = added.map(function (current) {
    if (current === newDisplacement) {
      return current;
    }

    var updated = getDisplacement({
      draggable: draggables[current.draggableId],
      destination: droppable,
      previousImpact: previousImpact,
      viewport: viewport.subject
    });

    return updated;
  });

  return withUpdatedVisibility;
};

var forceVisibleDisplacement = function forceVisibleDisplacement(current) {
  if (current.isVisible) {
    return current;
  }

  return {
    draggableId: current.draggableId,
    isVisible: true,
    shouldAnimate: false
  };
};

export var withFirstRemoved = function withFirstRemoved(_ref2) {
  var dragging = _ref2.dragging,
      isVisibleInNewLocation = _ref2.isVisibleInNewLocation,
      previousImpact = _ref2.previousImpact,
      droppable = _ref2.droppable,
      draggables = _ref2.draggables;

  var last = previousImpact.movement.displaced;
  if (!last.length) {
    console.error('cannot remove displacement from empty list');
    return [];
  }

  var withFirstRestored = last.slice(1, last.length);

  if (!withFirstRestored.length) {
    return withFirstRestored;
  }

  if (isVisibleInNewLocation) {
    return withFirstRestored;
  }

  var axis = droppable.axis;

  var sizeOfRestored = draggables[last[0].draggableId].page.marginBox[axis.size];
  var sizeOfDragging = draggables[dragging].page.marginBox[axis.size];
  var buffer = sizeOfRestored + sizeOfDragging;

  var withUpdatedVisibility = withFirstRestored.map(function (displacement, index) {
    if (index === 0) {
      return forceVisibleDisplacement(displacement);
    }

    if (buffer > 0) {
      var current = draggables[displacement.draggableId];
      var size = current.page.marginBox[axis.size];
      buffer -= size;

      return forceVisibleDisplacement(displacement);
    }

    return {
      draggableId: displacement.draggableId,
      isVisible: false,
      shouldAnimate: false
    };
  });

  return withUpdatedVisibility;
};