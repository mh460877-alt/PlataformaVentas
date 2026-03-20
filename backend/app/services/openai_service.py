import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)


def obtener_respuesta_coach(historial: list, configuracion_sistema: str):
    try:
        mensajes_a_enviar = [{"role": "system", "content": configuracion_sistema}]
        mensajes_a_enviar.extend(historial)

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=mensajes_a_enviar,
            temperature=0.4,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"❌ Error OpenAI: {e}")
        return "Error conectando con el agente."


def generar_evaluacion_vendedor(historial: list):
    """
    Informe corto para el VENDEDOR.
    """
    try:
        prompt = """Sos un coach de ventas analizando una conversación de entrenamiento.
El rol "user" es el VENDEDOR. El rol "assistant" es el CLIENTE SIMULADO.

ANTES DE CALIFICAR, analizá objetivamente estos puntos:
1. ¿El vendedor respondió TODAS las preguntas del cliente? Cada pregunta sin responder baja la nota.
2. ¿Dio información técnica clave del producto (precio, garantía, financiación, características)? Si evitó datos, bajá la nota.
3. ¿Hubo cierre real? Si en la conversación aparece la señal [VENTA_CERRADA], la venta SE CONCRETÓ y debe reflejarse positivamente. Si no aparece esa señal, la nota NO puede superar 6.
4. ¿Manejó las objeciones con argumentos concretos o las esquivó con frases vagas?
5. ¿El vendedor fue empático y personalizado, o genérico y mecánico?

CRITERIO DE CALIFICACIÓN ESTRICTO:
- 9-10: Respondió todo, argumentó con datos reales, manejó objeciones, hubo cierre claro, fue empático.
- 7-8: Buen desempeño con 1-2 fallas menores.
- 5-6: Desempeño regular: preguntas sin responder, respuestas vagas, sin cierre o cierre forzado.
- 3-4: Problemas serios: múltiples preguntas sin responder, argumentación débil, sin cierre, sin empatía.
- 1-2: Conversación muy pobre, respuestas incorrectas o conversación abandonada.

⚠️ REGLA CRÍTICA: Si el vendedor dio información incorrecta, inventó datos o confundió al cliente → nota MÁXIMA 4.
⚠️ REGLA CRÍTICA: Si la conversación fue muy corta (menos de 4 intercambios reales del vendedor) → nota MÁXIMA 3.
⚠️ REGLA CRÍTICA: Si el vendedor solo saludó o escribió 1 o 2 mensajes sin desarrollar ningún argumento → nota MÁXIMA 2.

Generá el informe usando EXACTAMENTE este formato:

CALIFICACIÓN: [número del 1 al 10]

✅ LO QUE HICISTE BIEN:
- [punto concreto con referencia a la conversación]
- [punto concreto con referencia a la conversación]

⚠️ LO QUE TENÉS QUE MEJORAR:
- [si no respondiste alguna pregunta del cliente, mencionalo explícitamente]
- [si no diste información clave del producto, mencionalo]
- [si no hubo cierre, mencionalo]
- [si la información que diste fue incorrecta o vaga, mencionalo]

💡 TÉCNICA RECOMENDADA:
[Nombre de la técnica]: [Cómo aplicarla específicamente en esta situación. Máximo 3 oraciones.]

🎯 CONCLUSIÓN:
[Una frase honesta sobre el desempeño. Si no cerró o dejó preguntas sin responder, decilo claramente pero de forma constructiva. Máximo 2 oraciones.]

IMPORTANTE:
- No inflés la nota. Sé justo y objetivo. Un mal asesoramiento DEBE quedar reflejado en una nota baja.
- Referite a momentos concretos de la conversación.
- Tono: mentor directo, no condescendiente.
- Todo en español."""

        mensajes = list(historial)
        mensajes.append({"role": "system", "content": prompt})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=mensajes,
            temperature=0.3,  # ✅ FIX: Más bajo para evaluaciones más consistentes y estrictas
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"Error generando evaluación: {str(e)}"


def generar_evaluacion_admin(historial: list, nombre_vendedor: str, duration_seconds: int = 0, mission_values: str = "", nombre_producto: str = "", nombre_prototipo: str = ""):
    """
    Informe extendido para el ADMINISTRADOR DE EMPRESA.
    ✅ FIX: Recibe duration_seconds y mission_values para análisis completo.
    """
    try:
        # Convertir segundos a formato legible
        minutos = duration_seconds // 60
        segundos = duration_seconds % 60
        duracion_texto = f"{minutos} minutos y {segundos} segundos" if minutos > 0 else f"{segundos} segundos"

        # Sección de cultura organizacional — solo si existe
        cultura_section = ""
        if mission_values and mission_values.strip():
            cultura_section = f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 CULTURA ORGANIZACIONAL DE LA EMPRESA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{mission_values.strip()}

Evaluá si el vendedor reflejó esta cultura en su forma de comunicarse, en los valores que transmitió al cliente y en cómo manejó la conversación.
"""

        prompt = f"""Sos un consultor experto en desarrollo de equipos de ventas.
Analizá esta conversación de entrenamiento del vendedor "{nombre_vendedor}".
El rol "user" es el VENDEDOR. El rol "assistant" es el CLIENTE SIMULADO.
La duración total de la simulación fue: {duracion_texto} ({duration_seconds} segundos).
Producto evaluado: {nombre_producto if nombre_producto else "No especificado"}
Tipo de cliente simulado: {nombre_prototipo if nombre_prototipo else "No especificado"}
{cultura_section}
Antes de redactar el informe, evaluá objetivamente:
- ¿Quedaron preguntas del cliente sin responder? Identificá cuáles.
- ¿Se mencionaron datos clave del producto (precio, garantía, financiación, características técnicas)?
- ¿Hubo un cierre real de la conversación (positivo o negativo)?
- ¿Cómo reaccionó el vendedor ante las objeciones?
- ¿El tiempo utilizado ({duracion_texto}) fue apropiado para la complejidad de la venta?
- ¿El vendedor reflejó la misión y valores de la empresa en su forma de comunicarse y asesorar?

Generá el informe gerencial usando EXACTAMENTE este formato y nada más. No agregues texto fuera de este formato:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ENCABEZADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VENDEDOR: {nombre_vendedor}
PRODUCTO EVALUADO: {nombre_producto if nombre_producto else "No especificado"}
CLIENTE SIMULADO: {nombre_prototipo if nombre_prototipo else "No especificado"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 INDICADORES RÁPIDOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTADO DE LA CONVERSACIÓN: [Venta concretada / Venta no concretada / Cliente interesado pero sin cierre]
DURACIÓN: {duracion_texto}
ALINEACIÓN CULTURAL: [Alto / Medio / Bajo / No evaluable]
PROBABILIDAD DE CIERRE DETECTADA: [Alta / Media / Baja]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 EVALUACIÓN DEL ASESORAMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANÁLISIS DE LA INTERACCIÓN:
[Describí en 4-6 oraciones cómo fue el proceso de venta: apertura, manejo de objeciones, argumentación, cierre.]

MOTIVO PRINCIPAL DEL RESULTADO:
[Explicación clara de por qué se concretó o no la venta.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 PUNTO DE QUIEBRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MOMENTO CLAVE:
[Descripción del momento donde cambió el rumbo de la conversación.]

IMPACTO EN EL RESULTADO:
[Cómo influyó ese momento en la decisión final del cliente.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 OBJECIONES DEL CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBJECIONES DETECTADAS:
- [Objeción 1]
- [Objeción 2]
- [Objeción 3 si aplica, sino escribí "No aplica"]

NIVEL DE MANEJO DE OBJECIONES: [Alto / Medio / Bajo]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ FORTALEZAS OBSERVADAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- [fortaleza concreta 1]
- [fortaleza concreta 2]
- [fortaleza concreta 3]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ OPORTUNIDADES DE MEJORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- [mejora concreta 1 con ejemplo de la conversación]
- [mejora concreta 2 con ejemplo de la conversación]
- [mejora concreta 3 con ejemplo de la conversación]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ ANÁLISIS DE TIEMPO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DURACIÓN TOTAL: {duracion_texto}
EVALUACIÓN DEL MANEJO DEL TIEMPO: [Adecuado / Muy corto / Muy extenso]
IMPACTO EN LA INTERACCIÓN: [Cómo influyó el tiempo en el resultado.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 EVALUACIÓN DEL PROCESO DE VENTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETECCIÓN DE NECESIDADES: [Alto / Medio / Bajo]
PRESENTACIÓN DEL PRODUCTO: [Alto / Medio / Bajo]
MANEJO DE OBJECIONES: [Alto / Medio / Bajo]
GENERACIÓN DE CONFIANZA: [Alto / Medio / Bajo]
INTENTO DE CIERRE: [Alto / Medio / Bajo]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 ALINEACIÓN CON LA CULTURA DE LA EMPRESA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NIVEL DE ALINEACIÓN: [Alto / Medio / Bajo / No evaluable]
ANÁLISIS: [Cómo reflejó el vendedor los valores de la empresa.]
RECOMENDACIÓN: [Acción concreta para mejorar la alineación.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 ESTADO DEL VENDEDOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERFIL EMOCIONAL DETECTADO: [Ej: Seguro pero apresurado]
SEÑALES OBSERVADAS: [2-3 oraciones sobre comportamiento y frases del vendedor.]
IMPACTO EN LA INTERACCIÓN: [Cómo afectó su estado emocional al resultado.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ HABILIDADES A DESARROLLAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. [Habilidad]: [Por qué y cómo desarrollarla]
2. [Habilidad]: [Por qué y cómo desarrollarla]
3. [Habilidad]: [Por qué y cómo desarrollarla]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RESUMEN EJECUTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SÍNTESIS DEL DESEMPEÑO: [2-3 oraciones sobre el estado general del vendedor.]
PRINCIPAL APRENDIZAJE: [Una frase clave de esta sesión.]
RECOMENDACIÓN PRINCIPAL: [Acción prioritaria que el administrador debería tomar.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 INDICADORES DE DESEMPEÑO COMERCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBABILIDAD DE CIERRE: [Alta / Media / Baja]
CLARIDAD DEL ASESORAMIENTO: [Alta / Media / Baja]
DETECCIÓN DE NECESIDADES: [Alta / Media / Baja]
MANEJO DE OBJECIONES: [Alto / Medio / Bajo]
CONFIANZA TRANSMITIDA: [Alta / Media / Baja]
INTENTO DE CIERRE: [Alto / Medio / Bajo]
CONOCIMIENTO DEL PRODUCTO: [Alto / Medio / Bajo]
ALINEACIÓN CULTURAL: [Alta / Media / Baja]

IMPORTANTE:
- Respondé ÚNICAMENTE con el informe en el formato indicado.
- No escribas "Entendido", "Voy a redactar", ni ningún texto previo o posterior.
- Basate en evidencia concreta de la conversación.
- Tono: profesional, objetivo, constructivo.
- Todo en español."""

        mensajes = list(historial)
        mensajes.append({"role": "system", "content": prompt})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=mensajes,
            temperature=0.3,  # ✅ FIX: Más bajo para consistencia
            max_tokens=3500,  # ✅ FIX: Subido de 1500 a 2000 para que no se corte con la sección de tiempo
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"Error generando evaluación: {str(e)}"


def obtener_respuesta_coach_con_imagen(historial: list, configuracion_sistema: str, imagen_b64: str, media_type: str):
    try:
        mensajes_a_enviar = [{"role": "system", "content": configuracion_sistema}]
        mensajes_a_enviar.extend(historial[:-1])

        ultimo_msg = historial[-1]["content"] if historial else ""

        mensajes_a_enviar.append({
            "role": "user",
            "content": [
                {"type": "text", "text": ultimo_msg or "El vendedor compartió esta imagen."},
                {"type": "image_url", "image_url": {"url": f"data:{media_type};base64,{imagen_b64}"}}
            ]
        })

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=mensajes_a_enviar,
            temperature=0.6,  # ✅ FIX: Bajada también para gpt-4o
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"❌ Error OpenAI visión: {e}")
        return "Error procesando la imagen."


# Mantener compatibilidad con código existente
def generar_evaluacion(historial: list):
    return generar_evaluacion_vendedor(historial)