
import memoizeOne from 'memoize-one';

export default memoizeOne(function (displaced) {
  return displaced.reduce(function (map, displacement) {
    map[displacement.draggableId] = displacement;
    return map;
  }, {});
});