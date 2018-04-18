import React from 'react';

class CardCreator extends React.Component {
  constructor(props){
    super(props);
    this.state = {title: '', text: '', color: '#FFFFFF'};
      this.handleCardAdd = this.handleCardAdd.bind(this);
      this.handleTextChange = this.handleTextChange.bind(this);
      this.handleTitleChange = this.handleTitleChange.bind(this);
    }

    handleTextChange(event) {
        this.setState({ text: event.target.value });
    }

    handleTitleChange(event) {
        this.setState({ title: event.target.value });
    }

    handleCardAdd() {
        const newCard = {
            title: this.state.title,
            text: this.state.text,
        };

        this.props.onCardAdd(newCard);
        this.setState({ text: '', title: ''});
    }

    render() {
        return (
            <div className='CardCreator'>
                <textarea
                    placeholder='Enter card text'
                    rows={5}
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <div className='NoteEditor__footer'>
                    <button
                        disabled={!this.state.text}
                        onClick={this.handleCardAdd}
                    >
                        Add Card
                    </button>
                </div>
            </div>
        );
    }
}

export default CardCreator;
