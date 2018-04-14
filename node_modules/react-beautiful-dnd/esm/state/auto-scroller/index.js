
import createFluidScroller from './fluid-scroller';
import createJumpScroller from './jump-scroller';


export default (function (_ref) {
  var scrollDroppable = _ref.scrollDroppable,
      scrollWindow = _ref.scrollWindow,
      move = _ref.move;

  var fluidScroll = createFluidScroller({
    scrollWindow: scrollWindow,
    scrollDroppable: scrollDroppable
  });

  var jumpScroll = createJumpScroller({
    move: move,
    scrollWindow: scrollWindow,
    scrollDroppable: scrollDroppable
  });

  var onStateChange = function onStateChange(previous, current) {
    if (current.phase === 'DRAGGING') {
      if (!current.drag) {
        console.error('invalid drag state');
        return;
      }

      if (current.drag.initial.autoScrollMode === 'FLUID') {
        fluidScroll(current);
        return;
      }

      if (!current.drag.scrollJumpRequest) {
        return;
      }

      jumpScroll(current);
      return;
    }

    if (previous.phase === 'DRAGGING' && current.phase !== 'DRAGGING') {
      fluidScroll.cancel();
    }
  };

  var marshal = {
    onStateChange: onStateChange
  };

  return marshal;
});