from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
import base64, fitz, tempfile, os, time, random
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session

from app.database import engine, SessionLocal, Base
from app.models import User, Employee, Product, ClientPrototype, Capsule, CapsuleContent, ChatSession, ChatMessage, EmployeeCapsule
from app.services.openai_service import obtener_respuesta_coach, generar_evaluacion, generar_evaluacion_vendedor, generar_evaluacion_admin, obtener_respuesta_coach_con_imagen

# Crear tablas nuevas y migrar columnas faltantes de forma segura
Base.metadata.create_all(bind=engine)

# Migración segura: agrega columnas/tablas nuevas sin tocar los datos existentes
def run_migrations():
    from sqlalchemy import text, inspect
    with engine.connect() as conn:
        inspector = inspect(engine)
        
        # 1. Agregar visible_password a employees si no existe
        emp_cols = [c['name'] for c in inspector.get_columns('employees')]
        if 'visible_password' not in emp_cols:
            try:
                conn.execute(text("ALTER TABLE employees ADD COLUMN visible_password VARCHAR"))
                conn.commit()
                conn.execute(text("UPDATE employees SET visible_password = password"))
                conn.commit()
                print("✅ Migración: columna visible_password agregada a employees")
            except Exception as e:
                print(f"⚠️ Migración visible_password: {e}")

        # 2. Agregar info a products si no existe
        prod_cols = [c['name'] for c in inspector.get_columns('products')]
        if 'info' not in prod_cols:
            try:
                conn.execute(text("ALTER TABLE products ADD COLUMN info TEXT"))
                conn.commit()
                print("✅ Migración: columna info agregada a products")
            except Exception as e:
                print(f"⚠️ Migración products.info: {e}")

        # 3. Agregar feedback_admin a chat_sessions si no existe
        ses_cols = [c['name'] for c in inspector.get_columns('chat_sessions')]
        if 'feedback_admin' not in ses_cols:
            try:
                conn.execute(text("ALTER TABLE chat_sessions ADD COLUMN feedback_admin TEXT"))
                conn.commit()
                print("✅ Migración: columna feedback_admin agregada a chat_sessions")
            except Exception as e:
                print(f"⚠️ Migración feedback_admin: {e}")

        # 4. Crear tabla employee_capsules si no existe
        tables = inspector.get_table_names()
        if 'employee_capsules' not in tables:
            try:
                conn.execute(text("""
                    CREATE TABLE employee_capsules (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        employee_id INTEGER NOT NULL,
                        capsule_id INTEGER NOT NULL,
                        UNIQUE(employee_id, capsule_id),
                        FOREIGN KEY(employee_id) REFERENCES employees(id),
                        FOREIGN KEY(capsule_id) REFERENCES capsules(id)
                    )
                """))
                conn.commit()
                print("✅ Migración: tabla employee_capsules creada")
            except Exception as e:
                print(f"⚠️ Migración employee_capsules: {e}")

        # 5. Agregar mission_values a users si no existe
        user_cols = [c['name'] for c in inspector.get_columns('users')]
        if 'mission_values' not in user_cols:
            try:
                conn.execute(text("ALTER TABLE users ADD COLUMN mission_values TEXT"))
                conn.commit()
                print("✅ Migración: columna mission_values agregada a users")
            except Exception as e:
                print(f"⚠️ Migración mission_values: {e}")

        # 6. Agregar duration_seconds a chat_sessions si no existe
        ses_cols = [c['name'] for c in inspector.get_columns('chat_sessions')]
        if 'duration_seconds' not in ses_cols:
            try:
                conn.execute(text("ALTER TABLE chat_sessions ADD COLUMN duration_seconds INTEGER DEFAULT 0"))
                conn.commit()
                print("✅ Migración: columna duration_seconds agregada a chat_sessions")
            except Exception as e:
                print(f"⚠️ Migración duration_seconds: {e}")

run_migrations()

app = FastAPI(title="ONE Commercial AI")

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- MODELOS PYDANTIC ---
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    company_name: str
    phone: str = ""
    mission_values: str = ""

class UserUpdate(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    company_name: Optional[str] = None
    phone: Optional[str] = None
    mission_values: Optional[str] = None

class StatusUpdate(BaseModel):
    is_active: bool

class CapsuleReq(BaseModel):
    title: str
    description: str

class ContentReq(BaseModel):
    title: str
    url: str
    type: str
    capsule_id: int

class EmployeeReq(BaseModel):
    name: str
    email: str
    password: str
    role: str = "Vendedor"

class ProductReq(BaseModel):
    name: str
    info: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    info: Optional[str] = None

class PrototypeReq(BaseModel):
    name: str
    description: str
    objection: str
    product_id: int

class ChatInit(BaseModel):
    employee_id: int
    prototype_id: int

class ChatMsg(BaseModel):
    session_id: int
    message: str

# ✅ FIX: FeedbackReq ahora incluye duration_seconds
class FeedbackReq(BaseModel):
    session_id: int
    duration_seconds: Optional[int] = 0

class ChatMsgConImagen(BaseModel):
    session_id: int
    message: str
    image_b64: Optional[str] = None
    media_type: Optional[str] = None


# ============================================================
# AUTH
# ============================================================
@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    if data.email == "admin@salesai.com" and data.password == "admin":
        return {"type": "super_admin", "id": 0, "name": "Super Admin", "is_super_admin": True}

    company = db.query(User).filter(User.email == data.email).first()
    if company and company.hashed_password == data.password:
        if not company.is_active and not company.is_super_admin:
            raise HTTPException(403, "Cuenta deshabilitada. Contacte a soporte.")
        return {
            "type": "company",
            "id": company.id,
            "name": company.company_name,
            "is_super_admin": company.is_super_admin
        }

    emp = db.query(Employee).filter(Employee.email == data.email).first()
    if emp and emp.password == data.password:
        if not emp.company.is_active:
            raise HTTPException(403, "Empresa deshabilitada.")
        return {
            "type": "employee",
            "id": emp.id,
            "name": emp.name,
            "company_id": emp.company_id
        }

    raise HTTPException(status_code=401, detail="Credenciales inválidas")


@app.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="El email ya existe")
    db.add(User(
        email=data.email,
        hashed_password=data.password,
        visible_password=data.password,
        company_name=data.company_name,
        phone=data.phone,
        mission_values=data.mission_values,
        is_active=True
    ))
    db.commit()
    return {"status": "ok"}


# ============================================================
# SUPER ADMIN — EMPRESAS
# ============================================================
@app.get("/companies")
def list_companies(db: Session = Depends(get_db)):
    return db.query(User).filter(User.is_super_admin == False).all()


@app.put("/users/{id}/status")
def toggle_status(id: int, status: StatusUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(404, "Usuario no encontrado")
    user.is_active = status.is_active
    db.commit()
    return {"status": "ok"}


@app.put("/users/{id}")
def update_user(id: int, data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(404, "Usuario no encontrado")
    if data.email:
        user.email = data.email
    if data.company_name:
        user.company_name = data.company_name
    if data.phone is not None:
        user.phone = data.phone
    if data.mission_values is not None:
        user.mission_values = data.mission_values
    if data.password and len(data.password) > 0:
        user.hashed_password = data.password
        user.visible_password = data.password
    db.commit()
    return {"status": "updated"}


@app.delete("/users/{id}")
def del_user(id: int, db: Session = Depends(get_db)):
    employees = db.query(Employee).filter(Employee.company_id == id).all()
    for emp in employees:
        sessions = db.query(ChatSession).filter(ChatSession.employee_id == emp.id).all()
        for s in sessions:
            db.query(ChatMessage).filter(ChatMessage.session_id == s.id).delete()
        db.query(ChatSession).filter(ChatSession.employee_id == emp.id).delete()
    db.query(Employee).filter(Employee.company_id == id).delete()
    products = db.query(Product).filter(Product.company_id == id).all()
    for p in products:
        db.query(ClientPrototype).filter(ClientPrototype.product_id == p.id).delete()
    db.query(Product).filter(Product.company_id == id).delete()
    db.query(User).filter(User.id == id).delete()
    db.commit()
    return {"status": "ok"}


# ============================================================
# CÁPSULAS
# ============================================================
@app.get("/capsules")
def get_capsules(db: Session = Depends(get_db)):
    caps = db.query(Capsule).all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "contents": [
                {"id": ct.id, "title": ct.title, "url": ct.url, "type": ct.type}
                for ct in c.contents
            ]
        }
        for c in caps
    ]


@app.post("/capsules")
def create_capsule(data: CapsuleReq, db: Session = Depends(get_db)):
    db.add(Capsule(**data.dict()))
    db.commit()
    return {"status": "ok"}


@app.delete("/capsules/{id}")
def delete_capsule(id: int, db: Session = Depends(get_db)):
    db.query(CapsuleContent).filter(CapsuleContent.capsule_id == id).delete()
    db.query(Capsule).filter(Capsule.id == id).delete()
    db.commit()
    return {"status": "ok"}


@app.post("/contents")
def create_content(data: ContentReq, db: Session = Depends(get_db)):
    db.add(CapsuleContent(**data.dict()))
    db.commit()
    return {"status": "ok"}


@app.delete("/contents/{id}")
def delete_content(id: int, db: Session = Depends(get_db)):
    db.query(CapsuleContent).filter(CapsuleContent.id == id).delete()
    db.commit()
    return {"status": "ok"}


# ============================================================
# ADMIN EMPRESA — EMPLEADOS
# ============================================================
@app.post("/company/{id}/employees")
def create_employee(id: int, data: EmployeeReq, db: Session = Depends(get_db)):
    if db.query(Employee).filter(Employee.email == data.email).first():
        raise HTTPException(400, "El email ya existe")
    db.add(Employee(
        name=data.name,
        email=data.email,
        password=data.password,
        visible_password=data.password,
        role=data.role,
        company_id=id
    ))
    db.commit()
    return {"status": "ok"}


@app.get("/company/{id}/employees")
def get_employees(id: int, db: Session = Depends(get_db)):
    emps = db.query(Employee).filter(Employee.company_id == id).all()
    result = []
    for e in emps:
        sessions = db.query(ChatSession).filter(ChatSession.employee_id == e.id).all()
        scores = [s.score for s in sessions if s.score is not None]
        result.append({
            "id": e.id,
            "name": e.name,
            "email": e.email,
            "role": e.role,
            "sessions_count": len(sessions),
            "avg_score": round(sum(scores) / len(scores), 1) if scores else None
        })
    return result


@app.delete("/company/{company_id}/employees/{emp_id}")
def delete_employee(company_id: int, emp_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == emp_id, Employee.company_id == company_id).first()
    if not emp:
        raise HTTPException(404, "Empleado no encontrado")
    sessions = db.query(ChatSession).filter(ChatSession.employee_id == emp_id).all()
    for s in sessions:
        db.query(ChatMessage).filter(ChatMessage.session_id == s.id).delete()
    db.query(ChatSession).filter(ChatSession.employee_id == emp_id).delete()
    db.delete(emp)
    db.commit()
    return {"status": "ok"}


# ============================================================
# ADMIN EMPRESA — PRODUCTOS Y PROTOTIPOS
# ============================================================
@app.post("/company/{id}/products")
def create_product(id: int, data: ProductReq, db: Session = Depends(get_db)):
    db.add(Product(name=data.name, info=data.info, company_id=id))
    db.commit()
    return {"status": "ok"}


@app.get("/company/{id}/products")
def get_products(id: int, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.company_id == id).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "info": p.info or "",
            "prototypes": [
                {
                    "id": pr.id,
                    "name": pr.name,
                    "description": pr.description,
                    "objection": pr.objection
                }
                for pr in p.prototypes
            ]
        }
        for p in products
    ]


@app.put("/products/{id}")
def update_product(id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    prod = db.query(Product).filter(Product.id == id).first()
    if not prod:
        raise HTTPException(404, "Producto no encontrado")
    if data.name is not None:
        prod.name = data.name
    if data.info is not None:
        prod.info = data.info
    db.commit()
    return {"status": "ok"}


@app.delete("/company/{company_id}/products/{product_id}")
def delete_product(company_id: int, product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.company_id == company_id).first()
    if not product:
        raise HTTPException(404, "Producto no encontrado")
    db.query(ClientPrototype).filter(ClientPrototype.product_id == product_id).delete()
    db.delete(product)
    db.commit()
    return {"status": "ok"}


@app.post("/prototypes")
def create_prototype(data: PrototypeReq, db: Session = Depends(get_db)):
    db.add(ClientPrototype(
        name=data.name,
        description=data.description,
        objection=data.objection,
        product_id=data.product_id
    ))
    db.commit()
    return {"status": "ok"}


@app.delete("/prototypes/{id}")
def delete_prototype(id: int, db: Session = Depends(get_db)):
    db.query(ClientPrototype).filter(ClientPrototype.id == id).delete()
    db.commit()
    return {"status": "ok"}


# ============================================================
# CHAT CON IA
# ============================================================
@app.post("/chat/start")
def start_chat(data: ChatInit, db: Session = Depends(get_db)):
    prototype = db.query(ClientPrototype).filter(ClientPrototype.id == data.prototype_id).first()
    if not prototype:
        raise HTTPException(404, "Prototipo no encontrado")

    product = db.query(Product).filter(Product.id == prototype.product_id).first()

    session = ChatSession(employee_id=data.employee_id)
    db.add(session)
    db.commit()
    db.refresh(session)

    agent_name = prototype.name
    product_name = product.name if product else 'un producto'
    product_info_section = ""
    if product and product.info:
        product_info_section = f"\nINFORMACIÓN DEL PRODUCTO (usala SOLO para hacer preguntas como cliente, NUNCA para explicarla):\n{product.info}\n"

    # ✅ FIX PRINCIPAL: System prompt reforzado para evitar que la IA asuma rol de vendedor
    # y para que el cliente sea más realista (menos cortés, más directo)
    system_prompt = f"""════════════════════════════════════════
ROL ÚNICO E IRROMPIBLE: ERES EL CLIENTE
════════════════════════════════════════

Tu nombre es {agent_name}. Estás evaluando comprar: {product_name}.
Tu perfil: {prototype.description}
Tu objeción principal: {prototype.objection}
{product_info_section}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔ REGLA ABSOLUTA — NUNCA VIOLAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TU ÚNICO ROL ES SER EL CLIENTE. No eres vendedor, no eres asistente, no eres coach.
NUNCA preguntes "¿Te gustaría avanzar con la compra?" — eso lo pregunta el vendedor, NO el cliente.
NUNCA ofrezcas ayuda. NUNCA resumas lo conversado. NUNCA cerrés la venta vos.
NUNCA uses frases de vendedor: "Estoy aquí para ayudarte", "¿En qué más puedo asesorarte?", "Te puedo orientar".

Si en algún momento detectás que estás respondiendo como vendedor → DETENÉ esa respuesta y reescribila como cliente.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ LO QUE HACÉS COMO CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Preguntás sobre el producto
- Dudás, comparás, pedís aclaraciones
- Reaccionás a lo que te dice el vendedor (con interés, escepticismo, dudas)
- Podés decidir comprar, postergar o rechazar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗣️ PERSONALIDAD REALISTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sos una persona real, NO un asistente educado.
- NO decís "¡Gracias por la información!" después de cada respuesta
- NO repetís lo que el vendedor dijo antes de preguntar
- Podés ser directo, impaciente, escéptico o indiferente según la situación
- Si el vendedor no respondió bien, lo notás y lo presionás
- Si el vendedor fue bueno, mostrás más interés
- Respuestas cortas y directas: 1-3 oraciones máximo
- Español rioplatense informal: "¿cuánto sale?", "¿tiene garantía?", "no entendí eso"

EJEMPLOS DE RESPUESTAS CORRECTAS:
✅ "¿Y el precio cuál es?"
✅ "No me convence eso, ¿tenés algo más concreto?"
✅ "Está bien, pero necesito pensarlo."
✅ "¿Me podés mandar algo por escrito?"

EJEMPLOS PROHIBIDOS:
❌ "¡Gracias por la información tan detallada!"
❌ "Entiendo perfectamente lo que me explicás."
❌ "¿Te gustaría avanzar con la compra?"
❌ "Estoy aquí para ayudarte en lo que necesites."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJETIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Poner a prueba al vendedor. Observar si explica bien, responde preguntas, maneja objeciones y genera confianza.
La conversación puede terminar en compra, duda, postergación o rechazo. Cualquier resultado es válido."""

    initial_prompt = f"Iniciá la conversación como {agent_name}, un cliente que contacta al vendedor. Tu primer mensaje debe ser breve y directo, preguntando por información básica sobre {product_name}. Solo el mensaje del cliente, sin saludos elaborados."

    initial_msg = obtener_respuesta_coach(
        historial=[{"role": "user", "content": initial_prompt}],
        configuracion_sistema=system_prompt
    )

    db.add(ChatMessage(session_id=session.id, role="system", content=system_prompt))
    db.add(ChatMessage(session_id=session.id, role="assistant", content=initial_msg))
    db.commit()

    return {
        "session_id": session.id,
        "initial_message": initial_msg,
        "agent_name": agent_name
    }


@app.post("/chat/message")
def send_message(data: ChatMsg, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == data.session_id).first()
    if not session:
        raise HTTPException(404, "Sesión no encontrada")

    all_messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == data.session_id
    ).order_by(ChatMessage.id).all()

    system_prompt = ""
    historial = []
    for m in all_messages:
        if m.role == "system":
            system_prompt = m.content
        else:
            historial.append({"role": m.role, "content": m.content})

    historial.append({"role": "user", "content": data.message})

    delay = random.uniform(30, 60)
    time.sleep(delay)
    response = obtener_respuesta_coach(historial=historial, configuracion_sistema=system_prompt)

    db.add(ChatMessage(session_id=data.session_id, role="user", content=data.message))
    db.add(ChatMessage(session_id=data.session_id, role="assistant", content=response))
    db.commit()

    return {"response": response}


@app.post("/chat/message-with-image")
def send_message_with_image(data: ChatMsgConImagen, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == data.session_id).first()
    if not session:
        raise HTTPException(404, "Sesión no encontrada")

    all_messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == data.session_id
    ).order_by(ChatMessage.id).all()

    system_prompt = ""
    historial = []
    for m in all_messages:
        if m.role == "system":
            system_prompt = m.content
        else:
            historial.append({"role": m.role, "content": m.content})

    historial.append({"role": "user", "content": data.message or "[imagen compartida]"})

    response = obtener_respuesta_coach_con_imagen(
        historial=historial,
        configuracion_sistema=system_prompt,
        imagen_b64=data.image_b64,
        media_type=data.media_type or "image/jpeg"
    )

    db.add(ChatMessage(session_id=data.session_id, role="user", content=data.message or "[imagen compartida]"))
    db.add(ChatMessage(session_id=data.session_id, role="assistant", content=response))
    db.commit()

    return {"response": response}


@app.post("/chat/feedback")
def get_feedback(data: FeedbackReq, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == data.session_id).first()
    if not session:
        raise HTTPException(404, "Sesión no encontrada")

    all_messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == data.session_id,
        ChatMessage.role != "system"
    ).order_by(ChatMessage.id).all()

    historial = [{"role": m.role, "content": m.content} for m in all_messages]

    if len(historial) < 2:
        return {"feedback": "La conversación fue muy corta para evaluarla.", "score": 0}

    employee = db.query(Employee).filter(Employee.id == session.employee_id).first()
    nombre_vendedor = employee.name if employee else "el vendedor"

    # ✅ Recuperar misión y valores de la empresa para el informe admin
    mission_values = ""
    if employee and employee.company_id:
        company = db.query(User).filter(User.id == employee.company_id).first()
        if company and company.mission_values:
            mission_values = company.mission_values

    # ✅ FIX: duration_seconds ahora se guarda en la sesión y se pasa al informe admin
    duration_seconds = data.duration_seconds or 0

    # Recuperar nombre del producto y prototipo desde el system prompt
    nombre_producto = ""
    nombre_prototipo = ""
    system_msg = db.query(ChatMessage).filter(
        ChatMessage.session_id == data.session_id,
        ChatMessage.role == "system"
    ).first()
    if system_msg:
        if "evaluando comprar:" in system_msg.content:
            try:
                nombre_producto = system_msg.content.split("evaluando comprar:")[1].split("\n")[0].strip().rstrip(".")
            except:
                pass
        if "Tu nombre es" in system_msg.content:
            try:
                nombre_prototipo = system_msg.content.split("Tu nombre es")[1].split(".")[0].strip()
            except:
                pass

    feedback_vendedor = generar_evaluacion_vendedor(historial)
    feedback_admin = generar_evaluacion_admin(historial, nombre_vendedor, duration_seconds, mission_values, nombre_producto, nombre_prototipo)

    score = 5
    for line in feedback_vendedor.split("\n"):
        if "CALIFICACIÓN:" in line or "CALIFICACION:" in line:
            try:
                score = int(''.join(filter(str.isdigit, line.split(":")[-1].strip()))[:2])
                score = min(max(score, 1), 10)
            except:
                pass

    session.feedback = feedback_vendedor
    session.feedback_admin = feedback_admin
    session.score = score
    # ✅ Guardar duration_seconds en la sesión si el modelo lo tiene
    if hasattr(session, 'duration_seconds'):
        session.duration_seconds = duration_seconds
    db.commit()

    return {
        "feedback": feedback_vendedor,
        "feedback_admin": feedback_admin,
        "score": score
    }


# ============================================================
# CHAT — ARCHIVOS Y AUDIO
# ============================================================
@app.post("/chat/image")
async def chat_image(session_id: int = Form(...), file: UploadFile = File(...)):
    contents = await file.read()
    b64 = base64.b64encode(contents).decode("utf-8")
    media_type = file.content_type or "image/jpeg"
    return {"type": "image", "b64": b64, "media_type": media_type}


@app.post("/chat/pdf")
async def chat_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name
    try:
        doc = fitz.open(tmp_path)
        text = "\n".join(page.get_text() for page in doc)
        doc.close()
    finally:
        os.unlink(tmp_path)
    if not text.strip():
        raise HTTPException(400, "No se pudo extraer texto del PDF")
    return {"type": "pdf", "text": text[:4000]}


@app.post("/chat/audio")
async def chat_audio(file: UploadFile = File(...)):
    contents = await file.read()
    if len(contents) < 1000:
        raise HTTPException(400, "Audio demasiado corto. Mantené presionado más tiempo.")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name
    try:
        client = OpenAI()
        with open(tmp_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="es"
            )
        text = transcript.text
    finally:
        os.unlink(tmp_path)
    return {"type": "audio", "text": text}


@app.delete("/sessions/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(404, "Sesión no encontrada")
    db.query(ChatMessage).filter(ChatMessage.session_id == session_id).delete()
    db.delete(session)
    db.commit()
    return {"status": "ok"}


@app.get("/employees/{id}/stats")
def get_employee_stats(id: int, db: Session = Depends(get_db)):
    sessions = db.query(ChatSession).filter(ChatSession.employee_id == id).all()
    result = []
    for s in sessions:
        result.append({
            "id": s.id,
            "date": s.date.isoformat() if s.date else None,
            "score": s.score,
            "feedback": s.feedback
        })
    return result


# ============================================================
# PERFIL DEL VENDEDOR — ADMIN EMPRESA
# ============================================================
@app.get("/employees/{id}/profile")
def get_employee_profile(id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == id).first()
    if not emp:
        raise HTTPException(404, "Empleado no encontrado")

    sessions = db.query(ChatSession).filter(ChatSession.employee_id == id).order_by(ChatSession.date.desc()).all()
    sessions_data = []
    for s in sessions:
        messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == s.id,
            ChatMessage.role != "system"
        ).order_by(ChatMessage.id).all()
        sessions_data.append({
            "id": s.id,
            "date": s.date.isoformat() if s.date else None,
            "score": s.score,
            "feedback": s.feedback,
            "feedback_admin": s.feedback_admin,
            "duration_seconds": getattr(s, 'duration_seconds', 0),
            "messages": [{"role": m.role, "content": m.content} for m in messages]
        })

    assigned_ids = {a.capsule_id for a in emp.capsule_assignments}

    return {
        "id": emp.id,
        "name": emp.name,
        "email": emp.email,
        "visible_password": emp.visible_password or emp.password,
        "role": emp.role,
        "sessions": sessions_data,
        "assigned_capsule_ids": list(assigned_ids)
    }


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


@app.put("/employees/{id}")
def update_employee(id: int, data: EmployeeUpdate, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == id).first()
    if not emp:
        raise HTTPException(404, "Empleado no encontrado")
    if data.name:
        emp.name = data.name
    if data.email:
        emp.email = data.email
    if data.password and len(data.password) > 0:
        emp.password = data.password
        emp.visible_password = data.password
    db.commit()
    return {"status": "updated"}


class CapsuleAssignReq(BaseModel):
    capsule_id: int
    assign: bool


@app.post("/employees/{id}/capsules")
def toggle_capsule_assignment(id: int, data: CapsuleAssignReq, db: Session = Depends(get_db)):
    existing = db.query(EmployeeCapsule).filter(
        EmployeeCapsule.employee_id == id,
        EmployeeCapsule.capsule_id == data.capsule_id
    ).first()

    if data.assign and not existing:
        db.add(EmployeeCapsule(employee_id=id, capsule_id=data.capsule_id))
        db.commit()
    elif not data.assign and existing:
        db.delete(existing)
        db.commit()

    return {"status": "ok"}


@app.get("/employees/{id}/capsules")
def get_employee_capsules(id: int, db: Session = Depends(get_db)):
    assignments = db.query(EmployeeCapsule).filter(EmployeeCapsule.employee_id == id).all()
    result = []
    for a in assignments:
        cap = db.query(Capsule).filter(Capsule.id == a.capsule_id).first()
        if cap:
            result.append({
                "id": cap.id,
                "title": cap.title,
                "description": cap.description,
                "contents": [
                    {"id": ct.id, "title": ct.title, "url": ct.url, "type": ct.type}
                    for ct in cap.contents
                ]
            })
    return result