
import getDraggablesInsideDroppable from '../get-draggables-inside-droppable';
import { patch, subtract } from '../position';
import withDroppableDisplacement from '../with-droppable-displacement';
import isTotallyVisibleInNewLocation from './is-totally-visible-in-new-location';

import moveToEdge from '../move-to-edge';
import { withFirstAdded, withFirstRemoved } from './get-forced-displacement';


export default (function (_ref) {
  var isMovingForward = _ref.isMovingForward,
      draggableId = _ref.draggableId,
      previousPageCenter = _ref.previousPageCenter,
      previousImpact = _ref.previousImpact,
      droppable = _ref.droppable,
      draggables = _ref.draggables,
      viewport = _ref.viewport;

  var location = previousImpact.destination;

  if (!location) {
    console.error('cannot move to next index when there is not previous destination');
    return null;
  }

  var draggable = draggables[draggableId];
  var axis = droppable.axis;

  var insideDroppable = getDraggablesInsideDroppable(droppable, draggables);

  var startIndex = draggable.descriptor.index;
  var currentIndex = location.index;
  var proposedIndex = isMovingForward ? currentIndex + 1 : currentIndex - 1;

  if (startIndex === -1) {
    console.error('could not find draggable inside current droppable');
    return null;
  }

  if (proposedIndex > insideDroppable.length - 1) {
    return null;
  }

  if (proposedIndex < 0) {
    return null;
  }

  var destination = insideDroppable[proposedIndex];
  var isMovingTowardStart = isMovingForward && proposedIndex <= startIndex || !isMovingForward && proposedIndex >= startIndex;

  var edge = function () {
    if (!isMovingTowardStart) {
      return isMovingForward ? 'end' : 'start';
    }

    return isMovingForward ? 'start' : 'end';
  }();

  var newPageCenter = moveToEdge({
    source: draggable.page.paddingBox,
    sourceEdge: edge,
    destination: destination.page.paddingBox,
    destinationEdge: edge,
    destinationAxis: droppable.axis
  });

  var isVisibleInNewLocation = isTotallyVisibleInNewLocation({
    draggable: draggable,
    destination: droppable,
    newPageCenter: newPageCenter,
    viewport: viewport.subject
  });

  var displaced = function () {
    if (isMovingTowardStart) {
      return withFirstRemoved({
        dragging: draggableId,
        isVisibleInNewLocation: isVisibleInNewLocation,
        previousImpact: previousImpact,
        droppable: droppable,
        draggables: draggables
      });
    }
    return withFirstAdded({
      add: destination.descriptor.id,
      previousImpact: previousImpact,
      droppable: droppable,
      draggables: draggables,
      viewport: viewport
    });
  }();

  var newImpact = {
    movement: {
      displaced: displaced,
      amount: patch(axis.line, draggable.page.marginBox[axis.size]),
      isBeyondStartPosition: proposedIndex > startIndex
    },
    destination: {
      droppableId: droppable.descriptor.id,
      index: proposedIndex
    },
    direction: droppable.axis.direction
  };

  if (isVisibleInNewLocation) {
    return {
      pageCenter: withDroppableDisplacement(droppable, newPageCenter),
      impact: newImpact,
      scrollJumpRequest: null
    };
  }

  var distance = subtract(newPageCenter, previousPageCenter);
  var distanceWithScroll = withDroppableDisplacement(droppable, distance);

  return {
    pageCenter: previousPageCenter,
    impact: newImpact,
    scrollJumpRequest: distanceWithScroll
  };
});