import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    },
    text      : { type: String, required: true },
    color     : { type: String },
    createdAt : { type: Date },
    number: { type: String }
});

const Note = mongoose.model('Note', NoteSchema);
