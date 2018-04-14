
import memoizeOne from 'memoize-one';
import rafSchd from 'raf-schd';


export default (function (callbacks) {
  var memoizedMove = memoizeOne(function (x, y) {
    var point = { x: x, y: y };
    callbacks.onMove(point);
  });

  var move = rafSchd(function (point) {
    return memoizedMove(point.x, point.y);
  });
  var moveForward = rafSchd(callbacks.onMoveForward);
  var moveBackward = rafSchd(callbacks.onMoveBackward);
  var crossAxisMoveForward = rafSchd(callbacks.onCrossAxisMoveForward);
  var crossAxisMoveBackward = rafSchd(callbacks.onCrossAxisMoveBackward);
  var windowScrollMove = rafSchd(callbacks.onWindowScroll);

  var cancel = function cancel() {

    move.cancel();
    moveForward.cancel();
    moveBackward.cancel();
    crossAxisMoveForward.cancel();
    crossAxisMoveBackward.cancel();
    windowScrollMove.cancel();
  };

  return {
    move: move,
    moveForward: moveForward,
    moveBackward: moveBackward,
    crossAxisMoveForward: crossAxisMoveForward,
    crossAxisMoveBackward: crossAxisMoveBackward,
    windowScrollMove: windowScrollMove,
    cancel: cancel
  };
});