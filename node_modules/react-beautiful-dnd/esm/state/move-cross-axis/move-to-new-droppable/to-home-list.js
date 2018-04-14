
import moveToEdge from '../../move-to-edge';
import getDisplacement from '../../get-displacement';
import withDroppableDisplacement from '../../with-droppable-displacement';


export default (function (_ref) {
  var amount = _ref.amount,
      originalIndex = _ref.originalIndex,
      target = _ref.target,
      insideDroppable = _ref.insideDroppable,
      draggable = _ref.draggable,
      droppable = _ref.droppable,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  if (!target) {
    console.error('there will always be a target in the original list');
    return null;
  }

  var axis = droppable.axis;
  var targetIndex = insideDroppable.indexOf(target);

  if (targetIndex === -1) {
    console.error('unable to find target in destination droppable');
    return null;
  }

  if (targetIndex === originalIndex) {
    var _newCenter = draggable.page.paddingBox.center;
    var _newImpact = {
      movement: {
        displaced: [],
        amount: amount,
        isBeyondStartPosition: false
      },
      direction: droppable.axis.direction,
      destination: {
        droppableId: droppable.descriptor.id,
        index: originalIndex
      }
    };

    return {
      pageCenter: withDroppableDisplacement(droppable, _newCenter),
      impact: _newImpact
    };
  }

  var isMovingPastOriginalIndex = targetIndex > originalIndex;
  var edge = isMovingPastOriginalIndex ? 'end' : 'start';

  var newCenter = moveToEdge({
    source: draggable.page.paddingBox,
    sourceEdge: edge,
    destination: isMovingPastOriginalIndex ? target.page.paddingBox : target.page.marginBox,
    destinationEdge: edge,
    destinationAxis: axis
  });

  var modified = function () {
    if (!isMovingPastOriginalIndex) {
      return insideDroppable.slice(targetIndex, originalIndex);
    }

    var from = originalIndex + 1;

    var to = targetIndex + 1;

    return insideDroppable.slice(from, to).reverse();
  }();

  var displaced = modified.map(function (dimension) {
    return getDisplacement({
      draggable: dimension,
      destination: droppable,
      previousImpact: previousImpact,
      viewport: viewport.subject
    });
  });

  var newImpact = {
    movement: {
      displaced: displaced,
      amount: amount,
      isBeyondStartPosition: isMovingPastOriginalIndex
    },
    direction: axis.direction,
    destination: {
      droppableId: droppable.descriptor.id,
      index: targetIndex
    }
  };

  return {
    pageCenter: withDroppableDisplacement(droppable, newCenter),
    impact: newImpact
  };
});