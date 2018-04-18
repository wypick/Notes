import React from 'react';
import CardsLayout from './CardsLayout.jsx';

import './styles/CardsGrid.less';

import propTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class CardsGrid extends React.Component {


/*  printColumns () {
    this.props.notes.map((note, index, sectionData) => {
      if(2>1){
      return(
      <CardsLayout
        columns={1}
        moveSubject={this.props.moveSubject}
        notes={this.props.notes}
        xPos={index + 1}
        key={index}
        onNoteDelete={this.props.onNoteDelete}/>
    );}
    else {
      return(
      <CardsLayout
        columns={1}
        moveSubject={this.props.moveSubject}
        notes={this.props.notes}
        xPos={index + 1}
        key={index}
        onNoteDelete={this.props.onNoteDelete}/>
    );
    }
  })
return <h1>rgvw</h1>
}*/
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
/*
printColumns() {
   return Array.from({ length: this.props.cards.length }, (el, index) => (
     <CardsLayout
       moveSubject={this.props.moveSubject}
       subjectsArray={this.props.subjectsArray}
       xPos={index + 1}
       key={index}
       notes={this.props.notes}
       cards={this.props.cards}
       onNoteDelete={this.props.onNoteDelete}
       onCardAdd={this.props.onCardAdd}
       onNoteAdd={this.props.onNoteAdd}/>
   ));
 }*/


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
            onNoteAdd={this.props.onNoteAdd}/>
    </div>
      );
}
}

export default DragDropContext(HTML5Backend)(CardsGrid);
