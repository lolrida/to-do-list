const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));


function loadNotes() {
  try {
    return JSON.parse(fs.readFileSync('notes.json'));
  } catch {
    return [];
  }
}


function saveNotes(notes) {
  fs.writeFileSync('notes.json', JSON.stringify(notes));
}


app.get('/api/notes', (req, res) => {
  res.json(loadNotes());
});

app.post('/api/notes', (req, res) => {
  const notes = loadNotes();
  const { text, priority } = req.body;
  const newNote = {
    id: Date.now(),
    text,
    priority: priority || "Bassa"  
  };
  notes.push(newNote);
  saveNotes(notes);
  res.json(newNote);
});


app.delete('/api/notes/:id', (req, res) => {
  const notes = loadNotes().filter(note => note.id != req.params.id);
  saveNotes(notes);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



