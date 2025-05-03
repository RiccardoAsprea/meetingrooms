// Controlla autenticazione
requireAuth();

let rooms = [];

// Inizializza pagina
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Carica stanze
        rooms = await api.getAllRooms();
        displayRooms(rooms);

        // Eventi
        document.getElementById('addRoomBtn').addEventListener('click', () => showRoomForm());
        document.getElementById('roomForm').addEventListener('submit', saveRoom);
        document.getElementById('cancelBtn').addEventListener('click', hideRoomForm);
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    } catch (error) {
        console.error('Error loading rooms:', error);
        alert('Errore durante la richiesta dei dati relativi alle stanze.');
    }
});

// Mostra stanze nella tabella
function displayRooms(rooms) {
    const tbody = document.getElementById('roomsTableBody');
    tbody.innerHTML = '';

    rooms.forEach(room => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${room.roomName}</td>
            <td>${room.seatingCapacity}</td>
            <td>
                <button onclick="editRoom(${room.roomId})">Modifica</button>
                <button onclick="deleteRoom(${room.roomId})">Elimina</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Mostra form stanza
function showRoomForm(roomId = null) {
    const modal = document.getElementById('roomFormModal');
    const form = document.getElementById('roomForm');
    const modalTitle = document.getElementById('modalTitle');

    if (roomId) {
        // Carica dati stanza per modifica
        const room = rooms.find(r => r.roomId === roomId);
        if (room) {
            document.getElementById('roomId').value = room.roomId;
            document.getElementById('roomName').value = room.roomName;
            document.getElementById('seatingCapacity').value = room.seatingCapacity;
            modalTitle.textContent = 'Modifica Stanza';
        }
    } else {
        form.reset();
        document.getElementById('roomId').value = '';
        modalTitle.textContent = 'Nuova Stanza';
    }

    modal.style.display = 'block';
}

// Chiudi form stanza
function hideRoomForm() {
    document.getElementById('roomFormModal').style.display = 'none';
}

// Salva stanza
async function saveRoom(e) {
    e.preventDefault();

    const roomId = document.getElementById('roomId').value;
    const roomData = {
        roomName: document.getElementById('roomName').value,
        seatingCapacity: parseInt(document.getElementById('seatingCapacity').value)
    };

    if (roomId) {
        // Aggiorna stanza esistente
        roomData.roomId = parseInt(roomId);
        await api.updateRoom(roomData);
    } else {
        // Crea nuova stanza
        await api.createRoom(roomData);
    }

    // Aggiorna elenco stanze
    rooms = await api.getAllRooms();
    displayRooms(rooms);

    hideRoomForm();
}

// Modifica stanza
function editRoom(id) {
    showRoomForm(id);
}

// Elimina stanza
async function deleteRoom(id) {
    if (confirm('Sei sicuro di voler eliminare questa stanza?')) {
        const deleteRoomData = {"roomId": id};
        await api.deleteRoom(deleteRoomData);

        // Aggiorna elenco stanze
        rooms = await api.getAllRooms();
        displayRooms(rooms);
    }
}

// Gestione logout
function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    window.location.href = 'index.html';
}