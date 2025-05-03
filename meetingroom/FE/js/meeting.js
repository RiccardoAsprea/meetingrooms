// Controlla autenticazione
requireAuth();

// Variabili globali
let availableRooms = [];
let meetings = [];
let allUsers = [];
let selectedUsernames = [];

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const username = localStorage.getItem('username');
        meetings = await api.getUserMeetings(username);
        displayMeetings(meetings);

        allUsers = await api.getAllUsers();
        populateParticipantsList();

        // Ricerca partecipanti
        document.getElementById('participantSearch').addEventListener('input', filterParticipantsList);

        flatpickr("#date", { dateFormat: "Y-m-d", minDate: "today" });
        populateTimeSelectors();

        document.getElementById('addMeetingBtn').addEventListener('click', () => showMeetingForm());
        document.getElementById('meetingForm').addEventListener('submit', saveMeeting);
        document.getElementById('cancelBtn').addEventListener('click', hideMeetingForm);

        document.getElementById('date').addEventListener('change', () => {
            checkAndPopulateRooms();
            populateStartTimeSelect();
            handleDateOrStartTimeChange();
        });
        document.getElementById('startTime').addEventListener('change', () => {
            checkAndPopulateRooms();
            handleDateOrStartTimeChange();
        });
        document.getElementById('endTime').addEventListener('change', checkAndPopulateRooms);

        ['title', 'date', 'startTime', 'endTime'].forEach(id => {
            document.getElementById(id).addEventListener('input', checkSaveButtonState);
        });

    } catch (error) {
        console.error('Error initializing meetings page:', error);
        alert('Un errore si è verificato mentre di stava caricando i dati dei meetings.');
    }
});

function checkSaveButtonState() {
    const title = document.getElementById('title').value.trim();
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    const saveBtn = document.querySelector('#meetingForm button[type="submit"]');
    saveBtn.disabled = !(title && date && startTime && endTime);
}


function checkAndPopulateRooms() {
    const title = document.getElementById('title').value.trim();
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const meetingRoomSelect = document.getElementById('meetingRoom');

    const saveBtn = document.querySelector('#meetingForm button[type="submit"]');

    const allFilled = date && startTime && endTime;

    // Abilita/disabilita pulsante Salva
    saveBtn.disabled = !allFilled;

    // Abilita/disabilita selezione stanze
    if (!allFilled) {
        meetingRoomSelect.disabled = true;
        meetingRoomSelect.innerHTML = '';
        return;
    }

    const meetingData = {
        title,
        date,
        startTime,
        endTime,
        organizedBy: localStorage.getItem('username')
    };

    // Carica stanze disponibili
    populateMeetingRooms(meetingData);
    meetingRoomSelect.disabled = false;
}



function populateParticipantsList(filter = '') {
    const listContainer = document.getElementById('participantsList');
    listContainer.innerHTML = '';

    allUsers
        .filter(user => user.username.toLowerCase().includes(filter.toLowerCase()))
        .forEach(user => {
            const div = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `member-${user.username.replace(/\s+/g, '-')}`;
            checkbox.value = user.username;
            checkbox.checked = selectedUsernames.includes(user.username);

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    if (!selectedUsernames.includes(user.username)) {
                        selectedUsernames.push(user.username);
                    }
                } else {
                    selectedUsernames = selectedUsernames.filter(u => u !== user.username);
                }
                updateSelectedParticipantsDisplay();
            });

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = `${user.username}`;

            div.appendChild(checkbox);
            div.appendChild(label);
            listContainer.appendChild(div);
        });
}

function filterParticipantsList() {
    const search = document.getElementById('participantSearch').value;
    populateParticipantsList(search);
}

function updateSelectedParticipantsDisplay() {
    const container = document.getElementById('selectedParticipants');
    container.innerHTML = '';

    selectedUsernames.forEach(username => {
        const span = document.createElement('span');
        span.classList.add('selected-user');
        span.textContent = username;
        container.appendChild(span);
    });
}

async function populateMeetingRooms(meetingData) {
    try {
        const rooms = await api.getAvailableRooms(meetingData);
        const meetingRoomSelect = document.getElementById('meetingRoom');
        meetingRoomSelect.innerHTML = '<option value="">Seleziona una stanza</option>';

        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = JSON.stringify(room); // Passa l’intero oggetto
            option.textContent = `${room.roomName} (${room.seatingCapacity} posti)` +
                (room.creditPerHour ? ` - ${room.creditPerHour} crediti/ora` : '');
            meetingRoomSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Errore nel recupero delle stanze:', error);
        alert('Nessuna stanza disponibile nella fascia oraria selezionata.');
    }
}

// Mostra i meeting nella tabella
function displayMeetings(meetings) {
    const tbody = document.getElementById('meetingsTableBody');
    tbody.innerHTML = '';

    meetings.forEach(meeting => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${meeting.title}</td>
            <td>${meeting.date}</td>
            <td>${meeting.startTime} - ${meeting.endTime}</td>
            <td>${meeting.meetingRoom.roomName}</td>
            <td>${meeting.type}</td>
            <td>
                <button onclick="editMeeting(${meeting.uniqueId})">Modifica</button>
                <button onclick="deleteMeeting(${meeting.uniqueId})">Elimina</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Popola i selettori di orario
function populateTimeSelectors() {
    const startTimeSelect = document.getElementById('startTime');
    const endTimeSelect = document.getElementById('endTime');

    startTimeSelect.innerHTML = '';
    endTimeSelect.innerHTML = '';

    // Opzione vuota iniziale
    const placeholderStart = document.createElement('option');
    placeholderStart.value = '';
    placeholderStart.textContent = 'Seleziona orario inizio';
    startTimeSelect.appendChild(placeholderStart);

    const placeholderEnd = document.createElement('option');
    placeholderEnd.value = '';
    placeholderEnd.textContent = 'Seleziona orario fine';
    endTimeSelect.appendChild(placeholderEnd);

    const startTimes = [];
    const endTimes = [];

    for (let hour = 8; hour < 19; hour++) {
        ['00', '15', '30', '45'].forEach(minutes => {
            const time = `${hour.toString().padStart(2, '0')}:${minutes}`;
            startTimes.push(time);
        });
    }

    for (let hour = 8; hour <= 19; hour++) {
        ['00', '15', '30', '45'].forEach(minutes => {
            const time = `${hour.toString().padStart(2, '0')}:${minutes}`;
            endTimes.push(time);
        });
    }

    const filteredEndTimes = endTimes.filter(t => t <= '19:00');

    startTimes.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        startTimeSelect.appendChild(option);
    });

    filteredEndTimes.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        endTimeSelect.appendChild(option);
    });
}

function populateStartTimeSelect() {
    const startTimeSelect = document.getElementById('startTime');
    const selectedDate = document.getElementById('date').value;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const isToday = selectedDate === todayStr;

    // Reset selezione
    startTimeSelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Seleziona orario inizio';
    startTimeSelect.appendChild(placeholder);

    // Orari da 08:00 a 18:45
    for (let hour = 8; hour < 19; hour++) {
        ['00', '15', '30', '45'].forEach(min => {
            const time = `${hour.toString().padStart(2, '0')}:${min}`;
            if (isToday) {
                const [h, m] = time.split(':');
                const dateTime = new Date(`${selectedDate}T${time}`);
                if (dateTime <= now) return; // Salta orari passati
            }

            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            startTimeSelect.appendChild(option);
        });
    }

    // Disabilita se vuoto
    startTimeSelect.disabled = startTimeSelect.options.length === 1;
}


function handleDateOrStartTimeChange() {
    console.log('handleDateOrStartTimeChange');
    const selectedDate = document.getElementById('date').value;
    const selectedStartTime = document.getElementById('startTime').value;
    const endTimeSelect = document.getElementById('endTime');

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const isToday = selectedDate === todayStr;

    // Reset orario fine
    endTimeSelect.value = '';

    // Pulisce le opzioni
    endTimeSelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Seleziona orario fine';
    endTimeSelect.appendChild(placeholder);

    // Genera orari
    const validTimes = [];
    for (let hour = 8; hour <= 19; hour++) {
        ['00', '15', '30', '45'].forEach(min => {
            const time = `${hour.toString().padStart(2, '0')}:${min}`;
            validTimes.push(time);
        });
    }

    const filteredTimes = validTimes.filter(time => {
        if (isToday) {
            const [h, m] = time.split(':');
            const dateTime = new Date(selectedDate + 'T' + time);
            return dateTime > now;
        }
        return true;
    });

    // Mostra solo orari dopo l'inizio
    const finalTimes = selectedStartTime
        ? filteredTimes.filter(t => t > selectedStartTime)
        : filteredTimes;

    finalTimes.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        endTimeSelect.appendChild(option);
    });
}


// Mostra il form meeting
function showMeetingForm(meetingId = null) {
    const modal = document.getElementById('meetingFormModal');
    const form = document.getElementById('meetingForm');
    const modalTitle = document.getElementById('modalTitle');
    document.getElementById('meetingRoom').disabled = true;

    if (meetingId) {
        // Carica dati meeting per modifica
        const meeting = meetings.find(m => m.uniqueId === meetingId);
        console.log(meeting);
        if (meeting) {
            document.getElementById('meetingId').value = meeting.uniqueId;
            document.getElementById('title').value = meeting.title;
            document.getElementById('date').value = meeting.date;

            populateTimeSelectors(); // <-- Rigenera orari
            document.getElementById('startTime').value = meeting.startTime;
            document.getElementById('endTime').value = meeting.endTime;

            document.getElementById('type').value = meeting.type;
            document.getElementById('description').value = meeting.description || '';

            // Aggiungi stanza alla select
            const meetingRoomSelect = document.getElementById('meetingRoom');
            meetingRoomSelect.innerHTML = '';
            const option = document.createElement('option');
            option.value = JSON.stringify(meeting.meetingRoom);
            option.textContent = `${meeting.meetingRoom.roomName} (${meeting.meetingRoom.seatingCapacity} posti)` +
                (meeting.meetingRoom.creditPerHour ? ` - ${meeting.meetingRoom.creditPerHour} crediti/ora` : '');
            meetingRoomSelect.appendChild(option);
            meetingRoomSelect.value = JSON.stringify(meeting.meetingRoom);

            // Blocca data, orari e stanza
            document.getElementById('date').disabled = true;
            document.getElementById('startTime').disabled = true;
            document.getElementById('endTime').disabled = true;
            document.getElementById('meetingRoom').disabled = true;

            // Imposta partecipanti
            selectedUsernames = meeting.listOfMember || [];
            populateParticipantsList(); // Aggiorna checkbox
            updateSelectedParticipantsDisplay();

            modalTitle.textContent = 'Modifica Meeting';
        }
    } else {
        form.reset();
        checkSaveButtonState();
        document.getElementById('meetingId').value = '';
        modalTitle.textContent = 'Nuovo Meeting';
        selectedUsernames = [localStorage.getItem('username')];
        populateParticipantsList();
        updateSelectedParticipantsDisplay();
    }

    modal.style.display = 'block';
}

// Chiudi il form meeting
function hideMeetingForm() {
    document.getElementById('meetingFormModal').style.display = 'none';
}

// Salva meeting
async function saveMeeting(e) {
    e.preventDefault();

    const username = localStorage.getItem('username');
    const meetingId = document.getElementById('meetingId').value;
    const selectedMembers = [...selectedUsernames];
    const selectedRoom = document.getElementById('meetingRoom').value;
    console.log(selectedRoom);

    const meetingData = {
        title: document.getElementById('title').value,
        date: document.getElementById('date').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        type: document.getElementById('type').value,
        listOfMember: selectedMembers,
        meetingRoom: JSON.parse(selectedRoom),
        description: document.getElementById('description').value,
        organizedBy: localStorage.getItem('username')
    };

    if (meetingId) {
        // Aggiorna meeting esistente
        meetingData.uniqueId = parseInt(meetingId);
        await api.updateMeeting(meetingData);
    } else {
        // Crea nuovo meeting
        await api.createMeeting(meetingData);
    }

    // Aggiorna lista meeting
    meetings = await api.getUserMeetings(username);
    displayMeetings(meetings);

    hideMeetingForm();
}

// Modifica meeting
function editMeeting(id) {
    showMeetingForm(id);
}

// Elimina meeting
async function deleteMeeting(id) {
    if (confirm('Sei sicuro di voler eliminare questo meeting?')) {
        await api.deleteMeeting(id);

        // Aggiorna lista meeting
        const username = localStorage.getItem('username');
        meetings = await api.getUserMeetings(username);
        displayMeetings(meetings);
    }
}

// Logout
function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    window.location.href = 'index.html';
}
