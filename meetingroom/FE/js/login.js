document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await api.login(username, password);
        
        if (response.access_token) {
            // Memorizza il token e le informazioni dell'utente
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            localStorage.setItem('username', username);
            localStorage.setItem('roles', JSON.stringify(response.roles));

            // Redirige al dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Accesso fallito. Controlla le tue credenziali.');
        }
    } catch (error) {
        console.error('Errore di login:', error);
        alert('Si è verificato un errore durante il login. Riprova.');
    }
});