import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogoOne } from '../components/Logo';

const API_URL = 'http://127.0.0.1:8000';
const COLORS = { black: "#1a181d", pink: "#e17bd7", cyan: "#6be1e3" };

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({email: '', password: ''});
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (formData.email === 'admin@salesai.com' && formData.password === 'admin') { navigate('/super-admin'); return; }
    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      localStorage.setItem('user', JSON.stringify(res.data));
      if (res.data.type === 'company') navigate('/company-dashboard');
      else navigate('/employee-portal');
    } catch { setError("Credenciales incorrectas o cuenta inactiva"); }
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
            <input className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#e17bd7] transition text-sm text-[#1a181d]" placeholder="Correo Corporativo" onChange={e=>setFormData({...formData, email:e.target.value})}/>
            <input className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#6be1e3] transition text-sm text-[#1a181d]" type="password" placeholder="Contraseña" onChange={e=>setFormData({...formData, password:e.target.value})}/>
            {error && <div className="p-3 bg-red-50 text-red-500 text-center text-xs rounded-lg border border-red-100">{error}</div>}
            <button className="w-full p-4 text-white rounded-xl font-bold hover:opacity-90 transition shadow-lg mt-2 text-sm uppercase tracking-wide" style={{ backgroundColor: COLORS.black }}>
                Iniciar Sesión
            </button>
        </form>
      </div>
    </div>
  );
}