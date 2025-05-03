// Verifica autenticazione
requireAuth();

// Inizializza il calendario
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Carica le stanze
        const rooms = await api.getAllRooms();
        const roomSelect = document.getElementById('roomSelect');

        // Pulisce le opzioni esistenti
        roomSelect.innerHTML = '';

        // Aggiungi le stanze al dropdown
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.roomId;
            option.textContent = room.roomName;
            roomSelect.appendChild(option);
        });

        // Carica le riunioni per la prima stanza
        const firstRoom = rooms[0];
        if (firstRoom) {
            const meetings = await api.getRoomMeetings(firstRoom.roomId);
            initializeCalendar(meetings);
        }

        // Gestisci il cambio della stanza selezionata
        roomSelect.addEventListener('change', async function(e) {
            const selectedRoom = e.target.value;
            console.log(selectedRoom)
            const meetings = await api.getRoomMeetings(selectedRoom);
            updateCalendar(meetings);
        });
    } catch (error) {
        console.error('Errore nel caricamento dei dati del dashboard:', error);
        alert('Si è verificato un errore durante il caricamento dei dati del dashboard.');
    }
});

let calendar;

function initializeCalendar(meetings) {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridDay',
        headerToolbar: {
            right: 'timeGridDay'
        },
        slotMinTime: '08:00:00',
        slotMaxTime: '20:00:00',
        locale: 'it',
        events: formatMeetingsForCalendar(meetings),
        eventClick: function(info) {
            const meeting = info.event;
            console.log(meeting)
            showMeetingModal(meeting);
        }
    });
    calendar.render();
}

function updateCalendar(meetings) {
    calendar.removeAllEvents();
    calendar.addEventSource(formatMeetingsForCalendar(meetings));
}

function formatMeetingsForCalendar(meetings) {
    return meetings.map(meeting => ({
        title: meeting.title,
        start: `${meeting.date}T${meeting.startTime}`,
        end: `${meeting.date}T${meeting.endTime}`,
        room: meeting.meetingRoom,
        extendedProps: {...meeting}
    }));
}

function showMeetingModal(meeting) {
    document.getElementById('modalTitle').textContent = meeting.title;
    document.getElementById('modalDate').textContent = meeting.startStr.split('T')[0];
    document.getElementById('modalTime').textContent = `${meeting.startStr.split('T')[1]} - ${meeting.endStr.split('T')[1]}`;
    document.getElementById('modalRoom').textContent = meeting.extendedProps.room.roomName;
    document.getElementById('modalDescription').textContent = meeting.extendedProps.description || '—';
    document.getElementById('modalCreator').textContent = meeting.extendedProps.organizedBy || '—';

    document.getElementById('meetingModal').style.display = 'flex';
}

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('meetingModal').style.display = 'none';
});

// Gestisci il logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    window.location.href = 'index.html';
});