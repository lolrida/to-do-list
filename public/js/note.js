async function addNote() {
  const input = document.getElementById('noteInput');
  const priorityInput = document.getElementById('priorityInput');
  const text = input.value.trim();
  const priority = priorityInput.value;

  if (!text) return;

  await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, priority })
  });

  input.value = '';
  loadNotes();
}

async function loadNotes() {
  const res = await fetch('/api/notes');
  const notes = await res.json();
  const list = document.getElementById('noteList');
  list.innerHTML = '';

  // Ordina per priorità (Alta > Media > Bassa)
  const priorityOrder = { "Alta": 0, "Media": 1, "Bassa": 2 };
  notes.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  notes.forEach(note => {
    const li = document.createElement('li');
    li.textContent = `[${note.priority}] ${note.text}`;
    li.onclick = () => deleteNote(note.id);
    list.appendChild(li);
  });
}

async function deleteNote(id) {
  await fetch(`/api/notes/${id}`, { method: 'DELETE' });
  loadNotes();
}

// Carica le note all'avvio
window.onload = loadNotes;