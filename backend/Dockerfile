# Usamos Python 3.9
FROM python:3.9

# Creamos carpeta de trabajo
WORKDIR /code

# Copiamos los requerimientos primero para aprovechar caché
COPY ./requirements.txt /code/requirements.txt

# Instalamos las librerías
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copiamos el resto del código
COPY ./app /code/app
COPY ./main.py /code/main.py

# Comando para encender el servidor
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]