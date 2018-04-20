import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/AppConstants';

import api from '../api';

const CardActions = {
    loadCards() {
        AppDispatcher.dispatch({
            type: Constants.LOAD_CARDS_REQUEST
        });

        api.listCards()
        .then(({ data }) =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_CARDS_SUCCESS,
                cards: data
            })
        )
        .catch(err =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_CARDS_FAIL,
                error: err
            })
        );
    },

    createCard(card) {
        api.createCard(card)
        .then(() =>
            this.loadCards()
        )
        .catch(err =>
            console.error(err)
        );
    },

    deleteCard(cardId) {
        api.deleteCard(cardId)
        .then(() =>
            this.loadCards()
        )
        .catch(err =>
            console.error(err)
        );
    },

    updateCard(cardId, card) {
        api.updateCard(cardId, card)
        .then(() =>
            this.loadCards()
        )
        .catch(err =>
            console.error(err)
        );
    }
};

export default CardActions;
