import _Object$keys from 'babel-runtime/core-js/object/keys';
import _extends from 'babel-runtime/helpers/extends';

import memoizeOne from 'memoize-one';

import { add, subtract, isEqual } from './position';
import { noMovement } from './no-impact';
import getDragImpact from './get-drag-impact/';
import moveToNextIndex from './move-to-next-index/';

import moveCrossAxis from './move-cross-axis/';
import { scrollDroppable } from './dimension';

var noDimensions = {
  request: null,
  draggable: {},
  droppable: {}
};

var origin = { x: 0, y: 0 };

var clean = memoizeOne(function () {
  var phase = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'IDLE';
  return {
    phase: phase,
    drag: null,
    drop: null,
    dimension: noDimensions
  };
});

var canPublishDimension = function canPublishDimension(phase) {
  return ['IDLE', 'DROP_ANIMATING', 'DROP_COMPLETE'].indexOf(phase) === -1;
};

var move = function move(_ref) {
  var state = _ref.state,
      clientSelection = _ref.clientSelection,
      shouldAnimate = _ref.shouldAnimate,
      proposedViewport = _ref.viewport,
      impact = _ref.impact,
      scrollJumpRequest = _ref.scrollJumpRequest;

  if (state.phase !== 'DRAGGING') {
    console.error('cannot move while not dragging');
    return clean();
  }

  var last = state.drag;

  if (last == null) {
    console.error('cannot move if there is no drag information');
    return clean();
  }

  var previous = last.current;
  var initial = last.initial;
  var viewport = proposedViewport || previous.viewport;
  var currentWindowScroll = viewport.scroll;

  var client = function () {
    var offset = subtract(clientSelection, initial.client.selection);

    var result = {
      offset: offset,
      selection: clientSelection,
      center: add(offset, initial.client.center)
    };
    return result;
  }();

  var page = {
    selection: add(client.selection, currentWindowScroll),
    offset: add(client.offset, currentWindowScroll),
    center: add(client.center, currentWindowScroll)
  };

  var current = {
    client: client,
    page: page,
    shouldAnimate: shouldAnimate,
    viewport: viewport,
    hasCompletedFirstBulkPublish: previous.hasCompletedFirstBulkPublish
  };

  var newImpact = impact || getDragImpact({
    pageCenter: page.center,
    draggable: state.dimension.draggable[initial.descriptor.id],
    draggables: state.dimension.draggable,
    droppables: state.dimension.droppable,
    previousImpact: last.impact,
    viewport: viewport
  });

  var drag = {
    initial: initial,
    impact: newImpact,
    current: current,
    scrollJumpRequest: scrollJumpRequest
  };

  return _extends({}, state, {
    drag: drag
  });
};

var updateStateAfterDimensionChange = function updateStateAfterDimensionChange(newState, impact) {
  if (newState.phase === 'COLLECTING_INITIAL_DIMENSIONS') {
    return newState;
  }

  if (newState.phase !== 'DRAGGING') {
    return newState;
  }

  if (!newState.drag) {
    console.error('cannot update a draggable dimension in an existing drag as there is invalid drag state');
    return clean();
  }

  return move({
    state: newState,

    clientSelection: newState.drag.current.client.selection,
    shouldAnimate: newState.drag.current.shouldAnimate,
    impact: impact
  });
};

export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : clean('IDLE');
  var action = arguments[1];

  if (action.type === 'CLEAN') {
    return clean();
  }

  if (action.type === 'PREPARE') {
    return clean('PREPARING');
  }

  if (action.type === 'REQUEST_DIMENSIONS') {
    if (state.phase !== 'PREPARING') {
      console.error('trying to start a lift while not preparing for a lift');
      return clean();
    }

    var request = action.payload;

    return {
      phase: 'COLLECTING_INITIAL_DIMENSIONS',
      drag: null,
      drop: null,
      dimension: {
        request: request,
        draggable: {},
        droppable: {}
      }
    };
  }

  if (action.type === 'PUBLISH_DRAGGABLE_DIMENSION') {
    var _extends2;

    var dimension = action.payload;

    if (!canPublishDimension(state.phase)) {
      console.warn('dimensions rejected as no longer allowing dimension capture in phase', state.phase);
      return state;
    }

    var newState = _extends({}, state, {
      dimension: {
        request: state.dimension.request,
        droppable: state.dimension.droppable,
        draggable: _extends({}, state.dimension.draggable, (_extends2 = {}, _extends2[dimension.descriptor.id] = dimension, _extends2))
      }
    });

    return updateStateAfterDimensionChange(newState);
  }

  if (action.type === 'PUBLISH_DROPPABLE_DIMENSION') {
    var _extends3;

    var _dimension = action.payload;

    if (!canPublishDimension(state.phase)) {
      console.warn('dimensions rejected as no longer allowing dimension capture in phase', state.phase);
      return state;
    }

    var _newState = _extends({}, state, {
      dimension: {
        request: state.dimension.request,
        draggable: state.dimension.draggable,
        droppable: _extends({}, state.dimension.droppable, (_extends3 = {}, _extends3[_dimension.descriptor.id] = _dimension, _extends3))
      }
    });

    return updateStateAfterDimensionChange(_newState);
  }

  if (action.type === 'BULK_DIMENSION_PUBLISH') {
    var draggables = action.payload.draggables;
    var droppables = action.payload.droppables;

    if (!canPublishDimension(state.phase)) {
      console.warn('dimensions rejected as no longer allowing dimension capture in phase', state.phase);
      return state;
    }

    var newDraggables = draggables.reduce(function (previous, current) {
      previous[current.descriptor.id] = current;
      return previous;
    }, {});

    var newDroppables = droppables.reduce(function (previous, current) {
      previous[current.descriptor.id] = current;
      return previous;
    }, {});

    var drag = function () {
      var existing = state.drag;
      if (!existing) {
        return null;
      }

      if (existing.current.hasCompletedFirstBulkPublish) {
        return existing;
      }

      var newDrag = _extends({}, existing, {
        current: _extends({}, existing.current, {
          hasCompletedFirstBulkPublish: true
        })
      });

      return newDrag;
    }();

    var _newState2 = _extends({}, state, {
      drag: drag,
      dimension: {
        request: state.dimension.request,
        draggable: _extends({}, state.dimension.draggable, newDraggables),
        droppable: _extends({}, state.dimension.droppable, newDroppables)
      }
    });

    return updateStateAfterDimensionChange(_newState2);
  }

  if (action.type === 'COMPLETE_LIFT') {
    if (state.phase !== 'COLLECTING_INITIAL_DIMENSIONS') {
      console.error('trying complete lift without collecting dimensions');
      return state;
    }

    var _action$payload = action.payload,
        id = _action$payload.id,
        client = _action$payload.client,
        _viewport = _action$payload.viewport,
        autoScrollMode = _action$payload.autoScrollMode;

    var page = {
      selection: add(client.selection, _viewport.scroll),
      center: add(client.center, _viewport.scroll)
    };

    var draggable = state.dimension.draggable[id];

    if (!draggable) {
      console.error('could not find draggable in store after lift');
      return clean();
    }

    var descriptor = draggable.descriptor;

    var initial = {
      descriptor: descriptor,
      autoScrollMode: autoScrollMode,
      client: client,
      page: page,
      viewport: _viewport
    };

    var current = {
      client: {
        selection: client.selection,
        center: client.center,
        offset: origin
      },
      page: {
        selection: page.selection,
        center: page.center,
        offset: origin
      },
      viewport: _viewport,
      hasCompletedFirstBulkPublish: false,
      shouldAnimate: false
    };

    var home = state.dimension.droppable[descriptor.droppableId];

    if (!home) {
      console.error('Cannot find home dimension for initial lift');
      return clean();
    }

    var destination = {
      index: descriptor.index,
      droppableId: descriptor.droppableId
    };

    var _impact = {
      movement: noMovement,
      direction: home.axis.direction,
      destination: destination
    };

    return _extends({}, state, {
      phase: 'DRAGGING',
      drag: {
        initial: initial,
        current: current,
        impact: _impact,
        scrollJumpRequest: null
      }
    });
  }

  if (action.type === 'UPDATE_DROPPABLE_DIMENSION_SCROLL') {
    var _extends4;

    if (state.phase !== 'DRAGGING') {
      console.error('cannot update a droppable dimensions scroll when not dragging');
      return clean();
    }

    var _drag = state.drag;

    if (_drag == null) {
      console.error('invalid store state');
      return clean();
    }

    var _action$payload2 = action.payload,
        _id = _action$payload2.id,
        offset = _action$payload2.offset;


    var target = state.dimension.droppable[_id];

    if (!target) {
      console.warn('cannot update scroll for droppable as it has not yet been collected');
      return state;
    }

    var _dimension2 = scrollDroppable(target, offset);

    var _impact2 = _drag.initial.autoScrollMode === 'JUMP' ? _drag.impact : null;

    var _newState3 = _extends({}, state, {
      dimension: {
        request: state.dimension.request,
        draggable: state.dimension.draggable,
        droppable: _extends({}, state.dimension.droppable, (_extends4 = {}, _extends4[_id] = _dimension2, _extends4))
      }
    });

    return updateStateAfterDimensionChange(_newState3, _impact2);
  }

  if (action.type === 'UPDATE_DROPPABLE_DIMENSION_IS_ENABLED') {
    var _extends5;

    if (!_Object$keys(state.dimension.droppable).length) {
      return state;
    }

    var _action$payload3 = action.payload,
        _id2 = _action$payload3.id,
        isEnabled = _action$payload3.isEnabled;

    var _target = state.dimension.droppable[_id2];

    if (!_target) {
      console.warn('cannot update enabled state for droppable as it has not yet been collected');
      return state;
    }

    if (_target.isEnabled === isEnabled) {
      console.warn('trying to set droppable isEnabled to ' + String(isEnabled) + ' but it is already ' + String(isEnabled));
      return state;
    }

    var updatedDroppableDimension = _extends({}, _target, {
      isEnabled: isEnabled
    });

    var result = _extends({}, state, {
      dimension: _extends({}, state.dimension, {
        droppable: _extends({}, state.dimension.droppable, (_extends5 = {}, _extends5[_id2] = updatedDroppableDimension, _extends5))
      })
    });

    return updateStateAfterDimensionChange(result);
  }

  if (action.type === 'MOVE') {
    var _action$payload4 = action.payload,
        _client = _action$payload4.client,
        _viewport2 = _action$payload4.viewport,
        _shouldAnimate = _action$payload4.shouldAnimate;

    var _drag2 = state.drag;

    if (!_drag2) {
      console.error('Cannot move while there is no drag state');
      return state;
    }

    var _impact3 = function () {
      if (!_drag2.current.hasCompletedFirstBulkPublish) {
        return _drag2.impact;
      }

      if (_drag2.initial.autoScrollMode === 'JUMP') {
        return _drag2.impact;
      }

      return null;
    }();

    return move({
      state: state,
      clientSelection: _client,
      viewport: _viewport2,
      shouldAnimate: _shouldAnimate,
      impact: _impact3
    });
  }

  if (action.type === 'MOVE_BY_WINDOW_SCROLL') {
    var _viewport3 = action.payload.viewport;

    var _drag3 = state.drag;

    if (!_drag3) {
      console.error('cannot move with window scrolling if no current drag');
      return clean();
    }

    if (isEqual(_viewport3.scroll, _drag3.current.viewport.scroll)) {
      return state;
    }

    var isJumpScrolling = _drag3.initial.autoScrollMode === 'JUMP';

    var _impact4 = isJumpScrolling ? _drag3.impact : null;

    return move({
      state: state,
      clientSelection: _drag3.current.client.selection,
      viewport: _viewport3,
      shouldAnimate: false,
      impact: _impact4
    });
  }

  if (action.type === 'MOVE_FORWARD' || action.type === 'MOVE_BACKWARD') {
    if (state.phase !== 'DRAGGING') {
      console.error('cannot move while not dragging', action);
      return clean();
    }

    if (!state.drag) {
      console.error('cannot move if there is no drag information');
      return clean();
    }

    var existing = state.drag;
    var isMovingForward = action.type === 'MOVE_FORWARD';

    if (!existing.impact.destination) {
      console.error('cannot move if there is no previous destination');
      return clean();
    }

    var droppable = state.dimension.droppable[existing.impact.destination.droppableId];

    var _result = moveToNextIndex({
      isMovingForward: isMovingForward,
      draggableId: existing.initial.descriptor.id,
      droppable: droppable,
      draggables: state.dimension.draggable,
      previousPageCenter: existing.current.page.center,
      previousImpact: existing.impact,
      viewport: existing.current.viewport
    });

    if (!_result) {
      return state;
    }

    var _impact5 = _result.impact;
    var _page = _result.pageCenter;
    var _client2 = subtract(_page, existing.current.viewport.scroll);

    return move({
      state: state,
      impact: _impact5,
      clientSelection: _client2,
      shouldAnimate: true,
      scrollJumpRequest: _result.scrollJumpRequest
    });
  }

  if (action.type === 'CROSS_AXIS_MOVE_FORWARD' || action.type === 'CROSS_AXIS_MOVE_BACKWARD') {
    if (state.phase !== 'DRAGGING') {
      console.error('cannot move cross axis when not dragging');
      return clean();
    }

    if (!state.drag) {
      console.error('cannot move cross axis if there is no drag information');
      return clean();
    }

    if (!state.drag.impact.destination) {
      console.error('cannot move cross axis if not in a droppable');
      return clean();
    }

    var _current = state.drag.current;
    var _descriptor = state.drag.initial.descriptor;
    var draggableId = _descriptor.id;
    var center = _current.page.center;
    var droppableId = state.drag.impact.destination.droppableId;
    var _home = {
      index: _descriptor.index,
      droppableId: _descriptor.droppableId
    };

    var _result2 = moveCrossAxis({
      isMovingForward: action.type === 'CROSS_AXIS_MOVE_FORWARD',
      pageCenter: center,
      draggableId: draggableId,
      droppableId: droppableId,
      home: _home,
      draggables: state.dimension.draggable,
      droppables: state.dimension.droppable,
      previousImpact: state.drag.impact,
      viewport: _current.viewport
    });

    if (!_result2) {
      return state;
    }

    var _page2 = _result2.pageCenter;
    var _client3 = subtract(_page2, _current.viewport.scroll);

    return move({
      state: state,
      clientSelection: _client3,
      impact: _result2.impact,
      shouldAnimate: true
    });
  }

  if (action.type === 'DROP_ANIMATE') {
    var _action$payload5 = action.payload,
        newHomeOffset = _action$payload5.newHomeOffset,
        _impact6 = _action$payload5.impact,
        _result3 = _action$payload5.result;


    if (state.phase !== 'DRAGGING') {
      console.error('cannot animate drop while not dragging', action);
      return state;
    }

    if (!state.drag) {
      console.error('cannot animate drop - invalid drag state');
      return clean();
    }

    var pending = {
      newHomeOffset: newHomeOffset,
      result: _result3,
      impact: _impact6
    };

    return {
      phase: 'DROP_ANIMATING',
      drag: null,
      drop: {
        pending: pending,
        result: null
      },
      dimension: state.dimension
    };
  }

  if (action.type === 'DROP_COMPLETE') {
    var _result4 = action.payload;

    return {
      phase: 'DROP_COMPLETE',
      drag: null,
      drop: {
        pending: null,
        result: _result4
      },
      dimension: noDimensions
    };
  }

  return state;
});