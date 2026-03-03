import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Bot, CheckCircle, ArrowRight, Lock, User,
  Settings, Save, Send, LogOut, Building, Plus, X, Trash2,
  Award, FileText, Zap, LayoutDashboard, Users, Package, PlayCircle, Folder, Eye, ChevronRight,
  BrainCircuit, Layers, Target, ArrowLeft, Upload, Search, RefreshCw, Power, Edit2, Phone, EyeOff,
  MessageSquare, Star, BarChart2, BookOpen, TrendingUp
} from 'lucide-react';

import logoIconNegro from './assets/Logo-negro.png';
import logoIconBlanco from './assets/Logo-blanco.png';

const APP_NAME = "ONE Commercial AI";
const COLORS = {
  black: "#1a181d", white: "#fefeff", pink: "#e17bd7",
  cyan: "#6be1e3", gold: "#e4c76a", gray: "#a4a8c0",
  gradient_text: "bg-clip-text text-transparent bg-gradient-to-r from-[#6be1e3] via-[#e17bd7] to-[#e4c76a]"
};
const API_URL = 'https://plataformaventas.onrender.com';

// --- COMPONENTE LOGO ---
const LogoOne = ({ small }) => (
  <div className="flex items-center select-none">
    <img
      src={logoIconNegro}
      alt="ONE Commercial IA"
      className={`${small ? 'h-14' : 'h-20'} w-auto object-contain`}
    />
  </div>
);

const LogoOneWhite = ({ small }) => (
  <div className="flex items-center select-none">
    <img
      src={logoIconBlanco}
      alt="ONE Commercial IA"
      className={`${small ? 'h-14' : 'h-20'} w-auto object-contain`}
    />
  </div>
);


// ============================================================
// LANDING PAGE
// ============================================================
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden flex flex-col" style={{ backgroundColor: COLORS.white }}>
      {/* Gradientes decorativos de fondo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#e17bd7]/10 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-[#6be1e3]/10 to-transparent rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full relative z-20">
        <LogoOne />
        <button 
          onClick={() => navigate('/login')} 
          className="px-6 py-2 rounded-full font-bold text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 text-sm" 
          style={{ backgroundColor: COLORS.black }}
        >
          Ingresar
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 w-full max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16 mt-8">
          <div className="inline-block px-3 py-1 mb-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase border border-slate-200 rounded-full">
            Ecosistema ONE | Human-Tech
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-[#1a181d]">
            Sistema Integral de Inteligencia y<br />
            <span className={COLORS.gradient_text}>Entrenamiento Comercial</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            ONE Commercial AI es la infraestructura tecnológica que tu empresa necesita para asegurar la calidad de cada interacción. 
            Desde un panel de gestión centralizado, diseña productos y prototipos de clientes, audita conversaciones con métricas precisas 
            y distribuye conocimiento estratégico. Ofrece a tu equipo un entrenamiento especializado con feedback instantáneo, diseñado 
            para perfeccionar las habilidades.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="text-white px-8 py-4 rounded-xl text-base font-bold shadow-xl transition-all hover:scale-105 flex items-center mx-auto gap-2 group"
            style={{ background: `linear-gradient(90deg, ${COLORS.cyan} 0%, ${COLORS.pink} 100%)` }}
          >
            Comenzar Ahora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 w-full mb-16">
          {/* Simulación */}
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6be1e3]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${COLORS.cyan}15`, color: COLORS.cyan }}>
                <BrainCircuit size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a181d]">Simulación de Escenarios</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4 font-semibold">
                Entrenamiento inmersivo con agentes de IA de última generación.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Esta herramienta permite a su equipo interactuar con clientes virtuales que poseen personalidades dinámicas y objeciones complejas. 
                A través de un entorno que replica situaciones reales de presión y negociación, el vendedor puede perfeccionar su discurso y manejo 
                de objeciones. El sistema permite al administrador configurar perfiles de clientes específicos para cada producto, asegurando que el 
                equipo esté preparado para cualquier desafío comercial que ocurra en la vida real.
              </p>
            </div>
          </div>

          {/* Cápsulas */}
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e17bd7]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${COLORS.pink}15`, color: COLORS.pink }}>
                <Layers size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a181d]">Cápsulas de Conocimiento</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4 font-semibold">
                Estandarización de técnicas y excelencia comercial.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Potencia el aprendizaje continuo con una biblioteca digital estratégica. Las cápsulas permiten centralizar videoclases, materiales 
                de estudio, manuales técnicos y guías de mejores prácticas comerciales. El administrador tiene el control total para habilitar 
                contenidos específicos según las áreas de mejora detectadas en cada colaborador, garantizando que el equipo comercial cuente con 
                las herramientas teóricas y metodológicas necesarias para dominar su mercado.
              </p>
            </div>
          </div>

          {/* Analítica */}
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e4c76a]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${COLORS.gold}15`, color: COLORS.gold }}>
                <Target size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a181d]">Analítica y Devolución</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4 font-semibold">
                Auditoría de desempeño y hoja de ruta para mejorar performance.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Transforma cada conversación en datos accionables para el crecimiento. Al finalizar cada sesión, el sistema genera un informe 
                detallado que mide KPIs clave de la venta. Más allá de un simple puntaje, el colaborador y el evaluador reciben un análisis 
                detallado del asesoramiento: qué puntos se resolvieron con éxito, qué áreas presentan debilidades y, fundamentalmente, recomendaciones 
                personalizadas de técnicas de cierre y comunicación para elevar la efectividad comercial de forma inmediata.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-xs border-t border-slate-50 bg-white relative z-10">
        © 2026 ONE Commercial AI. Sistema Integral de Inteligencia y Entrenamiento Comercial.
      </footer>
    </div>
  );
}


// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // SuperAdmin local
    if (formData.email === 'admin@salesai.com' && formData.password === 'admin') {
      navigate('/super-admin');
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      localStorage.setItem('user', JSON.stringify(res.data));
      if (res.data.type === 'company') navigate('/company-dashboard');
      else navigate('/employee-portal');
    } catch (err) {
      setError(err.response?.data?.detail || "Credenciales incorrectas o cuenta inactiva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fefeff] relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6be1e3] via-[#e17bd7] to-[#e4c76a]"></div>
      <div className="w-full max-w-md p-10 bg-white shadow-2xl rounded-3xl border border-slate-100 relative z-10">
        <div className="text-center mb-8 flex flex-col items-center justify-center">
          <LogoOne />
          <h2 className="text-2xl font-bold mt-6 text-[#1a181d]">Bienvenido</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#e17bd7] transition text-sm text-[#1a181d]"
            placeholder="Correo Corporativo"
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#6be1e3] transition text-sm text-[#1a181d]"
            type="password"
            placeholder="Contraseña"
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
          {error && <div className="p-3 bg-red-50 text-red-500 text-center text-xs rounded-lg border border-red-100">{error}</div>}
          <button
            disabled={loading}
            className="w-full p-4 text-white rounded-xl font-bold hover:opacity-90 transition shadow-lg mt-2 text-sm uppercase tracking-wide disabled:opacity-50"
            style={{ backgroundColor: COLORS.black }}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}


// ============================================================
// SUPER ADMIN
// ============================================================
function SuperAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('empresas');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [capsules, setCapsules] = useState([]);
  const [currentCapsule, setCurrentCapsule] = useState(null);
  const [searchCapsule, setSearchCapsule] = useState('');
  const [modalCapsule, setModalCapsule] = useState(false);
  const [modalContent, setModalContent] = useState(false);
  const [newCompany, setNewCompany] = useState({ company_name: '', email: '', password: '', phone: '' });
  const [editingCompany, setEditingCompany] = useState({ id: 0, company_name: '', email: '', password: '', phone: '' });
  const [newCap, setNewCap] = useState({ title: '', description: '' });
  const [newContent, setNewContent] = useState({ title: '', url: '', type: 'video', capsule_id: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const resEmp = await axios.get(`${API_URL}/companies`);
      setEmpresas(Array.isArray(resEmp.data) ? resEmp.data : []);
      const resCap = await axios.get(`${API_URL}/capsules`);
      setCapsules(Array.isArray(resCap.data) ? resCap.data : []);
    } catch (e) { console.error("Error cargando datos:", e); }
  };

  const handleCreateCompany = async () => {
    if (!newCompany.company_name || !newCompany.email || !newCompany.password) return alert("Completa los campos obligatorios");
    try {
      await axios.post(`${API_URL}/register`, newCompany);
      setShowModal(false);
      loadData();
      setNewCompany({ company_name: '', email: '', password: '', phone: '' });
    } catch (e) { alert("Error: " + (e.response?.data?.detail || "Error desconocido")); }
  };

  const prepareEdit = (emp) => {
    setEditingCompany({ id: emp.id, company_name: emp.company_name, email: emp.email, phone: emp.phone || '', password: '' });
    setShowEditModal(true);
  };

  const handleUpdateCompany = async () => {
    try {
      await axios.put(`${API_URL}/users/${editingCompany.id}`, editingCompany);
      setShowEditModal(false);
      loadData();
    } catch { alert("Error al actualizar"); }
  };

  const toggleStatus = async (id, current) => {
    try { await axios.put(`${API_URL}/users/${id}/status`, { is_active: !current }); loadData(); }
    catch { alert("Error cambiando estado"); }
  };

  const deleteCompany = async (id) => {
    if (confirm("¿Eliminar esta empresa y TODOS sus datos?")) {
      try { await axios.delete(`${API_URL}/users/${id}`); loadData(); }
      catch { alert("Error al eliminar"); }
    }
  };

  const handleCreateCapsule = async () => {
    if (!newCap.title) return alert("Falta título");
    try { await axios.post(`${API_URL}/capsules`, newCap); setModalCapsule(false); loadData(); setNewCap({ title: '', description: '' }); }
    catch { alert("Error al crear cápsula"); }
  };

  const handleAddContent = async () => {
    if (!newContent.title || !newContent.url) return alert("Faltan datos");
    try {
      await axios.post(`${API_URL}/contents`, { ...newContent, capsule_id: currentCapsule.id });
      setModalContent(false);
      const resCap = await axios.get(`${API_URL}/capsules`);
      setCapsules(resCap.data);
      const updatedCap = resCap.data.find(c => c.id === currentCapsule.id);
      if (updatedCap) setCurrentCapsule(updatedCap);
      setNewContent({ title: '', url: '', type: 'video', capsule_id: '' });
    } catch { alert("Error al subir contenido"); }
  };

  const deleteCap = async (id) => {
    if (confirm("¿Borrar cápsula y todo su contenido?")) { await axios.delete(`${API_URL}/capsules/${id}`); loadData(); }
  };

  const deleteCont = async (id) => {
    if (confirm("¿Borrar este archivo?")) {
      await axios.delete(`${API_URL}/contents/${id}`);
      const resCap = await axios.get(`${API_URL}/capsules`);
      setCapsules(resCap.data);
      const updatedCap = resCap.data.find(c => c.id === currentCapsule.id);
      if (updatedCap) setCurrentCapsule(updatedCap);
    }
  };

  const CompaniesView = () => {
    const [showPass, setShowPass] = useState({});
    return (
      <div>
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Gestión de Clientes</h2>
          <button onClick={() => setShowModal(true)} className="bg-[#6be1e3] text-[#1a181d] px-6 py-2 rounded-xl font-bold flex items-center hover:opacity-90 transition shadow-lg">
            <Plus className="mr-2 w-4 h-4" /> Nuevo Cliente
          </button>
        </header>
        <div className="space-y-4">
          {empresas.map(emp => (
            <div key={emp.id} className={`p-6 rounded-3xl border flex justify-between items-center transition group shadow-md ${emp.is_active ? 'bg-slate-800 border-slate-700 hover:border-[#6be1e3]' : 'bg-slate-900 border-red-900 opacity-60'}`}>
              <div className="flex items-center gap-6">
                <div className={`p-3 rounded-xl ${emp.is_active ? 'bg-slate-700 text-[#e17bd7]' : 'bg-red-900/20 text-red-500'}`}><Building /></div>
                <div>
                  <h3 className="font-bold text-xl text-white mb-1 flex items-center gap-2">
                    {emp.company_name}
                    {!emp.is_active && <span className="text-[10px] bg-red-500 px-2 py-0.5 rounded text-white">INACTIVO</span>}
                  </h3>
                  <div className="flex gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><User size={14} /> {emp.email}</span>
                    <span className="flex items-center cursor-pointer hover:text-white" onClick={() => setShowPass({ ...showPass, [emp.id]: !showPass[emp.id] })}>
                      {showPass[emp.id] ? <EyeOff size={14} className="mr-1" /> : <Eye size={14} className="mr-1" />}
                      <span className="font-mono">{showPass[emp.id] ? (emp.visible_password || '******') : '••••••'}</span>
                    </span>
                    {emp.phone && <span className="text-[#6be1e3] flex items-center gap-1"><Phone size={14} /> {emp.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => prepareEdit(emp)} className="p-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition" title="Editar"><Edit2 size={18} /></button>
                <button onClick={() => toggleStatus(emp.id, emp.is_active)} className={`p-3 rounded-xl transition ${emp.is_active ? 'bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white' : 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white'}`} title={emp.is_active ? "Deshabilitar" : "Habilitar"}><Power size={18} /></button>
                <button onClick={() => deleteCompany(emp.id)} className="p-3 bg-slate-700 text-slate-400 rounded-xl hover:bg-red-600 hover:text-white transition" title="Eliminar"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
          {empresas.length === 0 && <div className="text-center p-10 text-slate-500 bg-slate-800/30 rounded-2xl">No hay clientes registrados aún.</div>}
        </div>
      </div>
    );
  };

  const CapsulesAdminView = () => {
    const visibleCapsules = capsules.filter(c => c.title.toLowerCase().includes(searchCapsule.toLowerCase()));
    if (!currentCapsule) return (
      <div>
        <div className="flex justify-between items-center mb-8 gap-4">
          <div className="flex gap-4 items-center bg-slate-800 p-2 rounded-xl px-4 border border-slate-700 flex-1 max-w-md">
            <Search size={20} className="text-slate-400" />
            <input className="bg-transparent outline-none text-white w-full" placeholder="Buscar cápsula..." value={searchCapsule} onChange={e => setSearchCapsule(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setSearchCapsule(''); loadData(); }} className="bg-slate-700 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-600 flex items-center"><RefreshCw size={16} className="mr-2" /> Reiniciar</button>
            <button onClick={() => setModalCapsule(true)} className="bg-[#e17bd7] text-white px-4 py-2 rounded-xl font-bold flex items-center hover:opacity-90 shadow-lg"><Plus size={18} className="mr-2" /> Nueva Cápsula</button>
          </div>
        </div>
        <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-900 text-xs uppercase font-bold text-slate-500">
              <tr><th className="p-6">ID</th><th className="p-6">Cápsula</th><th className="p-6 text-center">Acciones</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {visibleCapsules.map(cap => (
                <tr key={cap.id} className="hover:bg-slate-700/50 transition cursor-pointer" onClick={() => setCurrentCapsule(cap)}>
                  <td className="p-6 font-mono text-[#e4c76a] font-bold">#{cap.id}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <Folder className="text-[#e4c76a]" />
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-lg">{cap.title}</span>
                        <span className="text-xs text-slate-500">{cap.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <button onClick={(e) => { e.stopPropagation(); deleteCap(cap.id); }} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition mx-auto block"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {visibleCapsules.length === 0 && <tr><td colSpan={3} className="p-10 text-center text-slate-500">No hay cápsulas todavía.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );

    return (
      <div>
        <header className="flex items-center justify-between mb-8 bg-slate-800 p-6 rounded-3xl border border-slate-700">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentCapsule(null)} className="p-3 bg-slate-700 rounded-xl hover:bg-white hover:text-black transition"><ArrowLeft /></button>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Carpeta</p>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Folder className="text-[#e4c76a]" /> {currentCapsule.title}</h2>
            </div>
          </div>
          <button onClick={() => setModalContent(true)} className="bg-[#6be1e3] text-[#1a181d] px-6 py-3 rounded-xl font-bold flex items-center hover:opacity-90 shadow-lg"><Upload className="mr-2 w-5 h-5" /> Subir Material</button>
        </header>
        {currentCapsule.contents.length === 0 ? (
          <div className="text-center p-12 text-slate-500 border-2 border-dashed border-slate-700 rounded-3xl">
            Carpeta vacía. Subí el primer archivo.
          </div>
        ) : (
          <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
            <table className="w-full text-left text-slate-300">
              <thead className="bg-slate-900 text-xs uppercase font-bold text-slate-500">
                <tr>
                  <th className="p-5 w-8">#</th>
                  <th className="p-5">
                    <div className="flex items-center gap-2">
                      <PlayCircle size={14} className="text-[#6be1e3]" /> Clase
                    </div>
                  </th>
                  <th className="p-5">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-[#e4c76a]" /> Material
                    </div>
                  </th>
                  <th className="p-5 text-center w-16">Acc.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {(() => {
                  // Emparejar videos con PDFs por orden de carga
                  const videos = currentCapsule.contents.filter(c => c.type === 'video');
                  const pdfs   = currentCapsule.contents.filter(c => c.type === 'pdf');
                  const solo   = currentCapsule.contents.filter(c => c.type !== 'video' && c.type !== 'pdf');
                  const maxRows = Math.max(videos.length, pdfs.length, solo.length === currentCapsule.contents.length ? solo.length : 0);

                  // Si todos son del mismo tipo o mezclados sin par, mostramos fila por fila
                  const rows = [];
                  if (videos.length === 0 && pdfs.length === 0) {
                    // todos son otros tipos
                    solo.forEach((c, i) => rows.push({ idx: i + 1, video: null, pdf: null, other: c }));
                  } else {
                    for (let i = 0; i < maxRows; i++) {
                      rows.push({ idx: i + 1, video: videos[i] || null, pdf: pdfs[i] || null, other: null });
                    }
                  }

                  return rows.map(row => (
                    <tr key={row.idx} className="hover:bg-slate-700/40 transition">
                      <td className="p-5 font-mono text-slate-500 text-sm">{row.idx}</td>

                      {/* Columna CLASE (video) */}
                      <td className="p-5">
                        {row.video ? (
                          <div className="flex items-center gap-3 group/cell">
                            <div className="w-9 h-9 rounded-xl bg-[#6be1e3]/10 flex items-center justify-center flex-shrink-0">
                              <PlayCircle size={18} className="text-[#6be1e3]" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-white text-sm truncate">{row.video.title}</p>
                              <a href={row.video.url} target="_blank" rel="noreferrer"
                                className="text-xs text-[#6be1e3] hover:underline truncate block max-w-[220px]">
                                {row.video.url}
                              </a>
                            </div>
                            <button onClick={() => deleteCont(row.video.id)}
                              className="ml-2 p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover/cell:opacity-100 transition flex-shrink-0">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs italic">—</span>
                        )}
                      </td>

                      {/* Columna MATERIAL (pdf) */}
                      <td className="p-5">
                        {row.pdf ? (
                          <div className="flex items-center gap-3 group/cell">
                            <div className="w-9 h-9 rounded-xl bg-[#e4c76a]/10 flex items-center justify-center flex-shrink-0">
                              <FileText size={18} className="text-[#e4c76a]" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-white text-sm truncate">{row.pdf.title}</p>
                              <a href={row.pdf.url} target="_blank" rel="noreferrer"
                                className="text-xs text-[#e4c76a] hover:underline truncate block max-w-[220px]">
                                {row.pdf.url}
                              </a>
                            </div>
                            <button onClick={() => deleteCont(row.pdf.id)}
                              className="ml-2 p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover/cell:opacity-100 transition flex-shrink-0">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ) : row.other ? (
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
                              <FileText size={18} className="text-slate-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-white text-sm truncate">{row.other.title}</p>
                              <a href={row.other.url} target="_blank" rel="noreferrer"
                                className="text-xs text-slate-400 hover:underline truncate block max-w-[220px]">
                                {row.other.url}
                              </a>
                            </div>
                            <button onClick={() => deleteCont(row.other.id)}
                              className="ml-2 p-1.5 text-slate-600 hover:text-red-400 transition flex-shrink-0">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs italic">—</span>
                        )}
                      </td>

                      <td className="p-5 text-center">
                        {/* fila vacía — borrado individual ya está en cada celda */}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a181d] text-white flex font-sans">
      <aside className="w-80 p-10 border-r border-slate-800 bg-[#1a181d] flex flex-col fixed h-full z-10">
        <div className="mb-12"><LogoOneWhite /></div>
        <div className="mb-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Rol</p>
          <h1 className="text-2xl font-bold text-white">Super Admin</h1>
        </div>
        <nav className="space-y-3 flex-1">
          <button onClick={() => setActiveTab('empresas')} className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center ${activeTab === 'empresas' ? 'bg-[#e17bd7] text-white font-bold shadow-lg translate-x-2' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Building className="mr-3 w-5 h-5" /> Clientes</button>
          <button onClick={() => setActiveTab('capsulas')} className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center ${activeTab === 'capsulas' ? 'bg-[#e4c76a] text-[#1a181d] font-bold shadow-lg translate-x-2' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Folder className="mr-3 w-5 h-5" /> Contenidos</button>
        </nav>
        <button onClick={() => navigate('/login')} className="mt-12 text-red-400 text-sm flex items-center font-bold px-4 py-3 rounded-xl hover:bg-white/5 transition"><LogOut className="w-4 h-4 mr-3" /> Cerrar Sesión</button>
      </aside>
      <main className="flex-1 ml-80 p-12">
        <h2 className="text-4xl font-bold mb-10 tracking-tight">{activeTab === 'empresas' ? 'Gestión de Clientes SaaS' : 'Biblioteca Global'}</h2>
        {activeTab === 'empresas' ? <CompaniesView /> : <CapsulesAdminView />}
      </main>

      {/* MODAL CREAR EMPRESA */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[99999] backdrop-blur-md">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between mb-6"><h3 className="font-bold text-xl text-[#1a181d]">Alta Cliente</h3><button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-black"><X size={20} /></button></div>
            <div className="space-y-4">
              <input className="w-full p-3 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="Nombre Empresa *" onChange={e => setNewCompany({ ...newCompany, company_name: e.target.value })} />
              <input className="w-full p-3 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="Email Admin *" onChange={e => setNewCompany({ ...newCompany, email: e.target.value })} />
              <input className="w-full p-3 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="Teléfono" onChange={e => setNewCompany({ ...newCompany, phone: e.target.value })} />
              <input className="w-full p-3 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-cyan-500 outline-none" type="password" placeholder="Contraseña *" onChange={e => setNewCompany({ ...newCompany, password: e.target.value })} />
              <button onClick={handleCreateCompany} className="w-full bg-[#1a181d] text-white p-3 rounded-lg font-bold hover:opacity-90 mt-2">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR EMPRESA */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[99999] backdrop-blur-md">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between mb-6"><h3 className="font-bold text-xl text-[#1a181d]">Editar Cliente</h3><button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-black"><X size={20} /></button></div>
            <div className="space-y-4">
              <div><label className="text-xs font-bold text-slate-500 uppercase">Nombre</label><input className="w-full p-3 rounded-lg bg-white border border-slate-300 text-black mt-1 outline-none focus:ring-2 focus:ring-cyan-500" value={editingCompany.company_name} onChange={e => setEditingCompany({ ...editingCompany, company_name: e.target.value })} /></div>
              <div><label className="text-xs font-bold text-slate-500 uppercase">Email</label><input className="w-full p-3 rounded-lg bg-white border border-slate-300 text-black mt-1 outline-none focus:ring-2 focus:ring-cyan-500" value={editingCompany.email} onChange={e => setEditingCompany({ ...editingCompany, email: e.target.value })} /></div>
              <div><label className="text-xs font-bold text-slate-500 uppercase">Teléfono</label><input className="w-full p-3 rounded-lg bg-white border border-slate-300 text-black mt-1 outline-none focus:ring-2 focus:ring-cyan-500" value={editingCompany.phone || ''} onChange={e => setEditingCompany({ ...editingCompany, phone: e.target.value })} /></div>
              <div><label className="text-xs font-bold text-slate-500 uppercase">Nueva Clave (dejar vacío para no cambiar)</label><input className="w-full p-3 rounded-lg bg-white border border-slate-300 text-black mt-1 outline-none focus:ring-2 focus:ring-cyan-500" type="password" placeholder="••••••" onChange={e => setEditingCompany({ ...editingCompany, password: e.target.value })} /></div>
              <button onClick={handleUpdateCompany} className="w-full bg-[#6be1e3] text-[#1a181d] p-3 rounded-lg font-bold hover:opacity-90 mt-2">Actualizar Datos</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR CÁPSULA */}
      {modalCapsule && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[99999]">
          <div className="bg-white p-6 rounded-2xl w-96">
            <h3 className="font-bold text-black mb-4 text-xl">Nueva Cápsula</h3>
            <input className="w-full border border-slate-300 p-3 mb-3 rounded-lg text-black focus:ring-2 focus:ring-[#e17bd7] outline-none" placeholder="Título" value={newCap.title} onChange={e => setNewCap({ ...newCap, title: e.target.value })} />
            <input className="w-full border border-slate-300 p-3 mb-6 rounded-lg text-black focus:ring-2 focus:ring-[#e17bd7] outline-none" placeholder="Descripción" value={newCap.description} onChange={e => setNewCap({ ...newCap, description: e.target.value })} />
            <div className="flex gap-2">
              <button onClick={handleCreateCapsule} className="flex-1 bg-[#1a181d] text-white p-3 rounded-lg font-bold hover:opacity-90">Crear</button>
              <button onClick={() => setModalCapsule(false)} className="text-red-500 px-4">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUBIR MATERIAL — nivel SuperAdmin para evitar re-render */}
      {modalContent && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[99999]">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-xl text-[#1a181d]">Subir Material</h3>
              <button onClick={() => { setModalContent(false); setNewContent({ title: '', url: '', type: 'video', capsule_id: '' }); }} className="text-slate-400 hover:text-black"><X /></button>
            </div>
            <div className="space-y-3">
              <input
                className="w-full p-4 bg-white border border-slate-300 rounded-xl text-black outline-none focus:ring-2 focus:ring-[#6be1e3]"
                placeholder="Título del Archivo"
                value={newContent.title}
                onChange={e => setNewContent({ ...newContent, title: e.target.value })}
              />
              <input
                className="w-full p-4 bg-white border border-slate-300 rounded-xl text-black outline-none focus:ring-2 focus:ring-[#6be1e3]"
                placeholder="Link (URL completa)"
                value={newContent.url}
                onChange={e => setNewContent({ ...newContent, url: e.target.value })}
              />
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setNewContent({ ...newContent, type: 'video' })}
                  className={`flex-1 p-3 rounded-xl font-bold transition ${newContent.type === 'video' ? 'bg-[#6be1e3] text-black' : 'bg-slate-100 text-slate-400'}`}
                >
                  🎬 Video
                </button>
                <button
                  onClick={() => setNewContent({ ...newContent, type: 'pdf' })}
                  className={`flex-1 p-3 rounded-xl font-bold transition ${newContent.type === 'pdf' ? 'bg-[#6be1e3] text-black' : 'bg-slate-100 text-slate-400'}`}
                >
                  📄 PDF
                </button>
              </div>
            </div>
            <button
              onClick={handleAddContent}
              className="w-full bg-[#1a181d] text-white p-4 rounded-xl font-bold hover:opacity-90 mt-6"
            >
              Subir Archivo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ============================================================
// BIBLIOTECA VIEW — Reutilizable para CompanyDashboard y EmployeePortal
// ============================================================
function BibliotecaView({ capsules }) {
  const [openFolder, setOpenFolder] = useState(null);

  // Vista: lista de carpetas en tabla
  if (!openFolder) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-8 text-[#1a181d]">Biblioteca de Entrenamiento</h2>
        {capsules.length === 0 ? (
          <div className="text-center p-12 text-slate-400 bg-white rounded-2xl border-2 border-dashed">
            No hay cápsulas disponibles. El Super Admin debe crearlas.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b text-xs uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-12">#</th>
                  <th className="px-6 py-4">Cápsula</th>
                  <th className="px-6 py-4 text-center w-40">Contenido</th>
                  <th className="px-6 py-4 text-center w-36">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {capsules.map((c, i) => {
                  const videos = c.contents.filter(x => x.type === 'video').length;
                  const pdfs   = c.contents.filter(x => x.type === 'pdf').length;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition group">
                      <td className="px-6 py-4 text-slate-300 font-mono text-sm font-bold">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#e4c76a]/10 flex items-center justify-center flex-shrink-0">
                            <Folder size={18} className="text-[#e4c76a]" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{c.title}</p>
                            {c.description && <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
                          {videos > 0 && (
                            <span className="flex items-center gap-1">
                              <PlayCircle size={12} className="text-[#6be1e3]" />
                              {videos} clase{videos !== 1 ? 's' : ''}
                            </span>
                          )}
                          {pdfs > 0 && (
                            <span className="flex items-center gap-1">
                              <FileText size={12} className="text-[#e4c76a]" />
                              {pdfs} material{pdfs !== 1 ? 'es' : ''}
                            </span>
                          )}
                          {c.contents.length === 0 && <span className="italic text-slate-300">Vacío</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setOpenFolder(c)}
                          className="inline-flex items-center gap-2 bg-[#1a181d] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#e4c76a] hover:text-black transition"
                        >
                          Ingresar <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Vista: dentro de una carpeta — tabla de contenidos
  const cap = openFolder;
  const videos = cap.contents.filter(c => c.type === 'video');
  const pdfs   = cap.contents.filter(c => c.type === 'pdf');
  const maxRows = Math.max(videos.length, pdfs.length, 1);
  const rows = Array.from({ length: maxRows }, (_, i) => ({
    idx: i + 1,
    video: videos[i] || null,
    pdf:   pdfs[i]   || null,
  }));

  return (
    <div>
      {/* Header carpeta */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setOpenFolder(null)}
          className="p-2.5 bg-white border rounded-xl hover:bg-slate-50 transition shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Biblioteca</p>
          <h2 className="text-2xl font-bold text-[#1a181d] flex items-center gap-2">
            <Folder className="text-[#e4c76a]" size={22} /> {cap.title}
          </h2>
        </div>
        <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-bold">
          {cap.contents.length} archivo{cap.contents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tabla */}
      {cap.contents.length === 0 ? (
        <div className="text-center p-12 text-slate-400 bg-white rounded-2xl border-2 border-dashed">
          Carpeta vacía. El Super Admin puede agregar contenido.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b text-xs uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4 w-12">#</th>
                <th className="px-6 py-4">
                  <span className="flex items-center gap-2">
                    <PlayCircle size={13} className="text-[#6be1e3]" /> Clase
                  </span>
                </th>
                <th className="px-6 py-4">
                  <span className="flex items-center gap-2">
                    <FileText size={13} className="text-[#e4c76a]" /> Material
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(row => (
                <tr key={row.idx} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-slate-300 font-mono text-sm font-bold">{row.idx}</td>

                  {/* Clase (video) */}
                  <td className="px-6 py-4">
                    {row.video ? (
                      <a href={row.video.url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 group/link">
                        <div className="w-8 h-8 rounded-lg bg-[#6be1e3]/10 flex items-center justify-center flex-shrink-0">
                          <PlayCircle size={16} className="text-[#6be1e3]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-sm group-hover/link:text-[#6be1e3] transition truncate">
                            {row.video.title}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">{row.video.url}</p>
                        </div>
                      </a>
                    ) : (
                      <span className="text-slate-300 text-sm">—</span>
                    )}
                  </td>

                  {/* Material (pdf) */}
                  <td className="px-6 py-4">
                    {row.pdf ? (
                      <a href={row.pdf.url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 group/link">
                        <div className="w-8 h-8 rounded-lg bg-[#e4c76a]/10 flex items-center justify-center flex-shrink-0">
                          <FileText size={16} className="text-[#e4c76a]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-sm group-hover/link:text-[#e4c76a] transition truncate">
                            {row.pdf.title}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">{row.pdf.url}</p>
                        </div>
                      </a>
                    ) : (
                      <span className="text-slate-300 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


// ============================================================
// PRODUCTS VIEW — Navegación: lista → dentro del producto
// ============================================================
function ProductsView({ products, newProd, setNewProd, addProduct, deleteProduct, addPrototype, deletePrototype, newProto, setNewProto, onUpdateProduct }) {
  const [openProduct, setOpenProduct] = useState(null);
  const [showProtoForm, setShowProtoForm] = useState(false);
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoText, setInfoText] = useState('');

  // Cuando se abre un producto, sincronizar la info local
  const enterProduct = (p) => {
    setOpenProduct(p);
    setInfoText(p.info || '');
    setEditingInfo(false);
    setShowProtoForm(false);
  };

  // Refrescar el producto abierto desde la lista actualizada
  const syncOpenProduct = (updatedProducts) => {
    if (openProduct) {
      const updated = updatedProducts.find(p => p.id === openProduct.id);
      if (updated) setOpenProduct(updated);
    }
  };

  // Llamar a syncOpenProduct cuando cambia la lista
  React.useEffect(() => {
    if (openProduct) syncOpenProduct(products);
  }, [products]);

  const saveInfo = async () => {
    await onUpdateProduct(openProduct.id, { info: infoText });
    setEditingInfo(false);
  };

  const handleAddPrototype = async (productId) => {
    await addPrototype(productId);
    setShowProtoForm(false);
  };

  // ── VISTA: lista de productos ──
  if (!openProduct) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-8 text-[#1a181d]">Configuración de Productos</h2>

        {/* Crear nuevo producto */}
        <div className="flex gap-3 mb-6">
          <input
            className="flex-1 border p-3 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
            placeholder="Nombre del nuevo producto..."
            value={newProd.name}
            onChange={e => setNewProd({ name: e.target.value })}
            onKeyPress={e => e.key === 'Enter' && addProduct()}
          />
          <button onClick={addProduct} className="bg-[#1a181d] text-white p-3 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 font-bold">
            <Plus size={16} /> Agregar
          </button>
        </div>

        {/* Tabla de productos */}
        {products.length === 0 ? (
          <div className="text-center p-12 text-slate-400 bg-white rounded-2xl border-2 border-dashed">
            No hay productos configurados.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b text-xs uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-10">#</th>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4 text-center w-44">Prototipos</th>
                  <th className="px-6 py-4 text-center w-36">Acción</th>
                  <th className="px-6 py-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p, i) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition group">
                    <td className="px-6 py-4 text-slate-300 font-mono text-sm font-bold">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#6be1e3]/10 flex items-center justify-center flex-shrink-0">
                          <Package size={17} className="text-[#6be1e3]" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{p.name}</p>
                          {p.info
                            ? <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[260px]">{p.info}</p>
                            : <p className="text-xs text-slate-300 italic mt-0.5">Sin información del producto</p>
                          }
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.prototypes.length > 0 ? 'bg-[#6be1e3]/10 text-[#3abfc1]' : 'bg-slate-100 text-slate-400'}`}>
                        {p.prototypes.length} prototipo{p.prototypes.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => enterProduct(p)}
                        className="inline-flex items-center gap-2 bg-[#1a181d] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#6be1e3] hover:text-black transition"
                      >
                        Ingresar <ChevronRight size={14} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ── VISTA: dentro de un producto ──
  const p = openProduct;
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => { setOpenProduct(null); setShowProtoForm(false); setEditingInfo(false); }}
          className="p-2.5 bg-white border rounded-xl hover:bg-slate-50 transition shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Productos</p>
          <h2 className="text-2xl font-bold text-[#1a181d] flex items-center gap-2">
            <Package size={20} className="text-[#6be1e3]" /> {p.name}
          </h2>
        </div>
        <button
          onClick={() => { setShowProtoForm(!showProtoForm); setEditingInfo(false); }}
          className="ml-auto flex items-center gap-2 bg-[#6be1e3] text-black text-sm font-bold px-4 py-2.5 rounded-xl hover:opacity-80 transition"
        >
          <Plus size={15} /> Prototipo Cliente
        </button>
      </div>

      {/* Sección: Información del producto */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FileText size={16} className="text-[#e17bd7]" /> Información del Producto
          </h3>
          {!editingInfo && (
            <button
              onClick={() => { setEditingInfo(true); setInfoText(p.info || ''); }}
              className="text-xs text-slate-400 hover:text-[#e17bd7] flex items-center gap-1 transition"
            >
              <Edit2 size={13} /> Editar
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Esta información será usada por el agente de IA para hacer preguntas técnicas y responder dudas específicas del producto durante el entrenamiento.
        </p>
        {editingInfo ? (
          <div>
            <textarea
              className="w-full border rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#e17bd7] resize-none bg-slate-50"
              rows={5}
              placeholder="Ej: Precio: $1200. Características: X, Y, Z. Beneficios: A, B. Garantía: 12 meses..."
              value={infoText}
              onChange={e => setInfoText(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button onClick={saveInfo} className="bg-[#1a181d] text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 flex items-center gap-2">
                <Save size={14} /> Guardar
              </button>
              <button onClick={() => setEditingInfo(false)} className="text-slate-400 px-4 py-2 text-sm hover:text-slate-600">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className={`text-sm rounded-xl p-3 min-h-[60px] ${p.info ? 'bg-slate-50 text-slate-700 leading-relaxed' : 'text-slate-300 italic'}`}>
            {p.info || 'Sin información cargada. Hacé click en Editar para agregar.'}
          </div>
        )}
      </div>

      {/* Formulario nuevo prototipo */}
      {showProtoForm && (
        <div className="bg-white border-2 border-[#6be1e3] rounded-2xl p-6 mb-6 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Nuevo Prototipo de Cliente</p>
          <div className="grid md:grid-cols-3 gap-3 mb-3">
            <input
              className="border p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
              placeholder="Nombre del perfil (ej: El Indeciso)"
              value={newProto.name}
              onChange={e => setNewProto({ ...newProto, name: e.target.value })}
            />
            <input
              className="border p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
              placeholder="Descripción del cliente"
              value={newProto.description}
              onChange={e => setNewProto({ ...newProto, description: e.target.value })}
            />
            <input
              className="border p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
              placeholder="Objeción principal que planteará"
              value={newProto.objection}
              onChange={e => setNewProto({ ...newProto, objection: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleAddPrototype(p.id)} className="bg-[#6be1e3] text-black px-5 py-2 rounded-xl font-bold text-sm hover:opacity-80">
              Guardar Prototipo
            </button>
            <button onClick={() => setShowProtoForm(false)} className="text-slate-400 text-sm px-4 py-2 hover:text-slate-600">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de prototipos */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <Users size={16} className="text-[#6be1e3]" /> Prototipos de Cliente
            <span className="ml-1 bg-[#6be1e3]/15 text-[#3abfc1] text-xs font-bold px-2 py-0.5 rounded-full">{p.prototypes.length}</span>
          </h3>
        </div>
        {p.prototypes.length === 0 ? (
          <div className="text-center p-10 text-slate-400 border-2 border-dashed rounded-b-2xl">
            Sin prototipos. Usá el botón <strong>+ Prototipo Cliente</strong> para agregar.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="text-xs uppercase font-bold text-slate-400 tracking-wider border-b">
              <tr>
                <th className="px-6 py-3">Perfil del cliente</th>
                <th className="px-6 py-3">Descripción</th>
                <th className="px-6 py-3">Objeción principal</th>
                <th className="px-6 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {p.prototypes.map(pr => (
                <tr key={pr.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 text-sm">{pr.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{pr.description}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-lg">{pr.objection}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deletePrototype(pr.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


// ============================================================
// COMPANY DASHBOARD (Admin Empresa) — COMPLETAMENTE FUNCIONAL
// ============================================================
function CompanyDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [tab, setTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [capsules, setCapsules] = useState([]);
  const [newEmp, setNewEmp] = useState({ name: '', email: '', password: '' });
  const [newProd, setNewProd] = useState({ name: '' });
  const [newProto, setNewProto] = useState({ name: '', description: '', objection: '' });
  const [selProductId, setSelProductId] = useState(null);

  // PERFIL DEL VENDEDOR
  const [profileEmp, setProfileEmp] = useState(null);      // datos completos del empleado seleccionado
  const [profileTab, setProfileTab] = useState('info');    // 'info' | 'chat' | 'capsulas'
  const [profileEdit, setProfileEdit] = useState({});      // datos del formulario de edición
  const [showProfile, setShowProfile] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [selSession, setSelSession] = useState(null);      // sesión de chat abierta

  useEffect(() => {
    if (!user.id) { navigate('/login'); return; }
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [empRes, prodRes, capRes] = await Promise.all([
        axios.get(`${API_URL}/company/${user.id}/employees`),
        axios.get(`${API_URL}/company/${user.id}/products`),
        axios.get(`${API_URL}/capsules`)
      ]);
      setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      setCapsules(Array.isArray(capRes.data) ? capRes.data : []);
    } catch (e) { console.error(e); }
  };

  const openProfile = async (empId) => {
    try {
      const res = await axios.get(`${API_URL}/employees/${empId}/profile`);
      setProfileEmp(res.data);
      setProfileEdit({ name: res.data.name, email: res.data.email, password: '' });
      setProfileTab('info');
      setSelSession(null);
      setShowPass(false);
      setShowProfile(true);
    } catch (e) { alert("Error cargando perfil"); }
  };

  const saveProfileEdit = async () => {
    try {
      await axios.put(`${API_URL}/employees/${profileEmp.id}`, profileEdit);
      const res = await axios.get(`${API_URL}/employees/${profileEmp.id}/profile`);
      setProfileEmp(res.data);
      setProfileEdit({ name: res.data.name, email: res.data.email, password: '' });
      loadAll();
      alert("✅ Datos actualizados");
    } catch (e) { alert(e.response?.data?.detail || "Error al actualizar"); }
  };

  const toggleCapsule = async (capsuleId, currentlyAssigned) => {
    await axios.post(`${API_URL}/employees/${profileEmp.id}/capsules`, {
      capsule_id: capsuleId,
      assign: !currentlyAssigned
    });
    const res = await axios.get(`${API_URL}/employees/${profileEmp.id}/profile`);
    setProfileEmp(res.data);
  };

  const addEmployee = async () => {
    if (!newEmp.name || !newEmp.email || !newEmp.password) return alert("Completá todos los campos");
    try {
      await axios.post(`${API_URL}/company/${user.id}/employees`, { ...newEmp, role: 'Vendedor' });
      setNewEmp({ name: '', email: '', password: '' });
      loadAll();
    } catch (e) { alert(e.response?.data?.detail || "Error al crear vendedor"); }
  };

  const deleteEmployee = async (empId) => {
    if (confirm("¿Eliminar este vendedor?")) {
      await axios.delete(`${API_URL}/company/${user.id}/employees/${empId}`);
      loadAll();
    }
  };

  const addProduct = async () => {
    if (!newProd.name) return alert("Ingresá el nombre del producto");
    await axios.post(`${API_URL}/company/${user.id}/products`, newProd);
    setNewProd({ name: '' });
    loadAll();
  };

  const deleteProduct = async (prodId) => {
    if (confirm("¿Eliminar este producto y todos sus prototipos?")) {
      await axios.delete(`${API_URL}/company/${user.id}/products/${prodId}`);
      loadAll();
    }
  };

  const addPrototype = async (productId) => {
    if (!newProto.name || !newProto.description || !newProto.objection) return alert("Completá todos los campos del prototipo");
    await axios.post(`${API_URL}/prototypes`, { ...newProto, product_id: productId });
    setNewProto({ name: '', description: '', objection: '' });
    setSelProductId(null);
    loadAll();
  };

  const deletePrototype = async (protoId) => {
    if (confirm("¿Eliminar este prototipo?")) {
      await axios.delete(`${API_URL}/prototypes/${protoId}`);
      loadAll();
    }
  };

  const tabs = [
    { key: 'employees', label: 'Equipo', icon: Users, color: 'bg-[#e17bd7]' },
    { key: 'products', label: 'Productos', icon: Package, color: 'bg-[#6be1e3] text-black' },
    { key: 'capsulas', label: 'Biblioteca', icon: BookOpen, color: 'bg-[#e4c76a] text-black' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex font-sans text-slate-800">
      <aside className="w-72 bg-[#1a181d] text-white p-6 flex flex-col fixed h-full z-10 shadow-2xl">
        <div className="mb-10"><LogoOneWhite small /></div>
        <div className="mb-8 px-2">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Empresa</p>
          <p className="font-bold text-lg text-white truncate">{user.name}</p>
        </div>
        <nav className="space-y-2 flex-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${tab === t.key ? `${t.color} font-bold` : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <t.icon size={18} />{t.label}
            </button>
          ))}
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="text-red-400 flex items-center gap-2 text-sm font-bold px-2 py-3 hover:bg-white/5 rounded-xl transition">
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </aside>

      <main className="ml-72 flex-1 p-10">
        {/* EQUIPO */}
        {tab === 'employees' && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-[#1a181d]">Gestión de Equipo</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Formulario nuevo vendedor */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold mb-4 text-lg">Nuevo Vendedor</h3>
                <input className="w-full bg-slate-50 border p-3 rounded-xl mb-2 text-sm outline-none focus:ring-2 focus:ring-[#e17bd7]" placeholder="Nombre completo" value={newEmp.name} onChange={e => setNewEmp({ ...newEmp, name: e.target.value })} />
                <input className="w-full bg-slate-50 border p-3 rounded-xl mb-2 text-sm outline-none focus:ring-2 focus:ring-[#e17bd7]" placeholder="Email" value={newEmp.email} onChange={e => setNewEmp({ ...newEmp, email: e.target.value })} />
                <input className="w-full bg-slate-50 border p-3 rounded-xl mb-4 text-sm outline-none focus:ring-2 focus:ring-[#e17bd7]" type="password" placeholder="Contraseña" value={newEmp.password} onChange={e => setNewEmp({ ...newEmp, password: e.target.value })} />
                <button onClick={addEmployee} className="w-full bg-[#1a181d] text-white p-3 rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2"><Plus size={16} /> Crear Vendedor</button>
              </div>

              {/* Lista de vendedores */}
              <div className="md:col-span-2 space-y-3">
                {employees.map(e => (
                  <div key={e.id} className="bg-white p-4 rounded-xl border flex justify-between items-center hover:shadow-md transition">
                    <div>
                      <p className="font-bold">{e.name}</p>
                      <p className="text-xs text-slate-500">{e.email}</p>
                      <div className="flex gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><MessageSquare size={12} /> {e.sessions_count} sesiones</span>
                        {e.avg_score && <span className="flex items-center gap-1 text-[#e4c76a]"><Star size={12} /> {e.avg_score}/10 promedio</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Activo</span>
                      <button
                        onClick={() => openProfile(e.id)}
                        className="p-2 text-slate-400 hover:text-[#e17bd7] hover:bg-pink-50 rounded-lg transition"
                        title="Ver perfil"
                      >
                        <Eye size={16} />
                      </button>
                      <button onClick={() => deleteEmployee(e.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                {employees.length === 0 && <div className="text-center p-10 text-slate-400 bg-white rounded-2xl border-2 border-dashed">No hay vendedores aún.</div>}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTOS */}
        {tab === 'products' && (
          <ProductsView
            products={products}
            newProd={newProd}
            setNewProd={setNewProd}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            addPrototype={addPrototype}
            deletePrototype={deletePrototype}
            newProto={newProto}
            setNewProto={setNewProto}
            onUpdateProduct={async (prodId, data) => {
              await axios.put(`${API_URL}/products/${prodId}`, data);
              loadAll();
            }}
          />
        )}

        {/* BIBLIOTECA */}
        {tab === 'capsulas' && (
          <BibliotecaView capsules={capsules} />
        )}
      </main>

      {/* ===== MODAL PERFIL VENDEDOR ===== */}
      {showProfile && profileEmp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[99999] backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

            {/* Header del perfil */}
            <div className="bg-[#1a181d] p-6 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#e17bd7]/20 flex items-center justify-center">
                  <User size={24} className="text-[#e17bd7]" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Perfil del Vendedor</p>
                  <h2 className="text-xl font-bold text-white">{profileEmp.name}</h2>
                  <p className="text-slate-400 text-sm">{profileEmp.email}</p>
                </div>
              </div>
              <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"><X size={20} /></button>
            </div>

            {/* Pestañas */}
            <div className="flex border-b border-slate-100 bg-slate-50 flex-shrink-0">
              {[
                { key: 'info', label: 'Perfil & Contraseña', icon: Edit2 },
                { key: 'chat', label: 'Historial de Chats', icon: MessageSquare },
                { key: 'capsulas', label: 'Cápsulas', icon: BookOpen },
              ].map(t => (
                <button key={t.key} onClick={() => setProfileTab(t.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition border-b-2 ${profileTab === t.key ? 'border-[#e17bd7] text-[#e17bd7] bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <t.icon size={15} /> {t.label}
                </button>
              ))}
            </div>

            {/* Contenido del perfil */}
            <div className="flex-1 overflow-y-auto p-6">

              {/* TAB: INFO & CONTRASEÑA */}
              {profileTab === 'info' && (
                <div className="space-y-4 max-w-md">
                  <h3 className="font-bold text-lg text-slate-800 mb-4">Editar Datos</h3>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nombre</label>
                    <input className="w-full mt-1 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#e17bd7] text-sm" value={profileEdit.name || ''} onChange={e => setProfileEdit({ ...profileEdit, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email</label>
                    <input className="w-full mt-1 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#e17bd7] text-sm" value={profileEdit.email || ''} onChange={e => setProfileEdit({ ...profileEdit, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contraseña actual</label>
                    <div className="mt-1 flex items-center gap-2 p-3 bg-slate-50 border rounded-xl">
                      <span className="flex-1 font-mono text-sm text-slate-700">
                        {showPass ? profileEmp.visible_password : '••••••••'}
                      </span>
                      <button onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-slate-700">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nueva contraseña (dejar vacío para no cambiar)</label>
                    <input className="w-full mt-1 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#e17bd7] text-sm" type="password" placeholder="••••••••" value={profileEdit.password || ''} onChange={e => setProfileEdit({ ...profileEdit, password: e.target.value })} />
                  </div>
                  <button onClick={saveProfileEdit} className="w-full bg-[#1a181d] text-white p-3 rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2 mt-2">
                    <Save size={16} /> Guardar Cambios
                  </button>
                </div>
              )}

              {/* TAB: HISTORIAL DE CHATS */}
              {profileTab === 'chat' && (
                <div>
                  {!selSession ? (
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 mb-4">Sesiones de Entrenamiento</h3>
                      {profileEmp.sessions.length === 0 && (
                        <div className="text-center p-10 text-slate-400 border-2 border-dashed rounded-2xl">Sin sesiones registradas.</div>
                      )}
                      <div className="space-y-3">
                        {profileEmp.sessions.map((s, i) => {
                          const scoreColor = !s.score ? 'text-slate-400' : s.score >= 8 ? 'text-green-500' : s.score >= 5 ? 'text-yellow-500' : 'text-red-500';
                          return (
                            <button key={s.id} onClick={() => setSelSession(s)}
                              className="w-full text-left bg-slate-50 hover:bg-white border hover:border-[#e17bd7] p-4 rounded-xl transition flex justify-between items-center group">
                              <div>
                                <p className="font-bold text-slate-800">Sesión #{profileEmp.sessions.length - i}</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {s.date ? new Date(s.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">{s.messages.filter(m => m.role === 'user').length} intercambios</p>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                {s.score ? <span className={`text-3xl font-extrabold ${scoreColor}`}>{s.score}<span className="text-sm text-slate-300">/10</span></span> : <span className="text-xs text-slate-400 bg-slate-200 px-2 py-1 rounded">Sin evaluar</span>}
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-[#e17bd7] transition" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => setSelSession(null)} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition"><ArrowLeft size={18} /></button>
                        <div>
                          <p className="font-bold text-slate-800">Detalle de Sesión</p>
                          <p className="text-xs text-slate-400">{selSession.date ? new Date(selSession.date).toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : '—'}</p>
                        </div>
                        {selSession.score && (
                          <span className={`ml-auto text-2xl font-extrabold ${selSession.score >= 8 ? 'text-green-500' : selSession.score >= 5 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {selSession.score}/10
                          </span>
                        )}
                      </div>

                      {/* Conversación */}
                      <div className="space-y-3 mb-6">
                        {selSession.messages.map((m, i) => (
                          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#1a181d] text-white rounded-br-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm'}`}>
                              <p className={`text-[10px] font-bold uppercase mb-1 ${m.role === 'user' ? 'text-slate-400' : 'text-slate-500'}`}>
                                {m.role === 'user' ? '👤 Vendedor' : '🤖 Cliente IA'}
                              </p>
                              {m.content}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Feedback */}
                      {(selSession.feedback_admin || selSession.feedback) && (
                        <div className="space-y-3">
                          {/* Informe Admin (prioritario) */}
                          {selSession.feedback_admin ? (
                            <div className="bg-slate-50 border rounded-2xl p-5">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">📊 Informe de Evaluación</p>
                              <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">
                                {selSession.feedback_admin}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-slate-50 border rounded-2xl p-4">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">📋 Evaluación</p>
                              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{selSession.feedback}</pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: CÁPSULAS HABILITADAS */}
              {profileTab === 'capsulas' && (
                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-1">Cápsulas de Entrenamiento</h3>
                  <p className="text-sm text-slate-400 mb-6">Habilitá o deshabilitá el acceso del vendedor a cada cápsula.</p>
                  {capsules.length === 0 && (
                    <div className="text-center p-10 text-slate-400 border-2 border-dashed rounded-2xl">No hay cápsulas creadas. El Super Admin debe crearlas primero.</div>
                  )}
                  <div className="space-y-3">
                    {capsules.map(cap => {
                      const assigned = (profileEmp.assigned_capsule_ids || []).includes(cap.id);
                      return (
                        <div key={cap.id} className={`flex items-center justify-between p-4 rounded-xl border transition ${assigned ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-center gap-3">
                            <Folder size={20} className={assigned ? 'text-green-500' : 'text-slate-400'} />
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{cap.title}</p>
                              <p className="text-xs text-slate-400">{cap.description} · {cap.contents?.length || 0} archivos</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleCapsule(cap.id, assigned)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${assigned ? 'bg-green-500 text-white hover:bg-red-500' : 'bg-slate-200 text-slate-600 hover:bg-[#6be1e3] hover:text-black'}`}
                          >
                            {assigned ? <><CheckCircle size={14} /> Habilitada</> : <><Plus size={14} /> Habilitar</>}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ============================================================
// EMPLOYEE PORTAL (Vendedor) — COMPLETAMENTE FUNCIONAL
// ============================================================
function EmployeePortal() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [view, setView] = useState('select'); // 'select' | 'chat' | 'feedback'
  const [products, setProducts] = useState([]);
  const [capsules, setCapsules] = useState([]);
  const [activeSection, setActiveSection] = useState('entrenar'); // 'entrenar' | 'capsulas' | 'historial'
  const [session, setSession] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [agentName, setAgentName] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(null);
  const [sending, setSending] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user.id) { navigate('/login'); return; }
    loadData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const loadData = async () => {
    try {
      const [prodRes, capRes, histRes] = await Promise.all([
        axios.get(`${API_URL}/company/${user.company_id}/products`),
        axios.get(`${API_URL}/employees/${user.id}/capsules`),   // solo las habilitadas
        axios.get(`${API_URL}/employees/${user.id}/stats`)
      ]);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      setCapsules(Array.isArray(capRes.data) ? capRes.data : []);
      setHistory(Array.isArray(histRes.data) ? histRes.data : []);
    } catch (e) { console.error(e); }
  };

  const startChat = async (prototypeId) => {
    setLoadingStart(true);
    try {
      const res = await axios.post(`${API_URL}/chat/start`, { employee_id: user.id, prototype_id: prototypeId });
      setSession(res.data.session_id);
      setAgentName(res.data.agent_name);
      setMsgs([{ role: 'ai', content: res.data.initial_message }]);
      setView('chat');
    } catch (e) {
      alert("Error iniciando la simulación: " + (e.response?.data?.detail || e.message));
    } finally {
      setLoadingStart(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const userMsg = input.trim();
    setInput('');
    setSending(true);
    const newMsgs = [...msgs, { role: 'user', content: userMsg }];
    setMsgs(newMsgs);
    try {
      const res = await axios.post(`${API_URL}/chat/message`, { session_id: session, message: userMsg });
      setMsgs([...newMsgs, { role: 'ai', content: res.data.response }]);
    } catch {
      setMsgs([...newMsgs, { role: 'ai', content: '⚠️ Error de conexión. Intentá de nuevo.' }]);
    } finally {
      setSending(false);
    }
  };

  const endSession = async () => {
    setSending(true);
    try {
      const res = await axios.post(`${API_URL}/chat/feedback`, { session_id: session });
      setFeedback(res.data.feedback);
      setScore(res.data.score);
      setView('feedback');
      loadData();
    } catch {
      alert("Error obteniendo el feedback");
    } finally {
      setSending(false);
    }
  };

  // PANTALLA DE CHAT
  if (view === 'chat') {
    return (
      <div className="h-screen bg-slate-100 flex flex-col">
        <header className="bg-white px-6 py-4 border-b flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-bold text-[#1a181d]">{agentName} — Cliente Virtual</p>
              <p className="text-xs text-slate-400">Simulación en curso • {msgs.length - 1} intercambios</p>
            </div>
          </div>
          <button
            onClick={endSession}
            disabled={sending}
            className="bg-red-50 text-red-500 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition disabled:opacity-50"
          >
            {sending ? 'Generando feedback...' : 'Terminar y Evaluar'}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[75%] text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#1a181d] text-white rounded-br-sm' : 'bg-white text-slate-800 rounded-bl-sm border'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl border shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-t p-4 max-w-4xl mx-auto w-full">
          <div className="flex gap-3">
            <input
              className="flex-1 p-4 rounded-xl border bg-slate-50 outline-none focus:ring-2 focus:ring-[#6be1e3] text-sm"
              value={input}
              placeholder="Escribí tu respuesta como vendedor..."
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="bg-[#6be1e3] text-black p-4 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-40"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA DE FEEDBACK
  if (view === 'feedback') {
    const scoreColor = score >= 8 ? 'text-green-500' : score >= 5 ? 'text-yellow-500' : 'text-red-500';
    const scoreBg   = score >= 8 ? 'bg-green-50 border-green-200' : score >= 5 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

    // Parsear las secciones del feedback del vendedor
    const parseSections = (text) => {
      if (!text) return [];
      const sections = [];
      const lines = text.split('\n');
      let current = null;
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith('✅') || trimmed.startsWith('⚠️') || trimmed.startsWith('💡') || trimmed.startsWith('🎯')) {
          if (current) sections.push(current);
          current = { title: trimmed, items: [] };
        } else if (trimmed.startsWith('-') && current) {
          current.items.push(trimmed.slice(1).trim());
        } else if (current && !trimmed.startsWith('CALIFICACIÓN')) {
          if (current.items.length === 0) current.body = (current.body || '') + trimmed + ' ';
          else current.items.push(trimmed);
        }
      }
      if (current) sections.push(current);
      return sections;
    };

    const sections = parseSections(feedback);
    const sectionStyle = {
      '✅': { bg: 'bg-green-50 border-green-200', title: 'text-green-700' },
      '⚠️': { bg: 'bg-orange-50 border-orange-200', title: 'text-orange-700' },
      '💡': { bg: 'bg-blue-50 border-blue-200', title: 'text-blue-700' },
      '🎯': { bg: 'bg-purple-50 border-purple-200', title: 'text-purple-700' },
    };

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-8">
          <h2 className="text-2xl font-bold text-[#1a181d] mb-6 text-center">Tu Evaluación</h2>

          {/* Puntaje */}
          <div className={`text-center p-6 rounded-2xl border mb-6 ${scoreBg}`}>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Puntaje Final</p>
            <p className={`text-7xl font-extrabold ${scoreColor}`}>{score}<span className="text-3xl text-slate-400">/10</span></p>
          </div>

          {/* Secciones parseadas */}
          {sections.length > 0 ? (
            <div className="space-y-4 mb-6">
              {sections.map((sec, i) => {
                const emoji = Object.keys(sectionStyle).find(e => sec.title.startsWith(e));
                const style = sectionStyle[emoji] || { bg: 'bg-slate-50 border-slate-200', title: 'text-slate-700' };
                return (
                  <div key={i} className={`rounded-2xl border p-4 ${style.bg}`}>
                    <p className={`font-bold text-sm mb-2 ${style.title}`}>{sec.title}</p>
                    {sec.body && <p className="text-sm text-slate-700 leading-relaxed">{sec.body}</p>}
                    {sec.items.length > 0 && (
                      <ul className="space-y-1">
                        {sec.items.map((item, j) => (
                          <li key={j} className="text-sm text-slate-700 flex gap-2">
                            <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-sm text-slate-700 leading-relaxed border whitespace-pre-wrap">
              {feedback}
            </div>
          )}

          <button
            onClick={() => { setView('select'); setFeedback(null); setScore(null); setMsgs([]); setSession(null); }}
            className="w-full bg-[#1a181d] text-white py-4 rounded-xl font-bold hover:opacity-90 transition"
          >
            Volver a Entrenar
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA PRINCIPAL DEL VENDEDOR
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex font-sans">
      <aside className="w-64 bg-[#1a181d] text-white p-6 flex flex-col fixed h-full z-10">
        <div className="mb-10"><LogoOneWhite small /></div>
        <div className="mb-6 px-2">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Vendedor</p>
          <p className="font-bold text-white">{user.name}</p>
        </div>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveSection('entrenar')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${activeSection === 'entrenar' ? 'bg-[#e17bd7] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><BrainCircuit size={18} /> Entrenar</button>
          <button onClick={() => setActiveSection('capsulas')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${activeSection === 'capsulas' ? 'bg-[#6be1e3] text-black font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><BookOpen size={18} /> Biblioteca</button>
          <button onClick={() => setActiveSection('historial')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${activeSection === 'historial' ? 'bg-[#e4c76a] text-black font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><TrendingUp size={18} /> Mi Progreso</button>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="text-red-400 flex items-center gap-2 text-sm font-bold px-2 py-3 hover:bg-white/5 rounded-xl transition">
          <LogOut size={16} /> Salir
        </button>
      </aside>

      <main className="ml-64 flex-1 p-10">
        {/* SECCIÓN ENTRENAR */}
        {activeSection === 'entrenar' && (
          <div>
            <h2 className="text-3xl font-bold mb-2 text-[#1a181d]">Simulación de Ventas</h2>
            <p className="text-slate-500 mb-8">Elegí un producto y un perfil de cliente para comenzar a entrenar con IA.</p>
            {loadingStart && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-2xl text-center">
                  <div className="w-12 h-12 border-4 border-[#e17bd7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="font-bold">Preparando al cliente virtual...</p>
                </div>
              </div>
            )}
            {products.length === 0 && (
              <div className="text-center p-12 bg-white rounded-2xl border-2 border-dashed text-slate-400">
                No hay productos disponibles. El administrador debe configurarlos.
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
                  <h3 className="font-bold text-xl mb-1 text-[#e17bd7] flex items-center gap-2"><Package size={18} /> {p.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{p.prototypes.length} prototipos de cliente disponibles</p>
                  <div className="space-y-2">
                    {p.prototypes.map(pr => (
                      <button key={pr.id} onClick={() => startChat(pr.id)}
                        className="w-full text-left p-3 border rounded-xl hover:bg-slate-50 flex justify-between items-center group transition">
                        <div>
                          <p className="font-bold text-sm">{pr.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{pr.description}</p>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-[#e17bd7] group-hover:translate-x-1 transition" />
                      </button>
                    ))}
                    {p.prototypes.length === 0 && <p className="text-xs text-slate-400 italic px-2">Sin prototipos configurados.</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN BIBLIOTECA */}
        {activeSection === 'capsulas' && (
          capsules.length === 0
            ? <div className="text-center p-12 bg-white rounded-2xl border-2 border-dashed text-slate-400">No tenés cápsulas habilitadas. Pedile al administrador que te asigne una.</div>
            : <BibliotecaView capsules={capsules} />
        )}

        {/* SECCIÓN HISTORIAL */}
        {activeSection === 'historial' && (
          <div>
            <h2 className="text-3xl font-bold mb-2 text-[#1a181d]">Mi Progreso</h2>
            <p className="text-slate-500 mb-8">Tus sesiones de entrenamiento y puntajes obtenidos.</p>
            {history.length === 0 && <div className="text-center p-12 bg-white rounded-2xl border-2 border-dashed text-slate-400">Aún no completaste ninguna sesión. ¡A entrenar!</div>}
            <div className="space-y-4">
              {history.map((s, i) => {
                const scoreColor = !s.score ? 'text-slate-400' : s.score >= 8 ? 'text-green-500' : s.score >= 5 ? 'text-yellow-500' : 'text-red-500';
                return (
                  <div key={s.id} className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg">Sesión #{i + 1}</p>
                        <p className="text-xs text-slate-400">{s.date ? new Date(s.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Fecha no disponible'}</p>
                      </div>
                      <div className="text-right">
                        {s.score ? <p className={`text-4xl font-extrabold ${scoreColor}`}>{s.score}<span className="text-lg text-slate-300">/10</span></p> : <p className="text-slate-400 text-sm">Sin evaluar</p>}
                      </div>
                    </div>
                    {s.feedback && (
                      <details className="mt-4">
                        <summary className="cursor-pointer text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-700">Ver feedback completo</summary>
                        <div className="mt-3 bg-slate-50 p-4 rounded-xl text-xs text-slate-600 whitespace-pre-wrap font-mono border">{s.feedback}</div>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


// ============================================================
// APP PRINCIPAL — RUTAS
// ============================================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/super-admin" element={<SuperAdmin />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/employee-portal" element={<EmployeePortal />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}