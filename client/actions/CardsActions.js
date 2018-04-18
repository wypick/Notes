import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/AppConstants';

import api from '../api';

const CardActions = {
    loadNotes() {
        AppDispatcher.dispatch({
            type: Constants.LOAD_NOTES_REQUEST
        });

        api.listNotes()
        .then(({ data }) =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_NOTES_SUCCESS,
                notes: data
            })
        )
        .catch(err =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_NOTES_FAIL,
                error: err
            })
        );
    },

    createCard(card) {
        api.createCard(card)
        .then(() =>
            this.loadNotes()
        )
        .catch(err =>
            console.error(err)
        );
    },
};

export default CardActions;
