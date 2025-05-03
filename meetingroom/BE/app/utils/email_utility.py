
import smtplib
from email.message import EmailMessage

# Funzione per inviare una email semplice via SMTP
def send_email(host: str, port: int, username: str, password: str,
               to_address: str, subject: str, message: str):
    msg = EmailMessage()
    msg['From'] = username
    msg['To'] = to_address
    msg['Subject'] = subject
    msg.set_content(message)

    try:
        with smtplib.SMTP(host, port) as server:
            server.starttls()
            server.login(username, password)
            server.send_message(msg)
    except Exception as e:
        raise RuntimeError(f"Errore durante l'invio dell'email: {str(e)}")
