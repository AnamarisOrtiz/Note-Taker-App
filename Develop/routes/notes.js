const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');

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


module.exports = router;
