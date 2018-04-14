
import { createSelector } from 'reselect';


export var phaseSelector = function phaseSelector(state) {
  return state.phase;
};

export var pendingDropSelector = function pendingDropSelector(state) {
  if (!state.drop || !state.drop.pending) {
    return null;
  }
  return state.drop.pending;
};

export var dragSelector = function dragSelector(state) {
  return state.drag;
};

var draggableMapSelector = function draggableMapSelector(state) {
  return state.dimension.draggable;
};

export var draggingDraggableSelector = createSelector([phaseSelector, dragSelector, pendingDropSelector, draggableMapSelector], function (phase, drag, pending, draggables) {
  if (phase === 'DRAGGING') {
    if (!drag) {
      console.error('cannot get placeholder dimensions as there is an invalid drag state');
      return null;
    }

    var draggable = draggables[drag.initial.descriptor.id];
    return draggable;
  }

  if (phase === 'DROP_ANIMATING') {
    if (!pending) {
      console.error('cannot get placeholder dimensions as there is an invalid drag state');
      return null;
    }

    if (!pending.result.destination) {
      return null;
    }

    var _draggable = draggables[pending.result.draggableId];
    return _draggable;
  }

  return null;
});