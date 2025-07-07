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


async function loadLists() {
  const res = await fetch('/lists');
  const lists = await res.json();
  const selector = document.getElementById('listContainer');
  selector.innerHTML = '';
  lists.forEach(list => {
    const option = document.createElement('option');
    option.value = list.id;
    option.textContent = list.name;
    selector.appendChild(option);
  });

  if (lists.length > 0) {
    loadNotes(lists[0].id);
  }
}


async function loadNotes(listId) {
  const res = await fetch(`/notes/${listId}`);
  const notes = await res.json();
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = '';
  notes.forEach(note => {
    const div = document.createElement('div');
    div.className = 'card mb-2 p-2';
    div.textContent = note.content;
    notesList.appendChild(div);
    console.log(notes);
  });
}


document.getElementById('listContainer').addEventListener('change', function() {
  const listId = this.value;
  loadNotes(listId);
});

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
    var editModal = boccccotstrap.Modal.getInstance(document.getElementById('editNoteModal'));
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

window.onload = loadLists;