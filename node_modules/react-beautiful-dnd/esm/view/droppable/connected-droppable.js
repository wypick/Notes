
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import memoizeOne from 'memoize-one';
import { storeKey } from '../context-keys';
import { dragSelector, pendingDropSelector, phaseSelector, draggingDraggableSelector } from '../../state/selectors';
import Droppable from './droppable';


export var makeSelector = function makeSelector() {
  var idSelector = function idSelector(state, ownProps) {
    return ownProps.droppableId;
  };
  var isDropDisabledSelector = function isDropDisabledSelector(state, ownProps) {
    return ownProps.isDropDisabled || false;
  };

  var getIsDraggingOver = memoizeOne(function (id, destination) {
    if (!destination) {
      return false;
    }
    return destination.droppableId === id;
  });

  var getPlaceholder = memoizeOne(function (id, destination, draggable) {
    if (!draggable) {
      return null;
    }

    if (!destination) {
      return null;
    }

    if (id === draggable.descriptor.droppableId) {
      return null;
    }

    if (id !== destination.droppableId) {
      return null;
    }

    return draggable.placeholder;
  });

  var getMapProps = memoizeOne(function (isDraggingOver, draggingOverWith, placeholder) {
    return {
      isDraggingOver: isDraggingOver,
      draggingOverWith: draggingOverWith,
      placeholder: placeholder
    };
  });

  return createSelector([phaseSelector, dragSelector, draggingDraggableSelector, pendingDropSelector, idSelector, isDropDisabledSelector], function (phase, drag, draggable, pending, id, isDropDisabled) {
    if (isDropDisabled) {
      return getMapProps(false, null, null);
    }

    if (phase === 'DRAGGING') {
      if (!drag) {
        console.error('cannot determine dragging over as there is not drag');
        return getMapProps(false, null, null);
      }

      var isDraggingOver = getIsDraggingOver(id, drag.impact.destination);
      var draggingOverWith = isDraggingOver ? drag.initial.descriptor.id : null;

      var placeholder = getPlaceholder(id, drag.impact.destination, draggable);

      return getMapProps(isDraggingOver, draggingOverWith, placeholder);
    }

    if (phase === 'DROP_ANIMATING') {
      if (!pending) {
        console.error('cannot determine dragging over as there is no pending result');
        return getMapProps(false, null, null);
      }

      var _isDraggingOver = getIsDraggingOver(id, pending.impact.destination);
      var _draggingOverWith = _isDraggingOver ? pending.result.draggableId : null;

      var _placeholder = getPlaceholder(id, pending.result.destination, draggable);
      return getMapProps(_isDraggingOver, _draggingOverWith, _placeholder);
    }

    return getMapProps(false, null, null);
  });
};

var makeMapStateToProps = function makeMapStateToProps() {
  var selector = makeSelector();
  return function (state, props) {
    return selector(state, props);
  };
};

var connectedDroppable = connect(makeMapStateToProps, null, null, { storeKey: storeKey })(Droppable);

connectedDroppable.defaultProps = {
  type: 'DEFAULT',
  isDropDisabled: false,
  direction: 'vertical',
  ignoreContainerClipping: false
};

export default connectedDroppable;