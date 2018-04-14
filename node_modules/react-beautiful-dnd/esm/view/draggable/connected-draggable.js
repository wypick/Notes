
import memoizeOne from 'memoize-one';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Draggable from './draggable';
import { storeKey } from '../context-keys';
import { negate } from '../../state/position';
import getDisplacementMap from '../../state/get-displacement-map';
import { lift as liftAction, move as moveAction, moveForward as moveForwardAction, moveBackward as moveBackwardAction, crossAxisMoveForward as crossAxisMoveForwardAction, crossAxisMoveBackward as crossAxisMoveBackwardAction, drop as dropAction, cancel as cancelAction, dropAnimationFinished as dropAnimationFinishedAction, moveByWindowScroll as moveByWindowScrollAction } from '../../state/action-creators';


var origin = { x: 0, y: 0 };

var defaultMapProps = {
  isDropAnimating: false,
  isDragging: false,
  offset: origin,
  shouldAnimateDragMovement: false,

  shouldAnimateDisplacement: true,

  dimension: null,
  direction: null,
  draggingOver: null
};

export var makeSelector = function makeSelector() {
  var memoizedOffset = memoizeOne(function (x, y) {
    return {
      x: x, y: y
    };
  });

  var getNotDraggingProps = memoizeOne(function (offset, shouldAnimateDisplacement) {
    return {
      isDropAnimating: false,
      isDragging: false,
      offset: offset,
      shouldAnimateDisplacement: shouldAnimateDisplacement,

      shouldAnimateDragMovement: false,
      dimension: null,
      direction: null,
      draggingOver: null
    };
  });

  var getDraggingProps = memoizeOne(function (offset, shouldAnimateDragMovement, dimension, direction, draggingOver) {
    return {
      isDragging: true,
      isDropAnimating: false,
      shouldAnimateDisplacement: false,
      offset: offset,
      shouldAnimateDragMovement: shouldAnimateDragMovement,
      dimension: dimension,
      direction: direction,
      draggingOver: draggingOver
    };
  });

  var draggingSelector = function draggingSelector(state, ownProps) {
    if (state.phase !== 'DRAGGING' && state.phase !== 'DROP_ANIMATING') {
      return null;
    }

    if (state.phase === 'DRAGGING') {
      if (!state.drag) {
        console.error('invalid drag state found in selector');
        return null;
      }

      if (state.drag.initial.descriptor.id !== ownProps.draggableId) {
        return null;
      }

      var offset = state.drag.current.client.offset;
      var dimension = state.dimension.draggable[ownProps.draggableId];
      var _direction = state.drag.impact.direction;
      var shouldAnimateDragMovement = state.drag.current.shouldAnimate;
      var _draggingOver = state.drag.impact.destination ? state.drag.impact.destination.droppableId : null;

      return getDraggingProps(memoizedOffset(offset.x, offset.y), shouldAnimateDragMovement, dimension, _direction, _draggingOver);
    }

    var pending = state.drop && state.drop.pending;

    if (!pending) {
      console.error('cannot provide props for dropping item when there is invalid state');
      return null;
    }

    if (pending.result.draggableId !== ownProps.draggableId) {
      return null;
    }

    var draggingOver = pending.result.destination ? pending.result.destination.droppableId : null;
    var direction = pending.impact.direction ? pending.impact.direction : null;

    return {
      isDragging: false,
      isDropAnimating: true,
      offset: pending.newHomeOffset,

      dimension: state.dimension.draggable[ownProps.draggableId],
      draggingOver: draggingOver,
      direction: direction,

      shouldAnimateDragMovement: false,

      shouldAnimateDisplacement: false
    };
  };

  var getOutOfTheWayMovement = function getOutOfTheWayMovement(id, movement) {
    var map = getDisplacementMap(movement.displaced);
    var displacement = map[id];

    if (!displacement) {
      return null;
    }

    if (!displacement.isVisible) {
      return null;
    }

    var amount = movement.isBeyondStartPosition ? negate(movement.amount) : movement.amount;

    return getNotDraggingProps(memoizedOffset(amount.x, amount.y), displacement.shouldAnimate);
  };

  var movingOutOfTheWaySelector = function movingOutOfTheWaySelector(state, ownProps) {
    if (state.phase !== 'DRAGGING' && state.phase !== 'DROP_ANIMATING') {
      return null;
    }

    if (state.phase === 'DRAGGING') {
      if (!state.drag) {
        console.error('cannot correctly move item out of the way when there is invalid state');
        return null;
      }

      if (state.drag.initial.descriptor.id === ownProps.draggableId) {
        return null;
      }

      return getOutOfTheWayMovement(ownProps.draggableId, state.drag.impact.movement);
    }

    if (!state.drop || !state.drop.pending) {
      console.error('cannot provide props for dropping item when there is invalid state');
      return null;
    }

    if (state.drop.pending.result.draggableId === ownProps.draggableId) {
      return null;
    }

    return getOutOfTheWayMovement(ownProps.draggableId, state.drop.pending.impact.movement);
  };

  return createSelector([draggingSelector, movingOutOfTheWaySelector], function (dragging, movingOutOfTheWay) {
    if (dragging) {
      return dragging;
    }

    if (movingOutOfTheWay) {
      return movingOutOfTheWay;
    }

    return defaultMapProps;
  });
};

var makeMapStateToProps = function makeMapStateToProps() {
  var selector = makeSelector();
  return function (state, props) {
    return selector(state, props);
  };
};

var mapDispatchToProps = {
  lift: liftAction,
  move: moveAction,
  moveForward: moveForwardAction,
  moveBackward: moveBackwardAction,
  crossAxisMoveForward: crossAxisMoveForwardAction,
  crossAxisMoveBackward: crossAxisMoveBackwardAction,
  moveByWindowScroll: moveByWindowScrollAction,
  drop: dropAction,
  dropAnimationFinished: dropAnimationFinishedAction,
  cancel: cancelAction
};

var ConnectedDraggable = connect(makeMapStateToProps, mapDispatchToProps, null, { storeKey: storeKey })(Draggable);

ConnectedDraggable.defaultProps = {
  isDragDisabled: false,

  disableInteractiveElementBlocking: false
};

export default ConnectedDraggable;