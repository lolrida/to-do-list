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
  const res = await fetch('/notes');
  const notes = await res.json();
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = '';
  notes.forEach(note => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-3';
    col.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <p class="card-text" id="note-content-${note.id}">${note.content}</p>
          <button class="btn btn-warning btn-sm" onclick="showEditModal(${note.id}, '${note.content.replace(/'/g, "\\'")}')">Modifica</button>
        </div>
      </div>
    `;
    notesList.appendChild(col);
  });
}

// Aggiungi una nuova nota
document.getElementById('addNoteForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const content = document.getElementById('noteContent').value;
  const res = await fetch('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  if (res.ok) {
    document.getElementById('noteContent').value = '';
    loadNotes();
  }
});

// Mostra il modal di modifica
window.showEditModal = function(id, content) {
  document.getElementById('editNoteId').value = id;
  document.getElementById('editNoteContent').value = content;
  var editModal = new bootstrap.Modal(document.getElementById('editNoteModal'));
  editModal.show();
}

// Salva la modifica della nota
document.getElementById('editNoteForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('editNoteId').value;
  const content = document.getElementById('editNoteContent').value;
  const res = await fetch(`/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  if (res.ok) {
    var editModal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'));
    editModal.hide();
    loadNotes();
  }
});

// Carica le note all'avvio
window.onload = loadNotes;