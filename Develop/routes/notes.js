const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');

router.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

router.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuidv4(),
      };
  
      readAndAppend(newNote, './db/db.json',
        () => {
            const response = {
                status: 'success',
                body: newNote,
              };
          
              res.json(response.body);
        },
        () => {
            res.json('Error in posting note');
        });
  
     
    } else {
      res.json('Error in posting note');
    }
});

router.delete(`/api/notes/:id`, (req, res) => {
    const noteId = req.params.id;
    console.log("req params", req.params.id)
    readFromFile('./db/db.json')
      .then((data) => {
        const notes = JSON.parse(data);
        const filteredNotes = notes.filter((note) => note.id !== noteId);
  
        return writeToFile('./db/db.json', filteredNotes);
      })
      .then(() => res.json({ message: `Note ${noteId} deleted` }))
      .catch((err) => res.status(500).json({ error: err.message }));
  });


module.exports = router;
