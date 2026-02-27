import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, CheckCircle, ChevronRight } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000';

export default function EmployeePortal() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [view, setView] = useState('select');
    const [products, setProducts] = useState([]);
    const [session, setSession] = useState(null);
    const [msgs, setMsgs] = useState([]);
    const [input, setInput] = useState('');
    const [agent, setAgent] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(()=>{ 
        if(!user.id) navigate('/login');
        axios.get(`${API_URL}/company/${user.company_id}/products`).then(res=>setProducts(res.data)) 
    }, []);
    
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => scrollToBottom(), [msgs]);

    const start = async (pid) => { const res = await axios.post(`${API_URL}/chat/start`, {employee_id:user.id, prototype_id:pid}); setSession(res.data.session_id); setAgent(res.data.agent_name); setMsgs([{role:'ai', content:res.data.initial_message}]); setView('chat'); };
    const send = async () => { const news = [...msgs, {role:'user', content:input}]; setMsgs(news); setInput(''); const res = await axios.post(`${API_URL}/chat/message`, {session_id:session, message:input}); setMsgs([...news, {role:'ai', content:res.data.response}]); };
    const end = async () => { await axios.post(`${API_URL}/chat/feedback`, {session_id:session}); setView('done'); };

    if(view==='select') return <div className="min-h-screen bg-slate-50 p-10"><header className="flex justify-between mb-10"><h1 className="text-2xl font-bold">Hola, {user.name}</h1><button onClick={()=>navigate('/login')} className="text-red-500">Salir</button></header><div className="grid md:grid-cols-2 gap-6">{products.map(p=><div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm"><h3 className="font-bold text-lg mb-4 text-[#e17bd7]">{p.name}</h3><div className="space-y-2">{p.prototypes.map(pr=><button key={pr.id} onClick={()=>start(pr.id)} className="w-full text-left p-3 border rounded-lg hover:bg-slate-50 flex justify-between">{pr.name} <ChevronRight/></button>)}</div></div>)}</div></div>;
    if(view==='chat') return <div className="h-screen bg-slate-100 flex flex-col p-4 max-w-4xl mx-auto"><div className="bg-white p-4 rounded-t-2xl flex justify-between shadow-sm"><div className="flex items-center gap-3"><div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div><h3 className="font-bold">{agent}</h3></div><button onClick={end} className="bg-red-50 text-red-500 px-4 py-1 rounded font-bold">Terminar</button></div><div className="flex-1 bg-white p-6 overflow-y-auto space-y-4 shadow-lg mb-4 rounded-b-2xl">{msgs.map((m,i)=><div key={i} className={`p-4 rounded-2xl max-w-[80%] ${m.role==='user'?'bg-[#1a181d] text-white ml-auto':'bg-slate-100'}`}>{m.content}</div>)}<div ref={messagesEndRef}/></div><div className="flex gap-2"><input className="flex-1 p-4 rounded-xl shadow-sm outline-none" value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&send()}/><button onClick={send} className="bg-[#6be1e3] p-4 rounded-xl font-bold"><Send/></button></div></div>;
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="bg-white p-10 rounded-3xl shadow-xl text-center"><CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/><h2 className="text-2xl font-bold mb-4">Entrenamiento Guardado</h2><button onClick={()=>setView('select')} className="bg-[#1a181d] text-white px-6 py-3 rounded-xl font-bold">Volver</button></div></div>;
}