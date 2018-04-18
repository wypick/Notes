import axios from 'axios';

import { apiPrefix } from '../../etc/config.json';

export default {
    listNotes() {
        return axios.get(`${apiPrefix}/notes`);
    },

    listCards() {
        return axios.get(`${apiPrefix}/cards`);
    },

    createNote(data) {
        return axios.post(`${apiPrefix}/notes`, data);
    },

    createCard(data) {
        return axios.post(`${apiPrefix}/cards`, data);
    },

    deleteNote(noteId) {
        return axios.delete(`${apiPrefix}/notes/${noteId}`);
    },

    deleteCard(cardId) {
        return axios.delete(`${apiPrefix}/cards/${cardId}`);
    }
}
