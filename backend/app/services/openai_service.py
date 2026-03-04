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
            temperature=0.85,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"❌ Error OpenAI: {e}")
        return "Error conectando con el agente."


def generar_evaluacion_vendedor(historial: list):
    """
    Informe corto para el VENDEDOR.
    Devolución simple: pros/contras + técnica sugerida.
    """
    try:
        prompt = """Sos un coach de ventas analizando una conversación de entrenamiento.
El rol "user" es el VENDEDOR. El rol "assistant" es el CLIENTE SIMULADO.

Antes de calificar, revisá objetivamente estos puntos:
1. ¿El vendedor respondió TODAS las preguntas que hizo el cliente? Si quedó alguna sin responder, bajá la nota.
2. ¿Mencionó datos clave del producto (precio, fecha de inicio, modalidad, duración, etc.)? Si no los mencionó cuando eran relevantes, bajá la nota.
3. ¿La conversación tuvo un cierre real? (el cliente dijo "sí lo tomo", "no me interesa", "lo voy a pensar") — Si se cortó sin cierre, la nota NO puede superar 6.
4. ¿Cómo manejó las objeciones? ¿Las resolvió o las esquivó?
5. ¿El vendedor fue empático o insistente/mecánico?

CRITERIO DE CALIFICACIÓN:
- 9-10: Respondió todo, manejó objeciones, tuvo cierre claro, fue empático.
- 7-8: Buen desempeño general con 1-2 áreas mejorables.
- 5-6: Desempeño regular, varias áreas sin resolver o sin cierre.
- 3-4: Problemas serios: preguntas sin responder, mal manejo de objeciones, sin cierre.
- 1-2: Conversación muy pobre o incompleta.

Generá el informe usando EXACTAMENTE este formato:

CALIFICACIÓN: [número del 1 al 10]

✅ LO QUE HICISTE BIEN:
- [punto concreto con referencia a la conversación]
- [punto concreto con referencia a la conversación]

⚠️ LO QUE TENÉS QUE MEJORAR:
- [si no respondiste alguna pregunta del cliente, mencionalo explícitamente]
- [si no diste información clave del producto, mencionalo]
- [si no hubo cierre, mencionalo]

💡 TÉCNICA RECOMENDADA:
[Nombre de la técnica]: [Cómo aplicarla específicamente en esta situación. Máximo 3 oraciones.]

🎯 CONCLUSIÓN:
[Una frase honesta sobre el desempeño. Si no cerró o dejó preguntas sin responder, decilo claramente pero de forma constructiva. Máximo 2 oraciones.]

IMPORTANTE:
- No inflés la nota. Sé justo y objetivo.
- Referite a momentos concretos de la conversación.
- Tono: mentor directo, no condescendiente.
- Todo en español."""

        mensajes = list(historial)
        mensajes.append({"role": "system", "content": prompt})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=mensajes,
            temperature=0.5,
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"Error generando evaluación: {str(e)}"


def generar_evaluacion_admin(historial: list, nombre_vendedor: str):
    """
    Informe extendido para el ADMINISTRADOR DE EMPRESA.
    Incluye análisis de performance, estado emocional del vendedor y recomendaciones de Hard Skills.
    """
    try:
        prompt = f"""Sos un consultor experto en desarrollo de equipos de ventas.
Analizá esta conversación de entrenamiento del vendedor "{nombre_vendedor}".
El rol "user" es el VENDEDOR. El rol "assistant" es el CLIENTE SIMULADO.

Antes de redactar el informe, evaluá objetivamente:
- ¿Quedaron preguntas del cliente sin responder? Identificá cuáles.
- ¿Se mencionaron datos clave del producto (precio, fecha, modalidad, etc.)?
- ¿Hubo un cierre real de la conversación (positivo o negativo)?
- ¿Cómo reaccionó el vendedor ante las objeciones?

Generá el informe gerencial usando EXACTAMENTE este formato:

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
🧠 ESTADO DEL VENDEDOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERFIL EMOCIONAL DETECTADO: [Ej: Ansioso y apresurado / Seguro pero agresivo / Desmotivado y sin energía / Entusiasta pero desorganizado / etc.]

SEÑALES OBSERVADAS EN LA CONVERSACIÓN:
[2-3 oraciones describiendo qué comportamientos o frases del vendedor revelan su estado emocional actual.]

IMPACTO EN LAS VENTAS:
[1-2 oraciones sobre cómo este estado emocional afecta directamente su performance.]

RECOMENDACIONES PARA EL BIENESTAR Y DESARROLLO PERSONAL:
- [Recomendación enfocada en el vendedor como persona 1 — Ej: trabajar la tolerancia a la frustración, desarrollar confianza, etc.]
- [Recomendación enfocada en el vendedor como persona 2]
- [Recomendación de hábito o práctica concreta que puede implementar fuera del trabajo]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ HARD SKILLS RECOMENDADAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Listá 3 habilidades técnicas o herramientas concretas que este vendedor necesita desarrollar, con una breve justificación de por qué basada en la conversación:]

1. [Nombre de la skill/herramienta]: [Por qué la necesita + cómo puede desarrollarla]
2. [Nombre de la skill/herramienta]: [Por qué la necesita + cómo puede desarrollarla]
3. [Nombre de la skill/herramienta]: [Por qué la necesita + cómo puede desarrollarla]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RESUMEN EJECUTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[2-3 oraciones resumiendo el estado general del vendedor y la prioridad de acción más importante que el administrador debería tomar con este colaborador.]

IMPORTANTE:
- Sé preciso y basate en evidencia concreta de la conversación.
- Tono: profesional, objetivo, constructivo. No suavices los problemas reales pero tampoco seas destructivo.
- El informe debe ser útil para que el administrador tome decisiones concretas de acompañamiento.
- Todo en español."""

        mensajes = list(historial)
        mensajes.append({"role": "system", "content": prompt})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=mensajes,
            temperature=0.5,
            max_tokens=1500,
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"Error generando evaluación: {str(e)}"


# Mantener compatibilidad con código existente
def generar_evaluacion(historial: list):
    return generar_evaluacion_vendedor(historial)