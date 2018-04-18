import React, { Component } from 'react';
import './styles/Card.less';

import Card from './Card.jsx';
import CardCreator from './CardCreator.jsx';
import NoteEditor from './NoteEditor.jsx';


class CardsLayout extends Component {

  getSectionData (x, y) {
      return this.props.notes.filter(subject => {
        console.log(y);
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
          onNoteAdd={this.props.onNoteAdd}
        />
    </div>
      );
    }
    render() {
    const { itemsInColumn } = this.props;

    return (
      <div>
          <div className='Card'>
            {Array.from({ length: this.props.columns }, (el, index) => this.generateSection(index + 1))}
          </div>
            <CardCreator onCardAdd={this.props.onCardAdd}/>
        </div>
    );
  }
}

export default CardsLayout;
