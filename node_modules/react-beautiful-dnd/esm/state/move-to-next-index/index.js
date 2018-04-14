
import inHomeList from './in-home-list';
import inForeignList from './in-foreign-list';


export default (function (args) {
  var draggableId = args.draggableId,
      draggables = args.draggables,
      droppable = args.droppable;


  var draggable = draggables[draggableId];
  var isInHomeList = draggable.descriptor.droppableId === droppable.descriptor.id;

  if (!droppable.isEnabled) {
    return null;
  }

  if (isInHomeList) {
    return inHomeList(args);
  }

  return inForeignList(args);
});