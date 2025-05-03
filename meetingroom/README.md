# MeetingsRoom



 Requisiti

- Python >= 3.9
- MariaDB/MySQL
- WebServer (es: Apache 2)

# Configurazione

Modifica il file 'app/config.py' con i dati di connessione del tuo DB:

# python
DB_USER = "user"
DB_PASSWORD = "password"
DB_HOST = "192.168.1.19"
DB_PORT = "3306"
DB_NAME = "meetingsystem"


# Setup ambiente

- bash
python -m venv .venv
source .venv/bin/activate  # o .venv\Scripts\activate su Windows
pip install -r requirements.txt


# Inizializzazione DB

- bash
python init_db.py

Il comando crea le tabelle se non esistono. I dati esistenti non vengono sovrascritti nè eliminati


# Avvio API

- bash
uvicorn main:app --reload

Swagger disponibile su:  
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

# API principali:
# Sale riunioni
- 'POST /meetingrooms'
- 'GET /meetingrooms'

# Riunioni
- 'POST /meetings'
- 'GET /meetings/{date}'

# Utenti
- 'GET /users/{username}' 

# Note tecniche
```
- SQLAlchemy async + 'get_db()' come dipendenza
- 
- Progetto strutturato in:
  - 'controllers/'
  - 'services/'
  - 'schemas/'
  - 'models/'
  - 'utils/'
- 	Include supporto email, validazione orari, template HTML, e sistema di prenotazione
```
# Struttura base del BE
```
BE/
├── app/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── schemas/
│   ├── utils/
│   ├── config.py
│   └── db.py
├── init_db.py
├── main.py
├── README.md
├── requirements.txt
```
# Frontend

Il frontend si trova nella cartella FE/ ed è costituito da una web app statica con
file HTML, CSS e JavaScript. Non richiede build o compilazione: 
può essere aperta direttamente nel browser o servita tramite FastAPI.


# Pagine disponibili

- 'index.html' – login o pagina iniziale
- 'dashboard.html' – panoramica riunioni
- 'meeting.html' – creazione/modifica riunioni
- 'rooms.html' – gestione sale
- '404.html' – pagina di errore
- 'js/api.js' – integra le chiamate alle API REST del backend

# Modalità di test

Apri direttamente i file '.html' nel browser oppure copiali nella cartella 'static/' e servili con FastAPI

Accedi su:

http://localhost:8000/static/dashboard.html

Per test locale puro puoi anche:

-bash
cd meetingsRoom_FE
python3 -m http.server

E visitare: 'http://localhost:8000'