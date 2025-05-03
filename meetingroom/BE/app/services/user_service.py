
from httpx import AsyncClient, RequestError
from fastapi import HTTPException
from app.schemas.user import UserResponse

# URL del servizio esterno
USER_API_BASE_URL = "http://10.100.2.15:8090"

# Funzione per ottenere un utente via REST API esterna
async def get_user_by_username(username: str) -> UserResponse:
    url = f"{USER_API_BASE_URL}/users/searchByUsername/{username}"
    async with AsyncClient() as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            user_data = response.json()

            metadata = user_data.get("metadata", {})
            email = metadata.get("anagrafica", {}).get("emailaziendale")

            return UserResponse(
                username=user_data.get("username"),
                full_name=f"{user_data.get('firstName', '')} {user_data.get('lastName', '')}".strip(),
                email=email
            )
        except RequestError:
            raise HTTPException(status_code=503, detail="Servizio utenti non disponibile")
        except Exception as e:
            raise HTTPException(status_code=500, detail="Errore durante il recupero dell'utente")
