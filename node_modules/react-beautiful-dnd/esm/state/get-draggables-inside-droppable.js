import _Object$keys from 'babel-runtime/core-js/object/keys';

import memoizeOne from 'memoize-one';


export default memoizeOne(function (droppable, draggables) {
  return _Object$keys(draggables).map(function (id) {
    return draggables[id];
  }).filter(function (draggable) {
    return droppable.descriptor.id === draggable.descriptor.droppableId;
  }).sort(function (a, b) {
    return a.descriptor.index - b.descriptor.index;
  });
});