import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, ChevronRight, Clock } from 'lucide-react';

const API_URL = 'https://plataformaventas.onrender.com';

export default function EmployeePortal() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [view, setView] = useState('select');
    const [products, setProducts] = useState([]);
    const [session, setSession] = useState(null);
    const [msgs, setMsgs] = useState([]);
    const [input, setInput] = useState('');
    const [agent, setAgent] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState(null);

    // ✅ Cronómetro
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user.id) navigate('/login');
        axios.get(`${API_URL}/company/${user.company_id}/products`).then(res => setProducts(res.data));
    }, []);

    useEffect(() => scrollToBottom(), [msgs]);

    // ✅ Limpiar timer al desmontar el componente
    useEffect(() => () => clearInterval(timerRef.current), []);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const startTimer = () => {
        setElapsedSeconds(0);
        timerRef.current = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
    };

    const stopTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = null;
    };

    const start = async (pid) => {
        const res = await axios.post(`${API_URL}/chat/start`, { employee_id: user.id, prototype_id: pid });
        setSession(res.data.session_id);
        setAgent(res.data.agent_name);
        setMsgs([{ role: 'ai', content: res.data.initial_message }]);
        setView('chat');
        startTimer(); // ✅ Arrancar cronómetro al iniciar chat
    };

    const send = async () => {
        if (!input.trim() || loading) return;
        const newMsgs = [...msgs, { role: 'user', content: input }];
        setMsgs(newMsgs);
        setInput('');
        setLoading(true);
        const res = await axios.post(`${API_URL}/chat/message`, { session_id: session, message: input });
        setMsgs([...newMsgs, { role: 'ai', content: res.data.response }]);
        setLoading(false);
    };

    // ✅ end() detiene el cronómetro y envía duration_seconds al backend
    const end = async () => {
        stopTimer();
        const duration = elapsedSeconds;
        setView('loading');
        try {
            const res = await axios.post(`${API_URL}/chat/feedback`, {
                session_id: session,
                duration_seconds: duration  // ✅ Enviado correctamente al backend
            });
            setFeedback(res.data.feedback || '');
            setScore(res.data.score ?? null);
            setView('done');
        } catch {
            setFeedback('Error al generar la evaluación. Intentá de nuevo.');
            setView('done');
        }
    };

    // Renderizar feedback con formato visual
    const renderFeedback = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => {
            if (line.startsWith('CALIFICACIÓN:')) return null;
            if (line.match(/^[✅⚠️💡🎯]/u)) return <h3 key={i} className="font-bold mt-5 mb-1 text-slate-800">{line}</h3>;
            if (line.startsWith('- ')) return <li key={i} className="ml-5 text-slate-600 text-sm list-disc">{line.slice(2)}</li>;
            if (line.trim() === '') return null;
            return <p key={i} className="text-slate-600 text-sm mt-1">{line}</p>;
        });
    };

    // ── VISTA: SELECCIÓN ──
    if (view === 'select') return (
        <div className="min-h-screen bg-slate-50 p-10">
            <header className="flex justify-between mb-10">
                <h1 className="text-2xl font-bold">Hola, {user.name}</h1>
                <button onClick={() => navigate('/login')} className="text-red-500">Salir</button>
            </header>
            <div className="grid md:grid-cols-2 gap-6">
                {products.map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-[#e17bd7]">{p.name}</h3>
                        <div className="space-y-2">
                            {p.prototypes.map(pr => (
                                <button key={pr.id} onClick={() => start(pr.id)}
                                    className="w-full text-left p-3 border rounded-lg hover:bg-slate-50 flex justify-between items-center">
                                    {pr.name} <ChevronRight />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // ── VISTA: CHAT ──
    if (view === 'chat') return (
        <div className="h-screen bg-slate-100 flex flex-col p-4 max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-t-2xl flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="font-bold">{agent} · Cliente Virtual</h3>
                </div>
                {/* ✅ Cronómetro visible */}
                <div className="flex items-center gap-1 text-slate-500 text-sm font-mono bg-slate-100 px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(elapsedSeconds)}</span>
                </div>
                <button onClick={end}
                    className="bg-red-50 text-red-500 px-4 py-1 rounded font-bold hover:bg-red-100">
                    Terminar y Evaluar
                </button>
            </div>
            <div className="flex-1 bg-white p-6 overflow-y-auto space-y-4 shadow-lg mb-4 rounded-b-2xl">
                {msgs.map((m, i) => (
                    <div key={i} className={`p-4 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-[#1a181d] text-white ml-auto' : 'bg-slate-100'}`}>
                        {m.content}
                    </div>
                ))}
                {loading && (
                    <div className="bg-slate-100 p-4 rounded-2xl max-w-[80%] text-slate-400 italic text-sm animate-pulse">
                        Escribiendo...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2">
                <input
                    className="flex-1 p-4 rounded-xl shadow-sm outline-none border border-slate-200"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && send()}
                    placeholder="Escribí tu respuesta como vendedor..."
                    disabled={loading}
                />
                <button onClick={send} disabled={loading}
                    className="bg-[#6be1e3] p-4 rounded-xl font-bold disabled:opacity-50">
                    <Send />
                </button>
            </div>
        </div>
    );

    // ── VISTA: CARGANDO EVALUACIÓN ──
    if (view === 'loading') return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
                <div className="w-12 h-12 border-4 border-[#6be1e3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-slate-700">Generando tu evaluación...</h2>
                <p className="text-slate-400 text-sm mt-2">Esto puede tardar unos segundos.</p>
            </div>
        </div>
    );

    // ── VISTA: RESULTADO ──
    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Encabezado con puntaje */}
                    <div className="bg-[#1a181d] text-white p-8 text-center">
                        <h2 className="text-2xl font-bold mb-2">Tu Evaluación</h2>
                        {score !== null && (
                            <div className="mt-4">
                                <span className="text-7xl font-black text-[#6be1e3]">{score}</span>
                                <span className="text-3xl text-slate-400">/10</span>
                                <p className="text-slate-400 text-sm mt-2">PUNTAJE FINAL</p>
                            </div>
                        )}
                    </div>
                    {/* Contenido del feedback */}
                    <div className="p-8">
                        {renderFeedback(feedback)}
                    </div>
                    {/* Botón volver */}
                    <div className="px-8 pb-8">
                        <button
                            onClick={() => { setView('select'); setFeedback(''); setScore(null); setElapsedSeconds(0); }}
                            className="w-full bg-[#1a181d] text-white py-4 rounded-xl font-bold text-lg hover:opacity-90">
                            Volver a Entrenar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}