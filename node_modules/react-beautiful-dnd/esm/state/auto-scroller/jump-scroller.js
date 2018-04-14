
import { add, subtract } from '../position';
import { canScrollDroppable, canScrollWindow, getWindowOverlap, getDroppableOverlap } from './can-scroll';


export default (function (_ref) {
  var move = _ref.move,
      scrollDroppable = _ref.scrollDroppable,
      scrollWindow = _ref.scrollWindow;

  var moveByOffset = function moveByOffset(state, offset) {
    var drag = state.drag;
    if (!drag) {
      console.error('Cannot move by offset when not dragging');
      return;
    }

    var client = add(drag.current.client.selection, offset);
    move(drag.initial.descriptor.id, client, drag.current.viewport, true);
  };

  var scrollDroppableAsMuchAsItCan = function scrollDroppableAsMuchAsItCan(droppable, change) {
    if (!canScrollDroppable(droppable, change)) {
      return change;
    }

    var overlap = getDroppableOverlap(droppable, change);

    if (!overlap) {
      scrollDroppable(droppable.descriptor.id, change);
      return null;
    }

    var whatTheDroppableCanScroll = subtract(change, overlap);
    scrollDroppable(droppable.descriptor.id, whatTheDroppableCanScroll);

    var remainder = subtract(change, whatTheDroppableCanScroll);
    return remainder;
  };

  var scrollWindowAsMuchAsItCan = function scrollWindowAsMuchAsItCan(viewport, change) {
    if (!canScrollWindow(viewport, change)) {
      return change;
    }

    var overlap = getWindowOverlap(viewport, change);

    if (!overlap) {
      scrollWindow(change);
      return null;
    }

    var whatTheWindowCanScroll = subtract(change, overlap);
    scrollWindow(whatTheWindowCanScroll);

    var remainder = subtract(change, whatTheWindowCanScroll);
    return remainder;
  };

  var jumpScroller = function jumpScroller(state) {
    var drag = state.drag;

    if (!drag) {
      return;
    }

    var request = drag.scrollJumpRequest;

    if (!request) {
      return;
    }

    var destination = drag.impact.destination;

    if (!destination) {
      console.error('Cannot perform a jump scroll when there is no destination');
      return;
    }

    var droppableRemainder = scrollDroppableAsMuchAsItCan(state.dimension.droppable[destination.droppableId], request);

    if (!droppableRemainder) {
      return;
    }

    var viewport = drag.current.viewport;
    var windowRemainder = scrollWindowAsMuchAsItCan(viewport, droppableRemainder);

    if (!windowRemainder) {
      return;
    }

    moveByOffset(state, windowRemainder);
  };

  return jumpScroller;
});