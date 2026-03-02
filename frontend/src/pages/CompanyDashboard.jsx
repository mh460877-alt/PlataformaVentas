import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogoOne } from '../components/Logo';
import { LayoutDashboard, Users, Package, PlayCircle, LogOut, Plus, Eye, BarChart, ChevronRight } from 'lucide-react';

const API_URL = 'https://plataformaventas.onrender.com';

export default function CompanyDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [tab, setTab] = useState('employees');
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({});
    const [subItem, setSubItem] = useState({}); 
    const [selId, setSelId] = useState(null);

    useEffect(() => { 
        if(!user.id) navigate('/login');
        load(); 
    }, [tab]);

    const load = async () => {
        try {
            const ep = tab==='employees' ? 'employees' : tab==='products' ? 'products' : null;
            if(ep) { const res = await axios.get(`${API_URL}/company/${user.id}/${ep}`); setItems(res.data); }
            if(tab==='capsulas') { const res = await axios.get(`${API_URL}/capsules`); setItems(res.data); }
        } catch(e) { console.error(e); }
    };

    const addEmp = async () => { await axios.post(`${API_URL}/company/${user.id}/employees`, {...newItem, role:'Vendedor'}); load(); };
    const addProd = async () => { await axios.post(`${API_URL}/company/${user.id}/products`, newItem); load(); };
    const addProto = async (pid) => { await axios.post(`${API_URL}/prototypes`, {...subItem, product_id: pid}); load(); setSelId(null); };

    return (
        <div className="min-h-screen bg-[#f8f9fc] flex font-sans text-slate-800">
            <aside className="w-72 bg-[#1a181d] text-white p-6 flex flex-col fixed h-full z-10">
                <div className="mb-10"><LogoOne small /><p className="mt-4 font-bold text-lg">{user.name}</p></div>
                <nav className="space-y-2 flex-1">
                    <button onClick={()=>setTab('employees')} className={`w-full text-left p-3 rounded-xl ${tab==='employees'?'bg-[#e17bd7] font-bold':'text-slate-400 hover:text-white'}`}>Equipo</button>
                    <button onClick={()=>setTab('products')} className={`w-full text-left p-3 rounded-xl ${tab==='products'?'bg-[#6be1e3] text-black font-bold':'text-slate-400 hover:text-white'}`}>Productos</button>
                    <button onClick={()=>setTab('capsulas')} className={`w-full text-left p-3 rounded-xl ${tab==='capsulas'?'bg-[#e4c76a] text-black font-bold':'text-slate-400 hover:text-white'}`}>Biblioteca</button>
                </nav>
                <button onClick={()=>navigate('/login')} className="text-red-400">Salir</button>
            </aside>
            <main className="ml-72 flex-1 p-12">
                <h2 className="text-3xl font-bold mb-8 text-[#1a181d]">{tab==='employees'?'Gestión de Equipo':tab==='products'?'Configuración de Productos':'Biblioteca'}</h2>
                
                {tab === 'employees' && (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm h-fit"><h3 className="font-bold mb-4">Nuevo Vendedor</h3><input className="w-full bg-slate-50 border p-3 rounded mb-2" placeholder="Nombre" onChange={e=>setNewItem({...newItem, name:e.target.value})}/><input className="w-full bg-slate-50 border p-3 rounded mb-2" placeholder="Email" onChange={e=>setNewItem({...newItem, email:e.target.value})}/><input className="w-full bg-slate-50 border p-3 rounded mb-4" type="password" placeholder="Pass" onChange={e=>setNewItem({...newItem, password:e.target.value})}/><button onClick={addEmp} className="w-full bg-[#1a181d] text-white p-3 rounded font-bold">Crear</button></div>
                        <div className="md:col-span-2 space-y-3">{items.map(e=><div key={e.id} className="bg-white p-4 rounded-xl border flex justify-between"><div><p className="font-bold">{e.name}</p><p className="text-xs">{e.email}</p></div><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Activo</span></div>)}</div>
                    </div>
                )}

                {tab === 'products' && (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div><div className="flex gap-2 mb-6"><input className="flex-1 border p-3 rounded-xl bg-white" placeholder="Nuevo Producto..." onChange={e=>setNewItem({...newItem, name:e.target.value})}/><button onClick={addProd} className="bg-[#1a181d] text-white p-3 rounded-xl"><Plus/></button></div>
                        {items.map(p=><div key={p.id} className="bg-white p-6 rounded-2xl border mb-4"><div className="flex justify-between mb-4"><h3 className="font-bold text-xl">{p.name}</h3><button onClick={()=>setSelId(p.id)} className="text-xs bg-slate-100 px-2 py-1 rounded">+ Variante</button></div>
                        {selId===p.id && <div className="bg-slate-50 p-4 rounded mb-4"><input className="w-full border p-2 mb-2" placeholder="Nombre (Ej: Enojado)" onChange={e=>setSubItem({...subItem, name:e.target.value})}/><input className="w-full border p-2 mb-2" placeholder="Contexto" onChange={e=>setSubItem({...subItem, description:e.target.value})}/><input className="w-full border p-2 mb-2" placeholder="Objeción" onChange={e=>setSubItem({...subItem, objection:e.target.value})}/><button onClick={()=>addProto(p.id)} className="bg-[#6be1e3] w-full p-2 rounded">Guardar</button></div>}
                        <div className="space-y-2">{p.prototypes.map(pr=><div key={pr.id} className="text-sm p-2 border-l-4 border-slate-300 bg-slate-50"><p className="font-bold">{pr.name}</p></div>)}</div></div>)}</div>
                    </div>
                )}

                {tab === 'capsulas' && (
                    <div className="grid md:grid-cols-3 gap-6">
                        {items.map(c => <div key={c.id} className="bg-white p-6 rounded-2xl border hover:shadow-lg"><Folder className="text-[#e4c76a] mb-4"/><h3 className="font-bold">{c.title}</h3><div className="mt-4 border-t pt-2 space-y-2">{c.contents.map(cnt=><a key={cnt.id} href={cnt.url} target="_blank" className="block text-sm text-blue-600 hover:underline flex items-center"><PlayCircle size={14} className="mr-2"/> {cnt.title}</a>)}</div></div>)}
                    </div>
                )}
            </main>
        </div>
    );
}