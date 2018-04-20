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
  constructor(props){
    super(props);
    this.state = {checked: false, edit: false, txt: this.props.text};
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.update = this.update.bind(this);
    }

  edit() {
    this.setState({
      edit: true
    });
  }

  save(){
    this.setState({
      edit: false
    });
    const editNote = {
        text: this.state.txt,
    };
    this.props.onEdit(this.props.id, editNote);
  }

  onTooltipClick(event) {
    event.preventDefault();
    return false;
  }

  update(e){
    this.setState({
      txt: e.target.value
    })
    render();
  }

  change() {
    return (
      <div className='Note' onClick={this.onTooltipClick}>
      <input type='text' defaultValue={this.state.txt} onChange = {this.update}/>
      <button onClick={this.save}>Save</button>
      </div>
    );
  }

  original(){
    const { connectDragSource, isDragging, index, data} = this.props;
    return connectDragSource(
        <div className='Note' onClick={this.onTooltipClick}>
            <span className='Note__del-icon' onClick={this.props.onDelete}> × </span>
          <span className='Note__del-icon' onClick={this.edit} > ✏ </span>
                <div>
                    <p className='Note__title'>{this.state.txt}</p>
                </div>
            <div className='Note__text'>{this.props.children}</div>
        </div>
      );
  }

render() {
  const { connectDragSource, isDragging, index, data} = this.props;
  if (this.state.edit){
    return this.change();
  }
  else {
    return this.original();
  }
}
}

export default DragSource('note', subjectSource, collect)(Note);
