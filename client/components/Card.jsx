import React from 'react';
import { DropTarget } from 'react-dnd';

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

  printNotes () {
   return this.props.notes.map((note, index, sectionData) =>
         <tr>
         <Note
             key={note._id}
            moveSubject={this.props.moveSubject}
             title={note.title}
             onDelete={this.props.onNoteDelete.bind(null, note)}
             color={note.color}
             index={index}
             sectionData={sectionData}
         >
             {note.text}
         </Note>
       </tr>
     );
 }

render() {
  const { connectDropTarget, isOver, xPos, yPos } = this.props;
      return connectDropTarget(
          <div className='Card'>
              <h1>Card</h1>
              {this.printNotes()}
          </div>
      );
}
}

export default DropTarget('note', SubjectSectionTarget, collect)(Card);
