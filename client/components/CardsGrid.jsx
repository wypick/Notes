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
    return this.props.notes.map((note, index, sectionData) => (
      <CardsLayout
        columns={1}
        moveSubject={this.props.moveSubject}
        notes={this.props.notes}
        xPos={index + 1}
        key={index}
        onNoteDelete={this.props.onNoteDelete}/>
    ));
  }


render() {
      return (
        <div className='CardsGrid'>
          <CardsLayout
            columns={1}
            moveSubject={this.props.moveSubject}
            notes={this.props.notes}
            onNoteDelete={this.props.onNoteDelete}
          onCardAdd={this.props.onCardAdd}
        onNoteAdd={this.props.onNoteAdd}/>
      </div>
      );
}
}

export default DragDropContext(HTML5Backend)(CardsGrid);
