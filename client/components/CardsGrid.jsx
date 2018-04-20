import React from 'react';
import CardsLayout from './CardsLayout.jsx';

import './styles/CardsGrid.less';

import propTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class CardsGrid extends React.Component {

printColumns () {
 return this.props.notes.map((card, note, index) =>
 <CardsLayout
   moveSubject={this.props.moveSubject}
   xPos={index + 1}
   key={index}
   notes={this.props.notes}
   cards={this.props.cards}
   onNoteDelete={this.props.onNoteDelete}
   onCardAdd={this.props.onCardAdd}
   onNoteAdd={this.props.onNoteAdd}/>
   );
}


render() {
      return (
        <div className='CardsGrid'>
          <CardsLayout
            moveSubject={this.props.moveSubject}
            notes={this.props.notes}
            cards={this.props.cards}
            onNoteDelete={this.props.onNoteDelete}
            onCardDelete={this.props.onCardDelete}
            onCardAdd={this.props.onCardAdd}
            onNoteAdd={this.props.onNoteAdd}
            onNoteEdit={this.props.onNoteEdit}
            onCardEdit={this.props.onCardEdit}/>
    </div>
      );
}
}

export default DragDropContext(HTML5Backend)(CardsGrid);
