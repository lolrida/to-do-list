async function addNote() {
  const input = document.getElementById('noteInput');
  const priorityInput = document.getElementById('priorityInput');
  const text = input.value.trim();
  const priority = priorityInput.value;

  if (!text) return;

  await fetch('/notes', {
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
        <div class="d-flex justify-content-between">
          <button class="btn btn-warning btn-sm" onclick="showEditModal(${note.id}, '${note.content.replace(/'/g, "\\'")}')">Modifica</button>
          <button class="btn btn-danger btn-sm" onclick="deleteNote(${note.id})">Elimina</button>
        </div>
      </div>
    </div>
  `;

    notesList.appendChild(col);
  });
}

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


window.showEditModal = function(id, content) {
  document.getElementById('editNoteId').value = id;
  document.getElementById('editNoteContent').value = content;
  var editModal = new bootstrap.Modal(document.getElementById('editNoteModal'));
  editModal.show();
}


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

window.deleteNote = async function(id) {
  if (!confirm('Sei sicuro di voler eliminare questa nota?')) return;

  const res = await fetch(`/notes/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    loadNotes();
  } else {
    console.error("Errore nella cancellazione della nota.");
  }
};

let currentListId = null;

async function loadLists() {
  const res = await fetch('/lists');
  const lists = await res.json();
  const selector = document.getElementById('listSelector');
  selector.innerHTML = '';
  lists.forEach(list => {
    const option = document.createElement('option');
    option.value = list.id;
    option.textContent = list.name;
    selector.appendChild(option);
  });

  
  if (lists.length > 0) {
    currentListId = lists[0].id;
    selector.value = currentListId;
    loadNotes();
  }
}

document.getElementById('listSelector').addEventListener('change', function() {
  currentListId = this.value;
  loadNotes();
});

async function createNewList() {
  const name = prompt('Nome della nuova lista:');
  if (!name) return;
  await fetch('/lists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  await loadLists();
}

async function loadLists() {
  const res = await fetch('/lists');
  const lists = await res.json();

  const container = document.getElementById('listsContainer');
  container.innerHTML = '';

  for (const list of lists) {
    const notesRes = await fetch(`/notes/${list.id}`);
    const notes = await notesRes.json();

    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.innerHTML = `
      <div class="card mb-4 shadow-sm">
        <div class="card-header bg-secondary text-white fw-bold">${list.name}</div>
        <div class="card-body p-2" id="list-${list.id}">
          ${notes.map(note => `
            <div class="card mb-2 shadow-sm">
              <div class="card-body p-2">
                <p class="mb-1">${note.content}</p>
                <div class="d-flex justify-content-between">
                  <button class="btn btn-sm btn-warning" onclick="showEditModal(${note.id}, '${note.content.replace(/'/g, "\\'")}')">Modifica</button>
                  <button class="btn btn-sm btn-danger" onclick="deleteNote(${note.id})">Elimina</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    container.appendChild(col);
  }
}


window.onload = () => {
  loadLists();
};





window.onload = loadNotes;