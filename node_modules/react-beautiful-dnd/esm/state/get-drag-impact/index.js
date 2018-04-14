
import getDroppableOver from '../get-droppable-over';
import getDraggablesInsideDroppable from '../get-draggables-inside-droppable';
import noImpact from '../no-impact';
import inHomeList from './in-home-list';
import inForeignList from './in-foreign-list';

export default (function (_ref) {
  var pageCenter = _ref.pageCenter,
      draggable = _ref.draggable,
      draggables = _ref.draggables,
      droppables = _ref.droppables,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var previousDroppableOverId = previousImpact.destination && previousImpact.destination.droppableId;

  var destinationId = getDroppableOver({
    target: pageCenter,
    draggable: draggable,
    draggables: draggables,
    droppables: droppables,
    previousDroppableOverId: previousDroppableOverId
  });

  if (!destinationId) {
    return noImpact;
  }

  var destination = droppables[destinationId];

  if (!destination.isEnabled) {
    return noImpact;
  }

  var home = droppables[draggable.descriptor.droppableId];
  var isWithinHomeDroppable = home.descriptor.id === destinationId;
  var insideDestination = getDraggablesInsideDroppable(destination, draggables);

  if (isWithinHomeDroppable) {
    return inHomeList({
      pageCenter: pageCenter,
      draggable: draggable,
      home: home,
      insideHome: insideDestination,
      previousImpact: previousImpact || noImpact,
      viewport: viewport
    });
  }

  return inForeignList({
    pageCenter: pageCenter,
    draggable: draggable,
    destination: destination,
    insideDestination: insideDestination,
    previousImpact: previousImpact || noImpact,
    viewport: viewport
  });
});