
import noImpact from './no-impact';
import withDroppableDisplacement from './with-droppable-displacement';
import getNewHomeClientCenter from './get-new-home-client-center';
import { add, subtract, isEqual } from './position';
import * as timings from '../debug/timings';

var origin = { x: 0, y: 0 };

var getScrollDiff = function getScrollDiff(_ref) {
  var initial = _ref.initial,
      current = _ref.current,
      droppable = _ref.droppable;

  var windowScrollDiff = subtract(initial.viewport.scroll, current.viewport.scroll);

  if (!droppable) {
    return windowScrollDiff;
  }

  return withDroppableDisplacement(droppable, windowScrollDiff);
};

export var requestDimensions = function requestDimensions(request) {
  return {
    type: 'REQUEST_DIMENSIONS',
    payload: request
  };
};

export var completeLift = function completeLift(id, client, viewport, autoScrollMode) {
  return {
    type: 'COMPLETE_LIFT',
    payload: {
      id: id,
      client: client,
      viewport: viewport,
      autoScrollMode: autoScrollMode
    }
  };
};

export var publishDraggableDimension = function publishDraggableDimension(dimension) {
  return {
    type: 'PUBLISH_DRAGGABLE_DIMENSION',
    payload: dimension
  };
};

export var publishDroppableDimension = function publishDroppableDimension(dimension) {
  return {
    type: 'PUBLISH_DROPPABLE_DIMENSION',
    payload: dimension
  };
};

export var bulkPublishDimensions = function bulkPublishDimensions(droppables, draggables) {
  return {
    type: 'BULK_DIMENSION_PUBLISH',
    payload: {
      droppables: droppables,
      draggables: draggables
    }
  };
};

export var updateDroppableDimensionScroll = function updateDroppableDimensionScroll(id, offset) {
  return {
    type: 'UPDATE_DROPPABLE_DIMENSION_SCROLL',
    payload: {
      id: id,
      offset: offset
    }
  };
};

export var updateDroppableDimensionIsEnabled = function updateDroppableDimensionIsEnabled(id, isEnabled) {
  return {
    type: 'UPDATE_DROPPABLE_DIMENSION_IS_ENABLED',
    payload: {
      id: id,
      isEnabled: isEnabled
    }
  };
};

export var move = function move(id, client, viewport) {
  var shouldAnimate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  return {
    type: 'MOVE',
    payload: {
      id: id,
      client: client,
      viewport: viewport,
      shouldAnimate: shouldAnimate
    }
  };
};

export var moveByWindowScroll = function moveByWindowScroll(id, viewport) {
  return {
    type: 'MOVE_BY_WINDOW_SCROLL',
    payload: {
      id: id,
      viewport: viewport
    }
  };
};

export var moveBackward = function moveBackward(id) {
  return {
    type: 'MOVE_BACKWARD',
    payload: id
  };
};

export var moveForward = function moveForward(id) {
  return {
    type: 'MOVE_FORWARD',
    payload: id
  };
};

export var crossAxisMoveForward = function crossAxisMoveForward(id) {
  return {
    type: 'CROSS_AXIS_MOVE_FORWARD',
    payload: id
  };
};

export var crossAxisMoveBackward = function crossAxisMoveBackward(id) {
  return {
    type: 'CROSS_AXIS_MOVE_BACKWARD',
    payload: id
  };
};

export var clean = function clean() {
  return {
    type: 'CLEAN',
    payload: null
  };
};

export var prepare = function prepare() {
  return {
    type: 'PREPARE',
    payload: null
  };
};

var animateDrop = function animateDrop(_ref2) {
  var newHomeOffset = _ref2.newHomeOffset,
      impact = _ref2.impact,
      result = _ref2.result;
  return {
    type: 'DROP_ANIMATE',
    payload: {
      newHomeOffset: newHomeOffset,
      impact: impact,
      result: result
    }
  };
};

export var completeDrop = function completeDrop(result) {
  return {
    type: 'DROP_COMPLETE',
    payload: result
  };
};

export var drop = function drop() {
  return function (dispatch, getState) {
    var state = getState();

    if (state.phase === 'PREPARING' || state.phase === 'COLLECTING_INITIAL_DIMENSIONS') {
      dispatch(clean());
      return;
    }

    if (state.phase !== 'DRAGGING') {
      console.error('not able to drop in phase: \'' + state.phase + '\'');
      dispatch(clean());
      return;
    }

    if (!state.drag) {
      console.error('not able to drop when there is invalid drag state', state);
      dispatch(clean());
      return;
    }

    var _state$drag = state.drag,
        impact = _state$drag.impact,
        initial = _state$drag.initial,
        current = _state$drag.current;

    var descriptor = initial.descriptor;
    var draggable = state.dimension.draggable[initial.descriptor.id];
    var home = state.dimension.droppable[draggable.descriptor.droppableId];
    var destination = impact.destination ? state.dimension.droppable[impact.destination.droppableId] : null;

    var source = {
      droppableId: descriptor.droppableId,
      index: descriptor.index
    };

    var result = {
      draggableId: descriptor.id,
      type: home.descriptor.type,
      source: source,
      destination: impact.destination,
      reason: 'DROP'
    };

    var newCenter = getNewHomeClientCenter({
      movement: impact.movement,
      draggable: draggable,
      draggables: state.dimension.draggable,
      destination: destination
    });

    var clientOffset = subtract(newCenter, draggable.client.marginBox.center);
    var scrollDiff = getScrollDiff({
      initial: initial,
      current: current,
      droppable: destination || home
    });
    var newHomeOffset = add(clientOffset, scrollDiff);

    var isAnimationRequired = !isEqual(current.client.offset, newHomeOffset);

    if (!isAnimationRequired) {
      dispatch(completeDrop(result));
      return;
    }

    dispatch(animateDrop({
      newHomeOffset: newHomeOffset,
      impact: impact,
      result: result
    }));
  };
};

export var cancel = function cancel() {
  return function (dispatch, getState) {
    var state = getState();

    if (state.phase !== 'DRAGGING') {
      dispatch(clean());
      return;
    }

    if (!state.drag) {
      console.error('invalid drag state', state);
      dispatch(clean());
      return;
    }

    var _state$drag2 = state.drag,
        initial = _state$drag2.initial,
        current = _state$drag2.current;

    var descriptor = initial.descriptor;
    var home = state.dimension.droppable[descriptor.droppableId];

    var source = {
      index: descriptor.index,
      droppableId: descriptor.droppableId
    };

    var result = {
      draggableId: descriptor.id,
      type: home.descriptor.type,
      source: source,

      destination: null,
      reason: 'CANCEL'
    };

    var isAnimationRequired = !isEqual(current.client.offset, origin);

    if (!isAnimationRequired) {
      dispatch(completeDrop(result));
      return;
    }

    var scrollDiff = getScrollDiff({ initial: initial, current: current, droppable: home });

    dispatch(animateDrop({
      newHomeOffset: scrollDiff,
      impact: noImpact,
      result: result
    }));
  };
};

export var dropAnimationFinished = function dropAnimationFinished() {
  return function (dispatch, getState) {
    var state = getState();

    if (state.phase !== 'DROP_ANIMATING') {
      console.error('cannot end drop that is no longer animating', state);
      dispatch(clean());
      return;
    }

    if (!state.drop || !state.drop.pending) {
      console.error('cannot end drop that has no pending state', state);
      dispatch(clean());
      return;
    }

    dispatch(completeDrop(state.drop.pending.result));
  };
};

export var lift = function lift(id, client, viewport, autoScrollMode) {
  return function (dispatch, getState) {
    var initial = getState();

    if (initial.phase === 'DROP_ANIMATING') {
      if (!initial.drop || !initial.drop.pending) {
        console.error('cannot flush drop animation if there is no pending');
        dispatch(clean());
      } else {
        dispatch(completeDrop(initial.drop.pending.result));
      }
    }

    dispatch(prepare());

    setTimeout(function () {
      var state = getState();

      if (state.phase !== 'PREPARING') {
        return;
      }

      var scrollOptions = {
        shouldPublishImmediately: autoScrollMode === 'JUMP'
      };
      var request = {
        draggableId: id,
        scrollOptions: scrollOptions
      };
      dispatch(requestDimensions(request));

      setTimeout(function () {
        var newState = getState();

        if (newState.phase !== 'COLLECTING_INITIAL_DIMENSIONS') {
          return;
        }

        dispatch(completeLift(id, client, viewport, autoScrollMode));
        timings.finish('LIFT');
      });
    });
  };
};