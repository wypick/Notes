
import getDraggablesInsideDroppable from '../get-draggables-inside-droppable';
import { patch, subtract } from '../position';
import withDroppableDisplacement from '../with-droppable-displacement';
import moveToEdge from '../move-to-edge';
import isTotallyVisibleInNewLocation from './is-totally-visible-in-new-location';
import { withFirstAdded, withFirstRemoved } from './get-forced-displacement';


export default (function (_ref) {
  var isMovingForward = _ref.isMovingForward,
      draggableId = _ref.draggableId,
      previousImpact = _ref.previousImpact,
      previousPageCenter = _ref.previousPageCenter,
      droppable = _ref.droppable,
      draggables = _ref.draggables,
      viewport = _ref.viewport;

  if (!previousImpact.destination) {
    console.error('cannot move to next index when there is not previous destination');
    return null;
  }

  var location = previousImpact.destination;
  var draggable = draggables[draggableId];
  var axis = droppable.axis;

  var insideForeignDroppable = getDraggablesInsideDroppable(droppable, draggables);

  var currentIndex = location.index;
  var proposedIndex = isMovingForward ? currentIndex + 1 : currentIndex - 1;
  var lastIndex = insideForeignDroppable.length - 1;

  if (proposedIndex > insideForeignDroppable.length) {
    return null;
  }

  if (proposedIndex < 0) {
    return null;
  }

  var movingRelativeTo = insideForeignDroppable[Math.min(proposedIndex, lastIndex)];

  var isMovingPastLastIndex = proposedIndex > lastIndex;
  var sourceEdge = 'start';
  var destinationEdge = function () {
    if (isMovingPastLastIndex) {
      return 'end';
    }

    return 'start';
  }();

  var newPageCenter = moveToEdge({
    source: draggable.page.paddingBox,
    sourceEdge: sourceEdge,
    destination: movingRelativeTo.page.marginBox,
    destinationEdge: destinationEdge,
    destinationAxis: droppable.axis
  });

  var isVisibleInNewLocation = isTotallyVisibleInNewLocation({
    draggable: draggable,
    destination: droppable,
    newPageCenter: newPageCenter,
    viewport: viewport.subject
  });

  var displaced = function () {
    if (isMovingForward) {
      return withFirstRemoved({
        dragging: draggableId,
        isVisibleInNewLocation: isVisibleInNewLocation,
        previousImpact: previousImpact,
        droppable: droppable,
        draggables: draggables
      });
    }
    return withFirstAdded({
      add: movingRelativeTo.descriptor.id,
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

      isBeyondStartPosition: false
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

  var distanceMoving = subtract(newPageCenter, previousPageCenter);
  var distanceWithScroll = withDroppableDisplacement(droppable, distanceMoving);

  return {
    pageCenter: previousPageCenter,
    impact: newImpact,
    scrollJumpRequest: distanceWithScroll
  };
});