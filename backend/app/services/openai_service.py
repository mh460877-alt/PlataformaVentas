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
            model="gpt-3.5-turbo",
            messages=mensajes_a_enviar,
            # ✅ FIX: Bajada de 0.85 a 0.6 para que el modelo respete mejor el rol de cliente
            temperature=0.6,
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
3. ¿Hubo cierre real? (el cliente decidió comprar, rechazó o pidió tiempo). Si no hubo cierre, la nota NO puede superar 6.
4. ¿Manejó las objeciones con argumentos concretos o las esquivó con frases vagas?
5. ¿El vendedor fue empático y personalizado, o genérico y mecánico?

CRITERIO DE CALIFICACIÓN ESTRICTO:
- 9-10: Respondió todo, argumentó con datos reales, manejó objeciones, hubo cierre claro, fue empático.
- 7-8: Buen desempeño con 1-2 fallas menores.
- 5-6: Desempeño regular: preguntas sin responder, respuestas vagas, sin cierre o cierre forzado.
- 3-4: Problemas serios: múltiples preguntas sin responder, argumentación débil, sin cierre, sin empatía.
- 1-2: Conversación muy pobre, respuestas incorrectas o conversación abandonada.

⚠️ REGLA CRÍTICA: Si el vendedor dio información incorrecta, inventó datos o confundió al cliente → nota MÁXIMA 4.
⚠️ Si la conversación fue muy corta (menos de 4 intercambios reales) → nota MÁXIMA 5.

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


def generar_evaluacion_admin(historial: list, nombre_vendedor: str, duration_seconds: int = 0, mission_values: str = ""):
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
📊 EVALUACIÓN DEL ASESORAMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTADO DE LA CONVERSACIÓN: [Venta concretada / Venta no concretada / Cliente interesado pero sin cierre]

ANÁLISIS DETALLADO:
[Describí en 4-6 oraciones cómo fue el proceso de venta: apertura, manejo de objeciones, argumentación, cierre. Sé específico y referite a momentos puntuales de la conversación.]

PUNTO DE QUIEBRE:
[Identificá el momento exacto donde se perdió la venta o donde estuvo el error principal. Si la venta se concretó, marcá el momento clave que la definió.]

PREGUNTAS DEL CLIENTE SIN RESPONDER:
[Listá cualquier pregunta que el cliente hizo y el vendedor no respondió. Si respondió todo, escribí "Ninguna".]

FORTALEZAS OBSERVADAS:
- [fortaleza concreta 1]
- [fortaleza concreta 2]

ÁREAS CRÍTICAS A MEJORAR:
- [área con ejemplo concreto de la conversación 1]
- [área con ejemplo concreto de la conversación 2]
- [área con ejemplo concreto de la conversación 3]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ ANÁLISIS DE TIEMPO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DURACIÓN TOTAL: {duracion_texto}

EFICIENCIA TEMPORAL:
[Evaluá si el tiempo fue bien utilizado. ¿Tardó demasiado en responder preguntas simples? ¿Fue muy rápido y no profundizó? ¿El ritmo fue adecuado para generar confianza sin perder al cliente?]

IMPACTO EN LA VENTA:
[¿Cómo afectó el manejo del tiempo al resultado de la conversación?]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 ALINEACIÓN CON LA CULTURA DE LA EMPRESA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NIVEL DE ALINEACIÓN: [Alto / Medio / Bajo / No evaluable — si no se proporcionó misión y valores]

ANÁLISIS:
[¿El vendedor reflejó en su comunicación los valores y la misión de la empresa? ¿Usó un lenguaje y actitud coherente con la cultura organizacional? Citá ejemplos concretos de la conversación. Si no se proporcionó información de cultura organizacional, indicá "No se proporcionó información de misión y valores para evaluar este punto".]

RECOMENDACIÓN:
[Una acción concreta para que el vendedor se alinee mejor con la cultura de la empresa, o una validación si lo hizo bien.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 ESTADO DEL VENDEDOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERFIL EMOCIONAL DETECTADO: [Ej: Ansioso y apresurado / Seguro pero agresivo / Desmotivado / Entusiasta pero desorganizado]

SEÑALES OBSERVADAS EN LA CONVERSACIÓN:
[2-3 oraciones describiendo qué comportamientos o frases del vendedor revelan su estado emocional.]

IMPACTO EN LAS VENTAS:
[1-2 oraciones sobre cómo este estado emocional afecta directamente su performance.]

RECOMENDACIONES PARA EL BIENESTAR Y DESARROLLO PERSONAL:
- [Recomendación 1 enfocada en el vendedor como persona]
- [Recomendación 2 enfocada en el vendedor como persona]
- [Hábito o práctica concreta que puede implementar fuera del trabajo]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ HARD SKILLS RECOMENDADAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. [Nombre de la skill]: [Por qué la necesita basado en la conversación + cómo puede desarrollarla]
2. [Nombre de la skill]: [Por qué la necesita basado en la conversación + cómo puede desarrollarla]
3. [Nombre de la skill]: [Por qué la necesita basado en la conversación + cómo puede desarrollarla]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RESUMEN EJECUTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[2-3 oraciones resumiendo el estado general del vendedor, su alineación con la cultura de la empresa y la prioridad de acción más importante que el administrador debería tomar con este colaborador.]

IMPORTANTE:
- Respondé ÚNICAMENTE con el informe en el formato indicado. No escribas "Entendido", "Voy a redactar", ni ningún texto previo o posterior al informe.
- Sé preciso y basate en evidencia concreta de la conversación.
- Tono: profesional, objetivo, constructivo.
- Todo en español."""

        mensajes = list(historial)
        mensajes.append({"role": "system", "content": prompt})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=mensajes,
            temperature=0.3,  # ✅ FIX: Más bajo para consistencia
            max_tokens=2000,  # ✅ FIX: Subido de 1500 a 2000 para que no se corte con la sección de tiempo
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