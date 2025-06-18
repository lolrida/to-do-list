const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'notes'
});

app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
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
