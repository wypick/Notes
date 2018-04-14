
import moveToEdge from '../../move-to-edge';

import getDisplacement from '../../get-displacement';
import withDroppableDisplacement from '../../with-droppable-displacement';


export default (function (_ref) {
  var amount = _ref.amount,
      pageCenter = _ref.pageCenter,
      target = _ref.target,
      insideDroppable = _ref.insideDroppable,
      draggable = _ref.draggable,
      droppable = _ref.droppable,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var axis = droppable.axis;
  var isGoingBeforeTarget = Boolean(target && pageCenter[droppable.axis.line] < target.page.marginBox.center[droppable.axis.line]);

  if (!target) {

    var _newCenter = moveToEdge({
      source: draggable.page.paddingBox,
      sourceEdge: 'start',
      destination: droppable.page.contentBox,
      destinationEdge: 'start',
      destinationAxis: axis
    });

    var _newImpact = {
      movement: {
        displaced: [],
        amount: amount,
        isBeyondStartPosition: false
      },
      direction: axis.direction,
      destination: {
        droppableId: droppable.descriptor.id,
        index: 0
      }
    };

    return {
      pageCenter: withDroppableDisplacement(droppable, _newCenter),
      impact: _newImpact
    };
  }

  var targetIndex = insideDroppable.indexOf(target);
  var proposedIndex = isGoingBeforeTarget ? targetIndex : targetIndex + 1;

  if (targetIndex === -1) {
    console.error('could not find target inside destination');
    return null;
  }

  var newCenter = moveToEdge({
    source: draggable.page.paddingBox,
    sourceEdge: 'start',
    destination: target.page.marginBox,
    destinationEdge: isGoingBeforeTarget ? 'start' : 'end',
    destinationAxis: axis
  });

  var displaced = insideDroppable.slice(proposedIndex, insideDroppable.length).map(function (dimension) {
    return getDisplacement({
      draggable: dimension,
      destination: droppable,
      viewport: viewport.subject,
      previousImpact: previousImpact
    });
  });

  var newImpact = {
    movement: {
      displaced: displaced,
      amount: amount,
      isBeyondStartPosition: false
    },
    direction: axis.direction,
    destination: {
      droppableId: droppable.descriptor.id,
      index: proposedIndex
    }
  };

  return {
    pageCenter: withDroppableDisplacement(droppable, newCenter),
    impact: newImpact
  };
});