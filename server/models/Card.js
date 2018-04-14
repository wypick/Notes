import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CardsSchema = new Schema({
    name      : { type: String, required: true },
    createdAt : { type: Date },
});

const Card = mongoose.model('Card', CardsSchema);
