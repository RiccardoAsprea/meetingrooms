from typing import Optional

from datetime import time, datetime

# Converte un oggetto time in stringa 'HH:mm'
def local_to_string(t: time) -> Optional[str]:
    if t is None:
        return None
    return t.strftime('%H:%M')

# Converte una stringa 'HH:mm' in oggetto time
def string_to_local(t: str) -> time | None:
    if t is None:
        return None
    return datetime.strptime(t, '%H:%M').time()
