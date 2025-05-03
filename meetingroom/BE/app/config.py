
DB_USER = "silicondev"
DB_PASSWORD = "$ilicondev"
DB_HOST = "10.100.2.19"
DB_PORT = "3306"
DB_NAME = "meetingsystem"

DATABASE_URL = (
    f"mysql+asyncmy://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)
