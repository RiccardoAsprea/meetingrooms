const API_BASE_URL = 'http://IP_BE:PORTA_BE/';

// Funzioni di utilità per l'API
const api = {
    // Autenticazione
    login: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                clientId: 'user-import-client'
            })
        });
        return response.json();
    },

    // Stanze
    getAllRooms: async () => {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}meetingrooms/allRooms`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    getAvailableRooms: async (meetingData) => {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}meetingrooms/avaibleroom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(meetingData)
        });
        return response.json();
    },

    // Riunioni
    getRoomMeetings: async (roomName) => {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}meeting/room/${encodeURIComponent(roomName)}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    getUserMeetings: async (username) => {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}meeting/organizer/${encodeURIComponent(username)}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    createMeeting: async (meetingData) => {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}meeting/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(meetingData)
        });
        return response.json();
    },

    updateMeeting: async (meetingData) => {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}meeting/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(meetingData)
        });
        return response.json();
    },

    deleteMeeting: async (uniqueId) => {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}meeting/delete/${uniqueId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    createRoom: async (roomData) => {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}meetingrooms/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(roomData)
        });
        return response.json();
    },


    updateRoom: async (roomData) => {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}meetingrooms/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(roomData)
        });
        return response.json();
    },


    deleteRoom: async (roomIdData) => {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}meetingrooms/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(roomIdData)
        });
        return response.json();
    },

    // Utenti
    getAllUsers: async () => {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}users/all`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    }
};

// Funzione di supporto per verificare se l'utente è autenticato
const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    return !!token;
};

// Funzione di supporto per redirigere al login se non autenticato
const requireAuth = () => {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
    }
};