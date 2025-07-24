const express = require('express');
const axios = require('axios'); // Usa axios per chiamare il backend
const app = express();

app.use(express.json());
app.use(express.static('public'));

const BACKEND_URL = 'http://localhost:8000/api'; // Laravel backend

// 🔄 Ottieni tutti i task
app.get('/notes', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/tasks`);
    res.json(response.data);
  } catch (error) {
    console.error("Errore backend:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ➕ Crea un nuovo task
app.post('/notes', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Il contenuto è obbligatorio' });

  try {
    const response = await axios.post(`${BACKEND_URL}/tasks`, {
      title: content
    });
    res.status(201).json({ id: response.data.id, content: response.data.title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✏️ Modifica task
app.put('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Il contenuto è obbligatorio' });

  try {
    await axios.put(`${BACKEND_URL}/tasks/${id}`, {
      title: content,
      completed: false // o true, se necessario
    });
    res.json({ id, content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// elimina nota
app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await axios.delete(`${BACKEND_URL}/tasks/${id}`);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Gestione liste (non ancora gestite dal backend Laravel) ---
app.post('/lists', (req, res) => {
  res.status(501).json({ error: 'Funzionalità non ancora supportata via API' });
});

app.get('/lists', (req, res) => {
  res.status(501).json({ error: 'Funzionalità non ancora supportata via API' });
});

app.get('/notes/:listId', (req, res) => {
  res.status(501).json({ error: 'Filtraggio per lista non ancora supportato via API' });
});


app.listen(3000, () => {
  console.log('Frontend disponibile su http://localhost:3000');
});
