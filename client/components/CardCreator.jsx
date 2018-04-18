import React from 'react';

import './styles/CardCreator.less';

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
                    placeholder='Enter card name'
                    rows={5}
                    className='CardEditor__text'
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
              <div className='CardEditor__footer'>
                    <button
                      className='CardEditor__button'
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
