import React, { Component } from 'react';


import Card from './Card.jsx';
import CardCreator from './CardCreator.jsx';

import NoteEditor from './NoteEditor.jsx';


class CardsLayout extends Component {

  getSectionData (x, y) {
      return this.props.notes.filter(subject => {
        return subject.card == x && subject.number == y;

      });
    }

    generateSection (yPos){
      const { xPos } = this.props;
        console.log(xPos);
      const sectionData = this.getSectionData(xPos, yPos).slice(0, 2);
      return (
        <div>
        <Card
          key={`${yPos}_${xPos}`}
          yPos={yPos}
          xPos={xPos}
          sectionData={sectionData}
          moveSubject={this.props.moveSubject}
          onNoteDelete={this.props.onNoteDelete}
          notes={this.props.notes}
          cards={this.props.cards}
          onNoteAdd={this.props.onNoteAdd}
        />
    </div>
      );
    }

    printCards () {
     return this.props.cards.map((card, index) =>
      <td>
     <Card
       moveSubject={this.props.moveSubject}
       xPos={index + 1}
       key={index}
       notes={this.props.notes}
       name={card.name}
       card={card.id}
       cards={this.props.cards}
       onNoteDelete={this.props.onNoteDelete}
       onCardDelete={this.props.onCardDelete.bind(null, card)}
       onCardAdd={this.props.onCardAdd}
       onNoteAdd={this.props.onNoteAdd}
       onNoteEdit={this.props.onNoteEdit}/>
   </td>
       );
    }

    render() {
    const { itemsInColumn } = this.props;

    return (
      <div>
            {this.printCards()}
            <CardCreator onCardAdd={this.props.onCardAdd}/>
</div>
    );
  }
}

export default CardsLayout;
