import './styles/Note.less';
import { DragSource } from 'react-dnd';
import React, { Component, PropTypes } from 'react';

const subjectSource = {
beginDrag(props, monitor, component) {
  return props;
},
endDrag(props, monitor, component) {

  if (!monitor.didDrop()) {
    return;
  }
  const item = monitor.getItem();
  const dropResult = monitor.getDropResult();

  props.moveSubject(item.props.id, {
      card: dropResult.xPos,
      number: dropResult.yPos,
    });
},
};

function collect(connect, monitor) {
return {
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  connectDragPreview: connect.dragPreview(),
};
}

class Note extends React.Component{

  onTooltipClick(event) {
    event.preventDefault();
    return false;
  }

render() {
  const { connectDragSource, isDragging, index, data} = this.props;
  const style = { backgroundColor: this.props.color };

        return connectDragSource(
            <div className='Note' style={style}  onClick={this.onTooltipClick}>
                <span className='Note__del-icon' onClick={this.props.onDelete}> × </span>
                {
                    this.props.title
                    ?
                    <div>
                        <h4 className='Note__title'>{this.props.title}</h4>
                    </div>
                    :
                        null
                }
                <div className='Note__text'>{this.props.children}</div>
            </div>
          );
}
}

export default DragSource('note', subjectSource, collect)(Note);
