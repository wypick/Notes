import mongoose from "mongoose";

import config from '../../etc/config.json';

import '../models/Note';
import '../models/Card';

const Note = mongoose.model('Note');
const Card = mongoose.model('Card');

export function setUpConnection() {
    mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`);
}

export function listNotes(id) {
    return Note.find();
}
export function listCards(id) {
    return Card.find();
}
var pos = 0;

export function createNote(data) {
    const note = new Note({
        text: data.text,
        color: data.color,
        createdAt: new Date(),
        number: pos
    });
    pos++;
    return note.save();
}

export function createCard(data) {
    const card = new Card({
        name: data.text,
        createdAt: new Date(),
    });
    return card.save();
}

export function deleteNote(id) {
    return Note.findById(id).remove();
}

/*export function updateNote(id) {
    return Note.findById(id).findByIdAndUpdate();
}*/
