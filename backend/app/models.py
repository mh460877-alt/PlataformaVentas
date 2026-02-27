from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

# --- EMPRESA (CLIENTE SaaS) ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    visible_password = Column(String)
    company_name = Column(String)
    phone = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_super_admin = Column(Boolean, default=False)

    employees = relationship("Employee", back_populates="company", cascade="all, delete")
    products = relationship("Product", back_populates="company", cascade="all, delete")

# --- EMPLEADO (VENDEDOR) ---
class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    visible_password = Column(String, nullable=True)  # Para que el admin la vea
    role = Column(String, default="Vendedor")
    company_id = Column(Integer, ForeignKey("users.id"))

    company = relationship("User", back_populates="employees")
    chat_sessions = relationship("ChatSession", back_populates="employee", cascade="all, delete")
    capsule_assignments = relationship("EmployeeCapsule", back_populates="employee", cascade="all, delete")

# --- ASIGNACIÓN CÁPSULAS A EMPLEADOS ---
class EmployeeCapsule(Base):
    __tablename__ = "employee_capsules"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    capsule_id = Column(Integer, ForeignKey("capsules.id"))
    __table_args__ = (UniqueConstraint('employee_id', 'capsule_id', name='uq_emp_cap'),)

    employee = relationship("Employee", back_populates="capsule_assignments")
    capsule = relationship("Capsule")

# --- PRODUCTOS Y PROTOTIPOS ---
class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    info = Column(Text, nullable=True)   # Información técnica del producto
    company_id = Column(Integer, ForeignKey("users.id"))

    company = relationship("User", back_populates="products")
    prototypes = relationship("ClientPrototype", back_populates="product", cascade="all, delete")

class ClientPrototype(Base):
    __tablename__ = "client_prototypes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    objection = Column(String)
    product_id = Column(Integer, ForeignKey("products.id"))

    product = relationship("Product", back_populates="prototypes")

# --- CÁPSULAS Y CONTENIDOS ---
class Capsule(Base):
    __tablename__ = "capsules"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)

    contents = relationship("CapsuleContent", back_populates="capsule", cascade="all, delete")

class CapsuleContent(Base):
    __tablename__ = "capsule_contents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    url = Column(String)
    type = Column(String)  # video/pdf
    capsule_id = Column(Integer, ForeignKey("capsules.id"))

    capsule = relationship("Capsule", back_populates="contents")

# --- HISTORIAL DE CHAT ---
class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    date = Column(DateTime, default=datetime.utcnow)
    score = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)           # Informe para el vendedor
    feedback_admin = Column(Text, nullable=True)     # Informe extendido para el admin

    employee = relationship("Employee", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    role = Column(String)
    content = Column(Text)

    session = relationship("ChatSession", back_populates="messages")