# Usamos Python 3.9
FROM python:3.9

# Creamos carpeta de trabajo con permisos para todos (importante para Hugging Face)
WORKDIR /code

# Copiamos los requerimientos primero para aprovechar caché
COPY ./requirements.txt /code/requirements.txt

# Instalamos las librerías
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copiamos el resto del código
COPY ./app /code/app
COPY ./main.py /code/main.py

# Creamos un directorio para la base de datos con permisos de escritura
RUN mkdir -p /code/data && chmod 777 /code/data

# Comando para encender el servidor en el puerto 7860 (obligatorio en Hugging Face)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
```

4.  **Ajuste Rápido a la Base de Datos:**
    Abre `backend/app/database.py` y cambia la línea de la URL para que use la carpeta `/data` que acabamos de crear (así evitamos errores de permisos):

```python
# Busca esta línea:
# SQLALCHEMY_DATABASE_URL = "sqlite:///./salesai.db"

# Y CÁMBIALA POR ESTA:
SQLALCHEMY_DATABASE_URL = "sqlite:///./data/salesai.db"