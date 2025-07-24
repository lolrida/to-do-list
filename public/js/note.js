let currentListId = null;

async function addNote() {
  // Questa funzione non viene più usata, rimossa per pulizia
}

async function loadLists() {
  try {
    const res = await fetch('/lists');
    if (!res.ok) throw new Error('Errore nel caricamento delle liste');
    
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
      currentListId = lists[0].id;
      loadNotes(currentListId);
    }
  } catch (error) {
    console.error('Errore nel caricamento delle liste:', error);
  }
}

async function loadNotes(listId) {
  if (!listId) return;
  
  try {
    const res = await fetch(`/tasks?list_id=${listId}`);
    if (!res.ok) throw new Error('Errore nel caricamento delle note');
    
    const notes = await res.json();
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    
    notes.forEach(note => {
      const div = document.createElement('div');
      div.className = 'col-md-6 col-lg-4 mb-3';
      div.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <p class="card-text">${note.title}</p>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" ${note.completed ? 'checked' : ''} 
                     onchange="toggleTask(${note.id})">
              <label class="form-check-label">
                ${note.completed ? 'Completata' : 'Da fare'}
              </label>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-sm btn-outline-primary" onclick="showEditModal(${note.id}, '${note.title}')">
              Modifica
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteNote(${note.id})">
              Elimina
            </button>
          </div>
        </div>
      `;
      notesList.appendChild(div);
    });
  } catch (error) {
    console.error('Errore nel caricamento delle note:', error);
  }
}

document.getElementById('listContainer').addEventListener('change', function() {
  currentListId = this.value;
  loadNotes(currentListId);
});

document.getElementById('addNoteForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const title = document.getElementById('noteContent').value.trim();
  
  if (!title || !currentListId) {
    alert('Inserisci un titolo e seleziona una lista!');
    return;
  }

  try {
    const res = await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title: title,
        list_id: currentListId,
        completed: false
      })
    });

    if (res.ok) {
      document.getElementById('noteContent').value = '';
      loadNotes(currentListId);
    } else {
      const error = await res.json();
      console.error('Errore nel salvataggio:', error);
      alert('Errore nel salvataggio della nota');
    }
  } catch (error) {
    console.error('Errore di rete:', error);
    alert('Errore di connessione');
  }
});

// Funzione per cambiare lo stato di completamento
window.toggleTask = async function(id) {
  try {
    const res = await fetch(`/tasks/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (res.ok) {
      loadNotes(currentListId);
    }
  } catch (error) {
    console.error('Errore nel toggle:', error);
  }
};

window.showEditModal = function(id, title) {
  document.getElementById('editNoteId').value = id;
  document.getElementById('editNoteContent').value = title;
  var editModal = new bootstrap.Modal(document.getElementById('editNoteModal'));
  editModal.show();
}

document.getElementById('editNoteForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('editNoteId').value;
  const title = document.getElementById('editNoteContent').value;
  
  try {
    const res = await fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title })
    });
    
    if (res.ok) {
      var editModal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'));
      editModal.hide();
      loadNotes(currentListId);
    }
  } catch (error) {
    console.error('Errore nella modifica:', error);
  }
});

window.deleteNote = async function(id) {
  if (!confirm('Sei sicuro di voler eliminare questa nota?')) return;

  try {
    const res = await fetch(`/tasks/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      loadNotes(currentListId);
    } else {
      console.error("Errore nell'eliminazione della nota.");
    }
  } catch (error) {
    console.error('Errore di rete:', error);
  }
};

// Funzione per creare una nuova lista
window.createNewList = async function() {
  const name = prompt('Nome della nuova lista:');
  if (!name) return;

  try {
    const res = await fetch('/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name })
    });

    if (res.ok) {
      loadLists(); // Ricarica le liste
    }
  } catch (error) {
    console.error('Errore nella creazione della lista:', error);
  }
};

window.onload = loadLists;