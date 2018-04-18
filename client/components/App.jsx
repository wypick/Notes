import React from 'react';

import './styles/App.less';

import NotesStore from '../stores/NotesStore';
import CardsStore from '../stores/CardsStore';
import NotesActions from '../actions/NotesActions';
import CardsActions from '../actions/CardsActions';

import CardCreator from './CardCreator.jsx';
import CardsGrid from './CardsGrid.jsx';

function getStateFromFlux() {
    return {
        isLoading: NotesStore.isLoading(),
        isLoading: CardsStore.isLoading(),
        notes: NotesStore.getNotes(),
        cards: CardsStore.getCards()
    };
}

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = getStateFromFlux();
    this._onChange = this._onChange.bind(this);
    this.moveSubject = this.moveSubject.bind(this);
    }

    moveSubject(movedSubjectId, newPosition) {
        this.setState({
          notes: this.state.notes.map(subject => {
            if (subject._id == movedSubjectId) {
              return {
                ...subject,
                card: newPosition.card,
                number: newPosition.number,
              }
            }
            return subject;
          }),
        });
      }

   componentWillMount() {
       NotesActions.loadNotes();
       CardsActions.loadCards();
   }

   componentDidMount() {
       NotesStore.addChangeListener(this._onChange);
       CardsStore.addChangeListener(this._onChange);
   }

   componentWillUnmount() {
       NotesStore.removeChangeListener(this._onChange);
       CardsStore.removeChangeListener(this._onChange);
   }

   handleNoteDelete(note) {
       NotesActions.deleteNote(note.id);
   }

   handleCardDelete(card) {
       CardsActions.deleteCard(card.id);
   }

   handleNoteAdd(noteData) {
       NotesActions.createNote(noteData);
   }

   handleCardAdd(cardData) {
       CardsActions.createCard(cardData);
   }


   /*  <NoteEditor onNoteAdd={this.handleNoteAdd} />
     <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete} />
     <CardsGrid />*/

render() {
  return (
    <div className='App'>
                <CardsGrid notes={this.state.notes} cards={this.state.cards} onNoteDelete={this.handleNoteDelete}
                  onCardDelete={this.handleCardDelete} moveSubject={this.moveSubject} onCardAdd={this.handleCardAdd}
                  onNoteAdd={this.handleNoteAdd}/>
            </div>
  );
}
_onChange() {
       this.setState(getStateFromFlux());
     }
}
export default App;
