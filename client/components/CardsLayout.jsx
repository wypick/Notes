import React, { Component } from 'react';

import Card from './Card.jsx';

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
        />
    </div>
      );
    }
    render() {
    const { itemsInColumn } = this.props;

    return (
          <div className="sections">
            {Array.from({ length: this.props.columns }, (el, index) => this.generateSection(index + 1))}
          </div>
    );
  }
}

export default CardsLayout;
