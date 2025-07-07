const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'todouser',
  password: 'todo',
  database: 'todolist'
});

app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes', (err, results) => {
    if (err) {
      console.error("Errore MySQL:", err); // AGGIUNGI QUESTO
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


app.post('/notes', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Il contenuto è obbligatorio' });
  db.query('INSERT INTO notes (content) VALUES (?)', [content], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, content });
  });
});

app.listen(3000, () => {
  console.log('Server avviato su http://localhost:3000');
});

app.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Il contenuto è obbligatorio' });

  db.query('UPDATE notes SET content = ? WHERE id = ?', [content, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, content });
  });
});

app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM notes WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error("Errore eliminazione:", err);
      return res.status(500).json({ error: err.message });
    }
    res.sendStatus(204);
  });
});

app.post('/lists', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Il nome della lista è obbligatorio' });

  db.query('INSERT INTO lists (name) VALUES (?)', [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, name });
  });
});

app.get('/lists', (req, res) => {
  db.query('SELECT * FROM lists', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/notes/:listId', (req, res) => {
  const { listId } = req.params;
  db.query('SELECT * FROM notes WHERE list_id = ?', [listId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/notes', (req, res) => {
  const { content, list_id } = req.body;
  if (!content || !list_id) return res.status(400).json({ error: 'Contenuto e list_id obbligatori' });

  db.query('INSERT INTO notes (content, list_id) VALUES (?, ?)', [content, list_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, content, list_id });
  });
});

app.get('/lists', (req, res) => {
  db.query('SELECT * FROM lists', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});





