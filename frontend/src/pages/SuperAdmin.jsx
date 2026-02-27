import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, Plus, LogOut, Save, X, Trash2, Folder, FileText, PlayCircle, Search, RefreshCw, Power, Edit2, Lock, User, Upload, ArrowLeft } from 'lucide-react';
import { LogoOne } from '../components/Logo';

const API_URL = 'http://127.0.0.1:8000';

export default function SuperAdmin() {
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
    const [editCapsuleModal, setEditCapsuleModal] = useState(false);

    const [newCompany, setNewCompany] = useState({ company_name: '', email: '', password: '', phone: '' });
    const [editingCompany, setEditingCompany] = useState(null);
    const [newCap, setNewCap] = useState({ title: '', description: '' });
    const [newContent, setNewContent] = useState({ title: '', url: '', type: 'video', capsule_id: '' });
    const [editingCapsule, setEditingCapsule] = useState(null);

    useEffect(() => { loadData(); }, []);
    const loadData = async () => {
        try {
            const resEmp = await axios.get(`${API_URL}/companies`);
            setEmpresas(Array.isArray(resEmp.data) ? resEmp.data : []);
            const resCap = await axios.get(`${API_URL}/capsules`);
            setCapsules(Array.isArray(resCap.data) ? resCap.data : []);
        } catch(e) { console.error("Error cargando datos:", e); }
    };

    // --- LOGICA CLIENTES ---
    const handleCreateCompany = async () => {
        if (!newCompany.company_name || !newCompany.email || !newCompany.password) return alert("Faltan datos");
        try { await axios.post(`${API_URL}/register`, newCompany); alert("✅ Creada"); setShowModal(false); loadData(); setNewCompany({ company_name: '', email: '', password: '', phone: '' }); } catch (e) { alert("Error al crear"); }
    };
    const handleUpdateCompany = async () => {
        if(!editingCompany) return;
        try { await axios.put(`${API_URL}/users/${editingCompany.id}`, editingCompany); alert("✅ Actualizado"); setShowEditModal(false); loadData(); } catch { alert("Error"); }
    };
    const toggleStatus = async (id, current) => {
        try { await axios.put(`${API_URL}/users/${id}/status`, { is_active: !current }); loadData(); } catch { alert("Error"); }
    };

    // --- LOGICA CAPSULAS ---
    const handleCreateCapsule = async () => {
        if(!newCap.title) return alert("Falta título");
        try { await axios.post(`${API_URL}/capsules`, newCap); setModalCapsule(false); loadData(); setNewCap({ title: '', description: '' }); } catch { alert("Error"); }
    };
    const handleAddContent = async () => {
        if(!newContent.title || !newContent.url) return alert("Faltan datos");
        try { 
            await axios.post(`${API_URL}/contents`, { ...newContent, capsule_id: currentCapsule.id }); 
            setModalContent(false); 
            const resCap = await axios.get(`${API_URL}/capsules`);
            setCapsules(resCap.data);
            const updatedCap = resCap.data.find(c => c.id === currentCapsule.id);
            if (updatedCap) setCurrentCapsule(updatedCap);
            setNewContent({ title: '', url: '', type: 'video', capsule_id: '' });
        } catch { alert("Error"); }
    };
    const deleteCap = async (id) => { if(confirm("¿Borrar cápsula?")) { await axios.delete(`${API_URL}/capsules/${id}`); loadData(); }};
    const deleteCont = async (id) => { 
        if(confirm("¿Borrar archivo?")) { 
            await axios.delete(`${API_URL}/contents/${id}`); 
            const resCap = await axios.get(`${API_URL}/capsules`);
            setCapsules(resCap.data);
            const updatedCap = resCap.data.find(c => c.id === currentCapsule.id);
            if (updatedCap) setCurrentCapsule(updatedCap);
        }
    };
    const handleUpdateCapsule = async () => {
        try { await axios.put(`${API_URL}/capsules/${editingCapsule.id}`, editingCapsule); setEditCapsuleModal(false); loadData(); } catch { alert("Error"); }
    };

    const CompaniesView = () => {
        const [showPass, setShowPass] = useState({});
        return (
            <div>
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Gestión de Clientes</h2>
                    <button onClick={()=>setShowModal(true)} className="bg-[#6be1e3] text-[#1a181d] px-6 py-2 rounded-xl font-bold flex items-center hover:opacity-90 transition shadow-lg"><Plus className="mr-2 w-4 h-4"/> Nuevo Cliente</button>
                </header>
                <div className="space-y-4">
                    {empresas.map(emp => (
                        <div key={emp.id} className={`p-6 rounded-3xl border flex justify-between items-center transition group shadow-md ${emp.is_active ? 'bg-slate-800 border-slate-700 hover:border-[#6be1e3]' : 'bg-slate-900 border-red-900 opacity-60'}`}>
                            <div className="flex items-center gap-6">
                                <div className={`p-3 rounded-xl ${emp.is_active ? 'bg-slate-700 text-[#e17bd7]' : 'bg-red-900/20 text-red-500'}`}><Building/></div>
                                <div>
                                    <h3 className="font-bold text-xl text-white mb-1 flex items-center gap-2">{emp.company_name} {!emp.is_active && <span className="text-[10px] bg-red-500 px-2 py-0.5 rounded text-white">OFF</span>}</h3>
                                    <div className="flex gap-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1"><User size={14}/> {emp.email}</span>
                                        <span className="flex items-center cursor-pointer hover:text-white" onClick={()=>setShowPass({...showPass, [emp.id]: !showPass[emp.id]})}>
                                            <Lock size={14} className="mr-1"/> {showPass[emp.id] ? emp.visible_password : '••••••'}
                                        </span>
                                        {emp.phone && <span className="text-[#6be1e3] flex items-center gap-1"><Building size={14}/> {emp.phone}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={()=>{setEditingCompany(emp); setShowEditModal(true)}} className="p-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition" title="Editar"><Edit2 size={18}/></button>
                                <button onClick={()=>toggleStatus(emp.id, emp.is_active)} className={`p-3 rounded-xl transition ${emp.is_active ? 'bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white' : 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white'}`}><Power size={18}/></button>
                            </div>
                        </div>
                    ))}
                    {empresas.length === 0 && <div className="text-center p-10 text-slate-500 bg-slate-800/30 rounded-2xl">No hay clientes registrados.</div>}
                </div>
                {/* MODAL ALTA */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[9999] backdrop-blur-md">
                        <div className="bg-white p-8 rounded-3xl w-full max-w-md relative shadow-2xl">
                            <div className="flex justify-between mb-6"><h3 className="font-bold text-xl text-[#1a181d]">Alta Cliente</h3><button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-black"><X size={20}/></button></div>
                            <div className="space-y-4">
                                <input className="w-full p-3 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="Nombre Empresa" onChange={e => setNewCompany({...newCompany, company_name: e.target.value})} />
                                <input className="w-full p-3 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="Email Admin" onChange={e => setNewCompany({...newCompany, email: e.target.value})} />
                                <input className="w-full p-3 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="Teléfono" onChange={e => setNewCompany({...newCompany, phone: e.target.value})} />
                                <input className="w-full p-3 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-cyan-500 outline-none" type="password" placeholder="Contraseña" onChange={e => setNewCompany({...newCompany, password: e.target.value})} />
                                <button onClick={handleCreateCompany} className="w-full bg-[#1a181d] text-white p-3 rounded-lg font-bold hover:opacity-90 mt-2 shadow-lg">Guardar</button>
                            </div>
                        </div>
                    </div>
                )}
                {/* MODAL EDITAR */}
                {showEditModal && editingCompany && (
                    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[9999] backdrop-blur-md">
                        <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                            <div className="flex justify-between mb-6"><h3 className="font-bold text-xl text-[#1a181d]">Editar Cliente</h3><button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-black"><X size={20}/></button></div>
                            <div className="space-y-4">
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Nombre</label><input className="w-full p-3 rounded-lg bg-white border border-slate-300 text-black mt-1" value={editingCompany.company_name} onChange={e => setEditingCompany({...editingCompany, company_name: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Email</label><input className="w-full p-3 rounded-lg bg-white border border-slate-300 text-black mt-1" value={editingCompany.email} onChange={e => setEditingCompany({...editingCompany, email: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Teléfono</label><input className="w-full p-3 rounded-lg bg-white border border-slate-300 text-black mt-1" value={editingCompany.phone || ''} onChange={e => setEditingCompany({...editingCompany, phone: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Nueva Clave (Opcional)</label><input className="w-full p-3 rounded-lg bg-white border border-slate-300 text-black mt-1" placeholder="Dejar vacía para no cambiar" onChange={e => setEditingCompany({...editingCompany, password: e.target.value})} /></div>
                                <button onClick={handleUpdateCompany} className="w-full bg-[#6be1e3] text-[#1a181d] p-3 rounded-lg font-bold hover:opacity-90 mt-2 shadow-lg">Actualizar Datos</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const CapsulesAdminView = () => {
        const visibleCapsules = capsules.filter(c => c.title.toLowerCase().includes(searchCapsule.toLowerCase()));
        
        if (!currentCapsule) return (
            <div>
                <div className="flex justify-between items-center mb-8 gap-4">
                    <div className="flex gap-4 items-center bg-slate-800 p-2 rounded-xl px-4 border border-slate-700 flex-1 max-w-md">
                         <Search size={20} className="text-slate-400"/>
                         <input className="bg-transparent outline-none text-white w-full" placeholder="Buscar cápsula..." value={searchCapsule} onChange={e=>setSearchCapsule(e.target.value)}/>
                    </div>
                    <div className="flex gap-3">
                         <button onClick={()=>{setSearchCapsule(''); loadData()}} className="bg-slate-700 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-600 flex items-center"><RefreshCw size={16} className="mr-2"/> Reiniciar</button>
                         <button onClick={()=>setModalCapsule(true)} className="bg-[#e17bd7] text-white px-4 py-2 rounded-xl font-bold flex items-center hover:opacity-90 shadow-lg shadow-pink-500/20"><Plus size={18} className="mr-2"/> Nueva Cápsula</button>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
                    <table className="w-full text-left text-slate-300">
                        <thead className="bg-slate-900 text-xs uppercase font-bold text-slate-500">
                            <tr><th className="p-6">ID</th><th className="p-6">Cápsula</th><th className="p-6 text-center">Acciones</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {visibleCapsules.map(cap => (
                                <tr key={cap.id} className="hover:bg-slate-700/50 transition cursor-pointer" onClick={()=>setCurrentCapsule(cap)}>
                                    <td className="p-6 font-mono text-[#e4c76a] font-bold">#{cap.id}</td>
                                    <td className="p-6"><div className="flex items-center gap-3"><Folder className="text-[#e4c76a]"/><div className="flex flex-col"><span className="font-bold text-white text-lg">{cap.title}</span><span className="text-xs text-slate-500">{cap.description}</span></div></div></td>
                                    <td className="p-6 text-center flex justify-center gap-2">
                                        <button onClick={(e)=>{e.stopPropagation(); setEditingCapsule(cap); setEditCapsuleModal(true)}} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition" title="Editar"><Edit2 size={18}/></button>
                                        <button onClick={(e)=>{e.stopPropagation(); handleDeleteCapsule(cap.id)}} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition" title="Eliminar"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visibleCapsules.length === 0 && <div className="p-10 text-center text-slate-500">No se encontraron cápsulas.</div>}
                </div>
                {/* Modal Nueva Cápsula */}
                {modalCapsule && <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[9999]"><div className="bg-white p-6 rounded-2xl w-96"><h3 className="font-bold text-black mb-4 text-xl">Nueva Cápsula</h3><input className="w-full border border-slate-300 p-3 mb-3 rounded-lg text-black focus:ring-2 focus:ring-[#e17bd7] outline-none" placeholder="Título" onChange={e=>setNewCap({...newCap, title:e.target.value})}/><input className="w-full border border-slate-300 p-3 mb-6 rounded-lg text-black focus:ring-2 focus:ring-[#e17bd7] outline-none" placeholder="Descripción" onChange={e=>setNewCap({...newCap, description:e.target.value})}/><div className="flex gap-2"><button onClick={handleCreateCapsule} className="flex-1 bg-[#1a181d] text-white p-3 rounded-lg font-bold hover:opacity-90">Crear</button><button onClick={()=>setModalCapsule(false)} className="text-red-500 px-4">Cancelar</button></div></div></div>}
                {/* Modal Editar Cápsula */}
                {editCapsuleModal && editingCapsule && <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"><div className="bg-white p-6 rounded-2xl w-96"><h3 className="font-bold text-black mb-4 text-xl">Editar Cápsula</h3><input className="w-full border border-slate-200 p-3 mb-3 rounded-lg text-black" value={editingCapsule.title} onChange={e=>setEditingCapsule({...editingCapsule, title:e.target.value})}/><input className="w-full border border-slate-200 p-3 mb-6 rounded-lg text-black" value={editingCapsule.description} onChange={e=>setEditingCapsule({...editingCapsule, description:e.target.value})}/><div className="flex gap-2"><button onClick={handleUpdateCapsule} className="flex-1 bg-blue-600 text-white p-3 rounded-lg font-bold">Actualizar</button><button onClick={()=>setEditCapsuleModal(false)} className="text-red-500 px-4">Cancelar</button></div></div></div>}
            </div>
        );

        return (
            <div>
                <header className="flex items-center justify-between mb-8 bg-slate-800 p-6 rounded-3xl border border-slate-700">
                    <div className="flex items-center gap-4">
                        <button onClick={()=>setCurrentCapsule(null)} className="p-3 bg-slate-700 rounded-xl hover:bg-white hover:text-black transition"><ArrowLeft/></button>
                        <div><p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Carpeta</p><h2 className="text-2xl font-bold text-white flex items-center gap-2"><Folder className="text-[#e4c76a]"/> {currentCapsule.title}</h2></div>
                    </div>
                    <button onClick={()=>setModalContent(true)} className="bg-[#6be1e3] text-[#1a181d] px-6 py-3 rounded-xl font-bold flex items-center hover:opacity-90 shadow-lg"><Upload className="mr-2 w-5 h-5"/> Subir Material</button>
                </header>

                <div className="grid md:grid-cols-3 gap-6">
                    {currentCapsule.contents.map(cont => (
                        <div key={cont.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-[#6be1e3] transition group relative">
                            <button onClick={()=>deleteCont(cont.id)} className="absolute top-4 right-4 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={18}/></button>
                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mb-4 text-white">{cont.type === 'video' ? <PlayCircle/> : <FileText/>}</div>
                            <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{cont.title}</h3>
                            <a href={cont.url} target="_blank" className="text-xs text-[#6be1e3] hover:underline break-all block mb-4">{cont.url}</a>
                            <span className="text-[10px] bg-slate-900 text-slate-400 px-3 py-1 rounded-full uppercase font-bold tracking-wider">{cont.type}</span>
                        </div>
                    ))}
                    {currentCapsule.contents.length === 0 && <div className="col-span-3 text-center p-12 text-slate-500 border-2 border-dashed border-slate-700 rounded-3xl">Carpeta vacía. Sube el primer archivo.</div>}
                </div>

                {/* Modal Subir Contenido */}
                {modalContent && <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[9999]"><div className="bg-white p-8 rounded-3xl w-full max-w-md relative"><div className="flex justify-between mb-6"><h3 className="font-bold text-xl text-[#1a181d]">Subir Material</h3><button onClick={()=>setModalContent(false)} className="text-slate-400"><X/></button></div><input className="w-full p-4 bg-white border border-slate-300 rounded-xl text-black mb-3 outline-none focus:ring-2 focus:ring-[#6be1e3]" placeholder="Título del Archivo" onChange={e=>setNewContent({...newContent, title:e.target.value})}/><input className="w-full p-4 bg-white border border-slate-300 rounded-xl text-black mb-3 outline-none focus:ring-2 focus:ring-[#6be1e3]" placeholder="Link (URL)" onChange={e=>setNewContent({...newContent, url:e.target.value})}/><div className="flex gap-2 mb-6"><button onClick={()=>setNewContent({...newContent, type:'video'})} className={`flex-1 p-3 rounded-xl font-bold transition ${newContent.type==='video'?'bg-[#6be1e3] text-black':'bg-slate-100 text-slate-400'}`}>Video</button><button onClick={()=>setNewContent({...newContent, type:'pdf'})} className={`flex-1 p-3 rounded-xl font-bold transition ${newContent.type==='pdf'?'bg-[#6be1e3] text-black':'bg-slate-100 text-slate-400'}`}>PDF</button></div><button onClick={handleAddContent} className="w-full bg-[#1a181d] text-white p-4 rounded-xl font-bold hover:opacity-90">Subir Archivo</button></div></div>}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#1a181d] text-white flex font-sans">
            <aside className="w-80 p-10 border-r border-slate-800 bg-[#1a181d] flex flex-col fixed h-full z-10">
                <div className="mb-12"><LogoOne/></div>
                <div className="mb-10"><p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Rol</p><h1 className="text-2xl font-bold text-white">Super Admin</h1></div>
                <nav className="space-y-3 flex-1">
                    <button onClick={()=>setActiveTab('empresas')} className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center ${activeTab==='empresas' ? 'bg-[#e17bd7] text-white font-bold shadow-lg shadow-[#e17bd7]/20 translate-x-2':'text-slate-400 hover:text-white hover:bg-white/5'}`}><Building className="mr-3 w-5 h-5"/> Clientes</button>
                    <button onClick={()=>setActiveTab('capsulas')} className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center ${activeTab==='capsulas' ? 'bg-[#e4c76a] text-[#1a181d] font-bold shadow-lg shadow-[#e4c76a]/20 translate-x-2':'text-slate-400 hover:text-white hover:bg-white/5'}`}><Folder className="mr-3 w-5 h-5"/> Contenidos</button>
                </nav>
                <button onClick={()=>navigate('/login')} className="mt-12 text-red-400 text-sm flex items-center font-bold px-4 py-3 rounded-xl hover:bg-white/5 transition"><LogOut className="w-4 h-4 mr-3"/> Cerrar Sesión</button>
            </aside>
            <main className="flex-1 ml-80 p-12">
                <h2 className="text-4xl font-bold mb-10 tracking-tight">{activeTab === 'empresas' ? 'Gestión de Clientes SaaS' : 'Biblioteca Global'}</h2>
                {activeTab === 'empresas' ? <CompaniesView/> : <CapsulesAdminView/>}
            </main>
        </div>
    );
}