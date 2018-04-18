import React from 'react';

import './styles/NoteEditor.less';

class NoteEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {text: '', card: this.props.card};
      this.handleNoteAdd = this.handleNoteAdd.bind(this);
      this.handleTextChange = this.handleTextChange.bind(this);
      this.handleTitleChange = this.handleTitleChange.bind(this);
    }

    handleTextChange(event) {
        this.setState({ text: event.target.value });
    }

    handleTitleChange(event) {
        this.setState({ title: event.target.value });
    }

    handleNoteAdd() {
        const newNote = {
            text: this.state.text,
            card: this.state.card
        };
        this.props.onNoteAdd(newNote);
        this.setState({ text: '', title: ''});
    }

    render() {
        return (
            <div className='NoteEditor'>
                <textarea
                    placeholder='Enter note text'
                    rows={5}
                    className='NoteEditor__text'
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <div className='NoteEditor__footer'>
                    <button
                        className='NoteEditor__button'
                        disabled={!this.state.text}
                        onClick={this.handleNoteAdd}
                    >
                        Add
                    </button>
                </div>
            </div>
        );
    }
}

export default NoteEditor;
