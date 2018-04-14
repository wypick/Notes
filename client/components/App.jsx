import React from 'react';

import './styles/App.less';

import NotesStore from '../stores/NotesStore';
import NotesActions from '../actions/NotesActions';

import NoteEditor from './NoteEditor.jsx';
import CardsGrid from './CardsGrid.jsx';

function getStateFromFlux() {
    return {
        isLoading: NotesStore.isLoading(),
        notes: NotesStore.getNotes()
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
   }

   componentDidMount() {
       NotesStore.addChangeListener(this._onChange);
   }

   componentWillUnmount() {
       NotesStore.removeChangeListener(this._onChange);
   }

   handleNoteDelete(note) {
       NotesActions.deleteNote(note.id);
   }

   handleNoteAdd(noteData) {
       NotesActions.createNote(noteData);
   }


   /*  <NoteEditor onNoteAdd={this.handleNoteAdd} />
     <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete} />
     <CardsGrid />*/

render() {
  return (
    <div className='App'>
                <CardsGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete}
                  moveSubject={this.moveSubject}/>
              <NoteEditor onNoteAdd={this.handleNoteAdd}/>
            </div>
  );
}
_onChange() {
       this.setState(getStateFromFlux());
     }
}
export default App;
