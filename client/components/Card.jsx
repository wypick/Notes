import React from 'react';
import { DropTarget } from 'react-dnd';

import NoteEditor from './NoteEditor.jsx';
import './styles/Note.less';
import Note from './Note.jsx';
import './styles/Card.less';

import propTypes from 'prop-types';

const SubjectSectionTarget = {
  drop(props) {
    return props;
  },
  canDrop(props) {
    return props.sectionData.length <= 1;
  }
};

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

class Card extends React.Component {
  constructor(props){
    super(props);
    this.state = {checked: false, edit: false, txt: this.props.name};
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.update = this.update.bind(this);
    this.abc = this.abc.bind(this);
    this.pos = 0;
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
      const editCard = {
          name: this.state.txt,
      };
      this.props.onEdit(this.props.card, editCard);
    }

    update(e){
      this.setState({
        txt: e.target.value
      })
      render();
    }

    change() {
      return (
        <div className='Card' onClick={this.onTooltipClick}>
        <input type='text' defaultValue={this.state.txt} onChange = {this.update}/>
        <button onClick={this.save}>Save</button>
          {this.printNotes()}
           <NoteEditor onNoteAdd={this.props.onNoteAdd} card={this.props.card}/>
        </div>
      );
    }

    original(){
      const { connectDropTarget, isOver, xPos, yPos, card } = this.props;
          return connectDropTarget(
              <div className='Card'>
                  <h1>{this.props.name}
                    <button onClick={this.props.onCardDelete}> × </button>
                    <button onClick={this.edit}> ✏  </button>
                  </h1>
                  {this.printNotes()}
                   <NoteEditor onNoteAdd={this.props.onNoteAdd} number={this.pos} card={this.props.card}/>
              </div>
          );
    }

  abc(note, index, sectionData){
    if (this.props.card==note.card){
      this.pos = note.number;
      this.pos++;
            console.log(this.pos);
      return (
        <Note
            key={note.id}
            id={note.id}
            moveSubject={this.props.moveSubject}
            text={note.text}
            onDelete={this.props.onNoteDelete.bind(null, note)}
            onEdit={this.props.onNoteEdit}
            color={note.color}
            index={index}
            sectionData={sectionData}
        />
      );
    }
  }

  printNotes () {
   return this.props.notes.map((note, index, sectionData) =>
         <tr>
           {this.abc(note, index, sectionData)}
       </tr>
     );
 }

render() {
  const { connectDropTarget, isOver, xPos, yPos, card } = this.props;
  if (this.state.edit){
    return this.change();
  }
  else {
    return this.original();
  }
}
}

export default DropTarget('note', SubjectSectionTarget, collect)(Card);
