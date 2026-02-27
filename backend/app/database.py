import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv() # Carga las variables de entorno si estás en tu PC

# Intenta buscar una Base de Datos en la nube. Si no la encuentra, usa tu archivo local SQLite.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./salesai.db")

# Ajuste obligatorio: Render usa 'postgres://' pero SQLAlchemy requiere 'postgresql://'
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configuración del motor de conexión dependiendo si es SQLite (local) o Postgres (nube)
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()