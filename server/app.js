import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { serverPort } from '../etc/config.json';

import * as db from './utils/DataBaseUtils';

// Initialization of express application
const app = express();

// Set up connection of database
db.setUpConnection();

// Using bodyParser middleware
app.use( bodyParser.json() );

app.use(cors({ origin: '*' }));
// RESTful api handlers

app.get('/notes', (req, res) => {
    db.listNotes().then(data => res.send(data));
});

app.get('/cards', (req, res) => {
    db.listCards().then(data => res.send(data));
});

app.post('/notes', (req, res) => {
    db.createNote(req.body).then(data => res.send(data));
});

app.post('/cards', (req, res) => {
    db.createCard(req.body).then(data => res.send(data));
});

app.delete('/notes/:id', (req, res) => {
    db.deleteNote(req.params.id).then(data => res.send(data));
});

app.delete('/cards/:id', (req, res) => {
    db.deleteCard(req.params.id, req.body).then(data => res.send(data));
});

const server = app.listen(serverPort, function() {
    console.log(`Server is up and running on port ${serverPort}`);
});

app.patch('/notes/:id', (req, res) => {
    db.updateNote(req.params.id, req.body).then(data => res.send(data));
});

app.patch('/cards/:id', (req, res) => {
    db.updateCard(req.params.id, req.body).then(data => res.send(data));
});
