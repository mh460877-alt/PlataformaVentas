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

Generá un informe breve y directo para el vendedor, usando EXACTAMENTE este formato:

CALIFICACIÓN: [número del 1 al 10]

✅ LO QUE HICISTE BIEN:
- [punto concreto 1]
- [punto concreto 2]

⚠️ LO QUE TENÉS QUE MEJORAR:
- [punto concreto 1]
- [punto concreto 2]

💡 TÉCNICA RECOMENDADA:
[Nombre de la técnica]: [Explicación breve de cómo aplicarla en una situación como esta. Máximo 3 oraciones.]

🎯 CONCLUSIÓN:
[Una frase directa, honesta y motivadora sobre el desempeño general. Máximo 2 oraciones.]

IMPORTANTE:
- Sé específico, referite a momentos concretos de la conversación.
- Si la venta no se cerró, explicá por qué de forma constructiva.
- Tono: profesional pero cercano, como un mentor que quiere que mejore.
- Todo en español."""

        mensajes = list(historial)
        mensajes.append({"role": "system", "content": prompt})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=mensajes,
            temperature=0.7,
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

Generá un informe gerencial completo usando EXACTAMENTE este formato:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 EVALUACIÓN DEL ASESORAMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTADO DE LA CONVERSACIÓN: [Venta concretada / Venta no concretada / Cliente interesado pero sin cierre]

ANÁLISIS DETALLADO:
[Describí en 4-6 oraciones cómo fue el proceso de venta: apertura, manejo de objeciones, argumentación, cierre. Sé específico y referite a momentos puntuales de la conversación.]

PUNTO DE QUIEBRE:
[Identificá el momento exacto donde se perdió la venta o donde estuvo el error principal. Si la venta se concretó, marcá el momento clave que la definió.]

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
            temperature=0.6,
            max_tokens=1200,
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"Error generando evaluación: {str(e)}"


# Mantener compatibilidad con código existente
def generar_evaluacion(historial: list):
    return generar_evaluacion_vendedor(historial)