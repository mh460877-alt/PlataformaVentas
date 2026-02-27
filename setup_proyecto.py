import os

# --- Configuración Inicial ---
nombre_proyecto = "SalesAI_Platform"

# Definimos la estructura de carpetas profesional
# Backend: Donde vivirá la lógica de Python y la IA
# Frontend: Donde vivirá la interfaz visual (React)
carpetas = [
    "backend",
    "backend/app",          # Código principal del servidor
    "backend/app/routers",  # Rutas de la API (puntos de conexión)
    "backend/app/services", # Lógica de conexión con OpenAI
    "frontend",             # Interfaz de usuario
]

# Archivos base vacíos para empezar
archivos = [
    "backend/requirements.txt", # Lista de ingredientes (librerías) necesarias
    "backend/main.py",          # Punto de entrada del servidor (el interruptor de encendido)
    "backend/.env",             # CAJA FUERTE: Aquí guardaremos tu API Key de OpenAI
    "README.md"                 # Manual de instrucciones del proyecto
]

def crear_estructura():
    print(f"🚀 Iniciando construcción de cimientos para: {nombre_proyecto}...")
    
    # 1. Crear Carpetas
    for carpeta in carpetas:
        os.makedirs(carpeta, exist_ok=True)
        print(f"✅ Carpeta creada: {carpeta}")

    # 2. Crear Archivos Base
    for archivo in archivos:
        # Solo creamos el archivo si no existe, para no borrar trabajo previo
        if not os.path.exists(archivo):
            with open(archivo, 'w') as f:
                f.write("") # Crear archivo vacío
            print(f"📄 Archivo creado: {archivo}")
        else:
            print(f"⚠️ El archivo ya existía: {archivo}")

    print("\n🎉 ¡Estructura lista! Ahora tienes un entorno profesional.")
    print("Siguiente paso: Avisarme que ya ves las carpetas creadas.")

if __name__ == "__main__":
    crear_estructura()