
import { absolute, add, patch, subtract } from './position';


export default (function (_ref) {
  var source = _ref.source,
      sourceEdge = _ref.sourceEdge,
      destination = _ref.destination,
      destinationEdge = _ref.destinationEdge,
      destinationAxis = _ref.destinationAxis;

  var getCorner = function getCorner(area) {
    return patch(destinationAxis.line, area[destinationAxis[destinationEdge]], area[destinationAxis.crossAxisStart]);
  };

  var corner = getCorner(destination);

  var centerDiff = absolute(subtract(source.center, getCorner(source)));

  var signed = patch(destinationAxis.line, (sourceEdge === 'end' ? -1 : 1) * centerDiff[destinationAxis.line], centerDiff[destinationAxis.crossAxisLine]);

  return add(corner, signed);
});