import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Bot, CheckCircle, ArrowRight, Lock, User,
  Settings, Save, Send, LogOut, Building, Plus, X, Trash2,
  Award, FileText, Zap, LayoutDashboard, Users, Package, PlayCircle, Folder, Eye, ChevronRight,
  BrainCircuit, Layers, Target, ArrowLeft, Upload, Search, RefreshCw, Power, Edit2, Phone, EyeOff,
  MessageSquare, Star, BarChart2, BookOpen, TrendingUp, Mic, Image as ImageIcon
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
      className={`${small ? 'h-14' : 'h-20'} w-auto object-contain heartbeat`}
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
// RICH TEXT EDITOR
// ============================================================
const EMOJI_LIST = [
  '😀','😂','😊','😍','🤔','😎','👍','👋','🙌','💪',
  '🔥','⭐','✅','❌','⚠️','💡','📌','🎯','📊','💰',
  '🚀','💼','🏆','📋','🔑','💎','📈','🤝','👀','✨',
  '1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','🅰️','🅱️','©️'
];
const TEXT_COLORS = [
  '#1a181d','#e17bd7','#6be1e3','#e4c76a',
  '#ef4444','#3b82f6','#22c55e','#f97316',
  '#8b5cf6','#64748b','#ffffff','#000000'
];
const HIGHLIGHT_COLORS = [
  '#fef08a','#bbf7d0','#bfdbfe','#fecaca',
  '#e9d5ff','#fed7aa','#c7f2f3','#f5d0f0'
];

function RichTextEditor({ value, onChange, placeholder, minHeight = '120px' }) {
  const editorRef = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showTextColor, setShowTextColor] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const savedRange = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (editorRef.current && !initialized.current) {
      editorRef.current.innerHTML = value || '';
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    const close = () => { setShowEmoji(false); setShowTextColor(false); setShowHighlight(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    if (savedRange.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const exec = (cmd, val = null) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    onChange(editorRef.current.innerHTML);
  };

  const applyTextColor = (color) => { restoreSelection(); exec('foreColor', color); setShowTextColor(false); };
  const applyHighlight = (color) => { restoreSelection(); exec('hiliteColor', color); setShowHighlight(false); };

  const insertEmoji = (emoji) => {
    restoreSelection();
    editorRef.current.focus();
    document.execCommand('insertText', false, emoji);
    onChange(editorRef.current.innerHTML);
    setShowEmoji(false);
  };

  const ToolBtn = ({ onAction, title, children }) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); e.stopPropagation(); saveSelection(); onAction(); }}
      title={title}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition hover:bg-slate-200 text-slate-600 hover:text-slate-900"
    >{children}</button>
  );

  return (
    <div className="border rounded-xl overflow-visible bg-white focus-within:ring-2 focus-within:ring-[#e17bd7] transition" style={{ position: 'relative' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-2 border-b bg-slate-50 rounded-t-xl flex-wrap sticky top-0 z-50">
        <ToolBtn onAction={() => exec('bold')} title="Negrita"><b>B</b></ToolBtn>
        <ToolBtn onAction={() => exec('italic')} title="Cursiva"><i className="not-italic font-serif">I</i></ToolBtn>
        <ToolBtn onAction={() => exec('underline')} title="Subrayado"><u>S</u></ToolBtn>
        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Color de texto */}
        <div style={{ position: 'relative' }} onMouseDown={e => e.stopPropagation()}>
          <button type="button"
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); saveSelection(); setShowTextColor(v => !v); setShowHighlight(false); setShowEmoji(false); }}
            title="Color de texto"
            className="w-8 h-8 rounded-lg flex flex-col items-center justify-center gap-0.5 hover:bg-slate-200 transition">
            <span className="text-xs font-extrabold text-slate-700 leading-none">A</span>
            <span className="w-4 h-1 rounded-sm" style={{ backgroundColor: '#e17bd7' }}></span>
          </button>
          {showTextColor && (
            <div style={{ position: 'absolute', top: '36px', left: 0, zIndex: 9999 }}
              className="bg-white border rounded-xl shadow-2xl p-2 grid grid-cols-4 gap-1 w-28"
              onMouseDown={e => e.stopPropagation()}>
              {TEXT_COLORS.map(c => (
                <button key={c} type="button"
                  className="w-5 h-5 rounded-md border border-slate-200 hover:scale-125 transition"
                  style={{ backgroundColor: c }}
                  onMouseDown={e => { e.preventDefault(); e.stopPropagation(); applyTextColor(c); }} />
              ))}
            </div>
          )}
        </div>

        {/* Resaltado */}
        <div style={{ position: 'relative' }} onMouseDown={e => e.stopPropagation()}>
          <button type="button"
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); saveSelection(); setShowHighlight(v => !v); setShowTextColor(false); setShowEmoji(false); }}
            title="Resaltar texto"
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-200 transition text-base">
            🖊
          </button>
          {showHighlight && (
            <div style={{ position: 'absolute', top: '36px', left: 0, zIndex: 9999 }}
              className="bg-white border rounded-xl shadow-2xl p-2 grid grid-cols-4 gap-1 w-24"
              onMouseDown={e => e.stopPropagation()}>
              {HIGHLIGHT_COLORS.map(c => (
                <button key={c} type="button"
                  className="w-5 h-5 rounded-md border border-slate-200 hover:scale-125 transition"
                  style={{ backgroundColor: c }}
                  onMouseDown={e => { e.preventDefault(); e.stopPropagation(); applyHighlight(c); }} />
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Emojis */}
        <div style={{ position: 'relative' }} onMouseDown={e => e.stopPropagation()}>
          <button type="button"
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); saveSelection(); setShowEmoji(v => !v); setShowTextColor(false); setShowHighlight(false); }}
            title="Insertar emoji"
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-200 transition text-base">
            😊
          </button>
          {showEmoji && (
            <div style={{ position: 'absolute', top: '36px', left: 0, zIndex: 9999 }}
              className="bg-white border rounded-xl shadow-2xl p-3 grid grid-cols-8 gap-1 w-56"
              onMouseDown={e => e.stopPropagation()}>
              {EMOJI_LIST.map((em, i) => (
                <button key={i} type="button"
                  className="w-6 h-6 text-sm hover:scale-125 transition flex items-center justify-center rounded"
                  onMouseDown={e => { e.preventDefault(); e.stopPropagation(); insertEmoji(em); }}>
                  {em}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ToolBtn onAction={() => exec('insertUnorderedList')} title="Lista con viñetas"><span className="text-xs">≡</span></ToolBtn>
        <ToolBtn onAction={() => exec('removeFormat')} title="Quitar formato"><span className="text-xs">✕</span></ToolBtn>
      </div>

      {/* Área editable */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current.innerHTML)}
        onBlur={() => onChange(editorRef.current.innerHTML)}
        onPaste={(e) => {
        e.preventDefault();
        const html = e.clipboardData.getData('text/html');
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, html || text);
        onChange(editorRef.current.innerHTML);
      }}
        className="p-4 text-sm text-slate-700 outline-none leading-relaxed"
        style={{ minHeight, whiteSpace: 'pre-wrap' }}
        data-placeholder={placeholder}
      />
      <style>{`[contenteditable]:empty:before{content:attr(data-placeholder);color:#94a3b8;pointer-events:none;}`}</style>
    </div>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================
function LandingPage() {
  const navigate = useNavigate();
  useEffect(() => { document.title = 'ONE Commercial IA'; }, []);
  useEffect(() => {
    const ping = () => fetch(`${API_URL}/docs`).catch(() => {});
    ping();
    const interval = setInterval(ping, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const PC = ['#6be1e3','#e17bd7','#e4c76a'];
    const nodes = []; const MAX = 150; const CD = 85;
    let W, H, mx=-9999, my=-9999;
    let sx=-9999, sy=-9999, has=false, last=0, t=0, animId;
    const resize = () => { W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){has=false;return;}
      mx=e.clientX-r.left; my=e.clientY-r.top;
      if(!has){sx=mx;sy=my;} has=true;
    };
    document.addEventListener('mousemove', onMove);

    const spawnCircle = (cx, cy) => {
      const count = 3 + Math.floor(Math.random() * 3);
      for(let i = 0; i < count; i++){
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 100;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        if(x<-20||x>W+20||y<-20||y>H+20) continue;
        const color = PC[Math.floor(Math.random()*PC.length)];
        // perpendicular al radio — hace que floten en arco, no al centro
        const px = -Math.sin(angle), py = Math.cos(angle);
        nodes.push({
          x, y,
          ox: x, oy: y,          // origen = donde nace, no el centro
          vx: px*(0.1+Math.random()*0.15) + (Math.random()-0.5)*0.08,
          vy: py*(0.1+Math.random()*0.15) + (Math.random()-0.5)*0.08,
          r: 1.8+Math.random()*2,
          color, alpha: 0,
          ta: 0.3+Math.random()*0.35,
          life: 1,
          decay: 0.0016+Math.random()*0.0014,
          wph: Math.random()*Math.PI*2,
          wa: 0.25+Math.random()*0.45,
          ws: 0.006+Math.random()*0.009,
          wp: Math.random()*Math.PI*2,
          px, py
        });
      }
      while(nodes.length > MAX) nodes.shift();
    };

    const animate = (now) => {
      ctx.clearRect(0,0,W,H); t+=0.012;
      if(has){
        sx+=(mx-sx)*0.05; sy+=(my-sy)*0.05;
        if(now-last>90){ spawnCircle(sx,sy); last=now; }
      }
      for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i],b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<CD){const s=1-d/CD;ctx.save();ctx.globalAlpha=s*Math.min(a.alpha,b.alpha)*0.45;
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=a.color;ctx.lineWidth=0.5;ctx.stroke();ctx.restore();}
      }
      for(let i=nodes.length-1;i>=0;i--){
        const n=nodes[i]; n.life-=n.decay;
        if(n.life<=0){nodes.splice(i,1);continue;}
        if(n.alpha<n.ta) n.alpha+=0.035;
        const fade=n.life<0.3?n.life/0.3:1, a=n.alpha*fade;
        n.wp+=n.ws;
        const wave=Math.sin(t*1.2+n.wph)*n.wa;
        n.vx+=n.px*wave*0.018; n.vy+=n.py*wave*0.018;
        n.vx+=(n.ox-n.x)*0.004; n.vy+=(n.oy-n.y)*0.004;
        n.vx*=0.94; n.vy*=0.94; n.x+=n.vx; n.y+=n.vy;
        ctx.save();ctx.globalAlpha=a;ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fillStyle=n.color;ctx.fill();ctx.restore();
        ctx.save();ctx.globalAlpha=a*0.1;ctx.beginPath();ctx.arc(n.x,n.y,n.r*3.5,0,Math.PI*2);ctx.fillStyle=n.color;ctx.fill();ctx.restore();
      }
      animId=requestAnimationFrame(animate);
    };
    animId=requestAnimationFrame(animate);
    return () => { window.removeEventListener('resize',resize); document.removeEventListener('mousemove',onMove); cancelAnimationFrame(animId); };
  }, []);

  return (
    <div className="font-sans flex flex-col" style={{ backgroundColor: COLORS.white }}>
      <div className="relative overflow-hidden flex flex-col">
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />

        {/* Gradientes decorativos de fondo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#e17bd7]/10 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-[#6be1e3]/10 to-transparent rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Nav */}
      <nav className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6 max-w-7xl mx-auto w-full relative z-20">
        <LogoOne />
        <button 
          onClick={() => navigate('/login')} 
          className="px-6 py-2 rounded-full font-bold text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 text-sm heartbeat" 
          style={{ backgroundColor: COLORS.black }}
        >
          Ingresar
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 w-full max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16 mt-8">
          <div className="inline-block px-3 py-1 mb-4 md:mb-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase border border-slate-200 rounded-full">
            Ecosistema ONE | Human-Tech
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-[#1a181d]">
            Sistema Integral de Inteligencia y<br />
            <span className={COLORS.gradient_text}>Entrenamiento Comercial</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed px-2 md:px-0">
            ONE Commercial IA es una plataforma de entrenamiento comercial con IA diseñada para que las empresas capaciten, evalúen y potencien a sus equipos de ventas de forma práctica, medible y escalable. A través de simulaciones con clientes virtuales, feedback automático y cápsulas de conocimiento, cada vendedor puede entrenar conversaciones reales, perfeccionar su desempeño y convertir cada interacción en una oportunidad de mejora.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="text-white px-8 py-4 rounded-xl text-base font-bold shadow-xl transition-all hover:scale-105 flex items-center mx-auto gap-2 group heartbeat"
            style={{ background: `linear-gradient(90deg, ${COLORS.cyan} 0%, ${COLORS.pink} 100%)` }}
          >
            Comenzar Ahora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full mb-10 md:mb-16 px-2 md:px-0">
          {/* Simulación */}
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 group relative overflow-hidden heartbeat">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6be1e3]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${COLORS.cyan}15`, color: COLORS.cyan }}>
                <BrainCircuit size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a181d]">Simulación de Escenarios</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4 font-semibold">
                Entrenamiento inmersivo con clientes virtuales impulsados por IA.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Tus vendedores practican conversaciones comerciales en tiempo real con perfiles de clientes diseñados según producto, contexto, objeciones y estilo de comunicación. Cada simulación replica situaciones reales de venta, negociación y presión comercial para mejorar argumentación, escucha, manejo de objeciones y cierre.
              </p>
            </div>
          </div>

          {/* Cápsulas */}
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 group relative overflow-hidden heartbeat">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e17bd7]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${COLORS.pink}15`, color: COLORS.pink }}>
                <Layers size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a181d]">Cápsulas de Conocimiento</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4 font-semibold">
                Formación comercial personalizada para acompañar la mejora continua.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Centralizá videoclases, PDFs, materiales y recursos clave en una biblioteca de aprendizaje ordenada y accesible. La empresa puede habilitar contenidos específicos para cada vendedor según sus necesidades, acelerando su formación y reforzando habilidades comerciales de manera focalizada.
              </p>
            </div>
          </div>

          {/* Analítica */}
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 group relative overflow-hidden heartbeat">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e4c76a]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${COLORS.gold}15`, color: COLORS.gold }}>
                <Target size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a181d]">Analítica y Devolución</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4 font-semibold">
                Evaluación automática con feedback accionable para vender mejor.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Al finalizar cada sesión, la plataforma genera una devolución automática con puntuación, fortalezas, oportunidades de mejora y técnicas recomendadas. Así, cada entrenamiento se transforma en información útil para desarrollar vendedores más preparados, consistentes y efectivos.
              </p>
            </div>
          </div>
        </div>
      </main>
      </div>{/* fin hero wrapper */}

      {/* Footer */}
      <footer className="relative z-10">
        {/* Bloque sucursales */}
        <div style={{ backgroundColor: '#2a2730' }} className="px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Redes sociales */}
            <div className="flex justify-center gap-4 mb-10">
              <a href="https://www.facebook.com/escencialconsultora" target="_blank" rel="noreferrer"
                className="w-9 h-9 border border-slate-500 rounded flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition text-xs font-bold">f</a>
              <a href="https://www.instagram.com/escencialconsultora" target="_blank" rel="noreferrer"
                className="w-9 h-9 border border-slate-500 rounded flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition text-xs font-bold">ig</a>
              <a href="https://www.linkedin.com/company/escencialconsultora/" target="_blank" rel="noreferrer"
                className="w-9 h-9 border border-slate-500 rounded flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition text-xs font-bold">in</a>
            </div>
            {/* Sucursales */}
            <div className="grid md:grid-cols-3 gap-10 text-slate-300">
              {/* Tucumán */}
              <div>
                <h4 className="text-white font-bold text-base mb-3 pb-2 border-b border-slate-600">Sucursal Tucumán</h4>
                <p className="text-sm mb-1">Email: info@escencialconsult.com.ar</p>
                <p className="text-sm mb-1">Dirección: Catamarca 873 - San Miguel de Tucumán</p>
                <p className="text-sm mb-1">Teléfono: +54 9 3816 22-1565</p>
                <p className="text-sm">Celular: +54 9 3816 22-1565</p>
              </div>
              {/* Bolivia */}
              <div>
                <h4 className="text-white font-bold text-base mb-3 pb-2 border-b border-slate-600">Sucursal Bolivia</h4>
                <p className="text-sm mb-1">Manzana 40, torre 2, piso 10</p>
                <p className="text-sm mb-1">Santa Cruz de la Sierra, Bolivia</p>
                <p className="text-sm">Teléfono: +591 76030430</p>
              </div>
              {/* Buenos Aires */}
              <div>
                <h4 className="text-white font-bold text-base mb-3 pb-2 border-b border-slate-600">Sucursal Buenos Aires</h4>
                <p className="text-sm mb-1">Suipacha 946, C1008AAT</p>
                <p className="text-sm mb-1">Cdad. Autónoma de Buenos Aires</p>
                <p className="text-sm">Teléfono: +54 9 11 5006-1604</p>
              </div>
            </div>
          </div>
        </div>
        {/* Barra final */}
        <div style={{ backgroundColor: '#1a181d' }} className="px-8 py-3 flex justify-between items-center border-t border-[#e17bd7]/30">
          <p className="text-xs text-slate-500">
            <span style={{ color: '#6be1e3' }} className="font-bold">ONE</span> | Todos los derechos reservados. © 2026
          </p>
          <p className="text-xs text-slate-500">
            Desarrollado por <span style={{ color: '#6be1e3' }} className="font-bold">ONE</span> <span style={{ color: '#e17bd7' }}>by Escencial</span>
          </p>
        </div>
      </footer>
    </div>
  );
}


// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage() {
  const navigate = useNavigate();
  useEffect(() => { document.title = 'Login | ONE Commercial IA'; }, []);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      localStorage.setItem('user', JSON.stringify(res.data));
      if (res.data.is_super_admin) navigate('/super-admin');
      else if (res.data.type === 'company') navigate('/company-dashboard');
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
      <button
  onClick={() => navigate('/')}
  className="absolute top-6 left-6 text-slate-400 hover:text-[#1a181d] text-sm font-bold flex items-center gap-2 transition z-20"
>
  ← Volver
</button>
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
  useEffect(() => { document.title = 'Super Admin | ONE Commercial IA'; }, []);
  const [activeTab, setActiveTab] = useState('empresas');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeCompanyTab, setActiveCompanyTab] = useState('info');
  const [companyCapsules, setCompanyCapsules] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [capsules, setCapsules] = useState([]);
  const [currentCapsule, setCurrentCapsule] = useState(null);
  const [searchCapsule, setSearchCapsule] = useState('');
  const [modalCapsule, setModalCapsule] = useState(false);
  const [modalContent, setModalContent] = useState(false);
  const [editingCap, setEditingCap] = useState(null);
  const [editCapForm, setEditCapForm] = useState({ title: '', description: '' });
  const [newCompany, setNewCompany] = useState({ company_name: '', email: '', password: '', phone: '', mission_values: '' });
  const [editingCompany, setEditingCompany] = useState({ id: 0, company_name: '', email: '', password: '', phone: '', mission_values: '' });
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
      setNewCompany({ company_name: '', email: '', password: '', phone: '', mission_values: '' });
    } catch (e) { alert("Error: " + (e.response?.data?.detail || "Error desconocido")); }
  };

  const prepareEdit = async (emp) => {
    setEditingCompany({ id: emp.id, company_name: emp.company_name, email: emp.email, phone: emp.phone || '', password: '', mission_values: emp.mission_values || '' });
    setActiveCompanyTab('info');
    try {
      const res = await axios.get(`${API_URL}/companies/${emp.id}/capsules`);
      setCompanyCapsules(Array.isArray(res.data) ? res.data : []);
    } catch { setCompanyCapsules([]); }
    setShowEditModal(true);
  };

  const toggleCompanyCapsule = async (capsuleId) => {
    try {
      await axios.post(`${API_URL}/companies/${editingCompany.id}/capsules/${capsuleId}`);
      const res = await axios.get(`${API_URL}/companies/${editingCompany.id}/capsules`);
      setCompanyCapsules(Array.isArray(res.data) ? res.data : []);
    } catch { alert("Error al actualizar cápsula"); }
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

  const handleUpdateCapsule = async () => {
    if (!editCapForm.title) return alert("El título es obligatorio");
    try {
      await axios.put(`${API_URL}/capsules/${editingCap.id}`, editCapForm);
      setEditingCap(null);
      loadData();
    } catch { alert("Error al actualizar la cápsula"); }
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
    const [searchEmpresa, setSearchEmpresa] = useState('');
    const empresasFiltradas = empresas.filter(e => 
      e.company_name.toLowerCase().includes(searchEmpresa.toLowerCase()) ||
      e.email.toLowerCase().includes(searchEmpresa.toLowerCase())
    );
    return (
      <div>
        <header className="flex justify-between items-center mb-8 gap-4">
  <div className="flex gap-4 items-center bg-slate-800 p-2 rounded-xl px-4 border border-slate-700 flex-1 max-w-sm">
    <Search size={20} className="text-slate-400" />
    <input className="bg-transparent outline-none text-white w-full text-sm" placeholder="Buscar empresa..." value={searchEmpresa} onChange={e => setSearchEmpresa(e.target.value)} />
  </div>
  <button onClick={() => setShowModal(true)} className="bg-[#6be1e3] text-[#1a181d] px-6 py-2 rounded-xl font-bold flex items-center hover:opacity-90 transition shadow-lg">
    <Plus className="mr-2 w-4 h-4" /> Nuevo Cliente
  </button>
</header>
        {/* Mobile: cards */}
        <div className="md:hidden space-y-3">
          {empresasFiltradas.map(emp => (
            <div key={emp.id} className={`bg-slate-800 border border-slate-700 rounded-2xl p-4 ${!emp.is_active ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-white">{emp.company_name}</p>
                  <p className="text-xs text-slate-400">{emp.email}</p>
                  {!emp.is_active && <span className="text-[10px] bg-red-500 px-2 py-0.5 rounded text-white">INACTIVO</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => prepareEdit(emp)} className="p-2 bg-slate-700 text-slate-400 rounded-xl hover:bg-white hover:text-black transition"><Eye size={14} /></button>
                  <button onClick={() => toggleStatus(emp.id, emp.is_active)} className={`p-2 rounded-xl transition ${emp.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}><Power size={14} /></button>
                  <button onClick={() => deleteCompany(emp.id)} className="p-2 bg-slate-700 text-slate-400 rounded-xl hover:bg-red-600 hover:text-white transition"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-xs text-[#6be1e3]">{emp.phone || '—'}</p>
            </div>
          ))}
          {empresasFiltradas.length === 0 && <p className="text-center text-slate-500 py-6">No se encontraron resultados.</p>}
        </div>
        {/* Desktop: tabla */}
        <div className="hidden md:block bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-900 text-xs uppercase font-bold text-slate-500">
              <tr>
                <th className="p-5">Empresa</th>
                <th className="p-5">Email</th>
                <th className="p-5">Teléfono</th>
                <th className="p-5">Contraseña</th>
                <th className="p-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {empresasFiltradas.map(emp => (
                <tr key={emp.id} className={`transition hover:bg-slate-700/40 ${!emp.is_active ? 'opacity-50' : ''}`}>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${emp.is_active ? 'bg-slate-700 text-[#e17bd7]' : 'bg-red-900/20 text-red-500'}`}>
                        <Building size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-white">{emp.company_name}</p>
                        {!emp.is_active && <span className="text-[10px] bg-red-500 px-2 py-0.5 rounded text-white">INACTIVO</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-sm text-slate-400">{emp.email}</td>
                  <td className="p-5 text-sm text-[#6be1e3]">{emp.phone || '—'}</td>
                  <td className="p-5">
                    <span className="font-mono text-sm cursor-pointer hover:text-white transition" onClick={() => setShowPass({ ...showPass, [emp.id]: !showPass[emp.id] })}>
                      {showPass[emp.id] ? (emp.visible_password || '******') : '••••••'}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => prepareEdit(emp)} className="p-2 bg-slate-700 text-slate-400 rounded-xl hover:bg-white hover:text-black transition"><Eye size={16} /></button>
                      <button onClick={() => toggleStatus(emp.id, emp.is_active)} className={`p-2 rounded-xl transition ${emp.is_active ? 'bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white' : 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white'}`}><Power size={16} /></button>
                      <button onClick={() => deleteCompany(emp.id)} className="p-2 bg-slate-700 text-slate-400 rounded-xl hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {empresasFiltradas.length === 0 && (
                <tr><td colSpan={5} className="p-10 text-center text-slate-500">No se encontraron resultados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const GlobalPrototypesView = () => {
  const [globalProtos, setGlobalProtos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProto, setNewProto] = useState({
    name: '',
    description: '',
    objection: '',
    initial_state: '',
    communication_style: '',
    reaction_style: ''
  });
  const [search, setSearch] = useState('');

  const [viewProto, setViewProto] = useState(null);
  const [editProto, setEditProto] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    objection: '',
    initial_state: '',
    communication_style: '',
    reaction_style: ''
  });

  const openViewModal = (proto) => {
    setViewProto(proto);
  };

  const openEditModal = (proto) => {
    setEditProto(proto);
    setEditForm({
      name: proto.name || '',
      description: proto.description || '',
      objection: proto.objection || '',
      initial_state: proto.initial_state || '',
      communication_style: proto.communication_style || '',
      reaction_style: proto.reaction_style || ''
    });
  };

  const handleUpdate = async () => {
    if (!editForm.name || !editForm.description || !editForm.objection || !editForm.initial_state || !editForm.communication_style || !editForm.reaction_style) {
      return alert("Todos los campos son obligatorios, incluyendo estado inicial, estilo de comunicación y cómo reacciona");
    }

    try {
      await axios.put(`${API_URL}/global-prototypes/${editProto.id}`, editForm);
      setEditProto(null);
      loadProtos();
    } catch (e) {
      console.error(e);
      alert("Error al actualizar el prototipo");
    }
  };

  useEffect(() => { loadProtos(); }, []);

  const loadProtos = async () => {
    try {
      const res = await axios.get(`${API_URL}/global-prototypes`);
      setGlobalProtos(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); }
  };

  const handleCreate = async () => {
    if (!newProto.name || !newProto.description || !newProto.objection || !newProto.initial_state || !newProto.communication_style || !newProto.reaction_style) return alert("Todos los campos son obligatorios, incluyendo estado inicial, estilo de comunicación y cómo reacciona");
    try {
      await axios.post(`${API_URL}/global-prototypes`, newProto);
      setNewProto({
        name: '',
        description: '',
        objection: '',
        initial_state: '',
        communication_style: '',
        reaction_style: ''
      });
      setShowForm(false);
      loadProtos();
    } catch { alert("Error al crear prototipo"); }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar este prototipo global?")) {
      await axios.delete(`${API_URL}/global-prototypes/${id}`);
      loadProtos();
    }
  };

  const filtered = globalProtos.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8 gap-4">
        <div className="flex gap-4 items-center bg-slate-800 p-2 rounded-xl px-4 border border-slate-700 flex-1 max-w-md">
          <Search size={20} className="text-slate-400" />
          <input className="bg-transparent outline-none text-white w-full text-sm" placeholder="Buscar prototipo..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#6be1e3] text-[#1a181d] px-6 py-2 rounded-xl font-bold flex items-center hover:opacity-90 shadow-lg">
          <Plus className="mr-2 w-4 h-4" /> Nuevo Prototipo
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 border border-[#6be1e3] rounded-2xl p-6 mb-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Nuevo Prototipo Global</p>
          <div className="grid md:grid-cols-3 gap-3 mb-3">
            <input
              className="bg-slate-700 border border-slate-600 p-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
              placeholder="Nombre del perfil"
              value={newProto.name}
              onChange={e => setNewProto({ ...newProto, name: e.target.value })}
            />
            <input
              className="bg-slate-700 border border-slate-600 p-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
              placeholder="Descripción del cliente"
              value={newProto.description}
              onChange={e => setNewProto({ ...newProto, description: e.target.value })}
            />
            <input
              className="bg-slate-700 border border-slate-600 p-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
              placeholder="Objeción principal"
              value={newProto.objection}
              onChange={e => setNewProto({ ...newProto, objection: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-3 mb-3">
            <select
              className="bg-slate-700 border border-slate-600 p-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
              value={newProto.initial_state}
              onChange={e => setNewProto({ ...newProto, initial_state: e.target.value })}
            >
              <option value="">Estado inicial</option>
              <option value="tranquilo">Tranquilo</option>
              <option value="apurado">Apurado</option>
              <option value="indeciso">Indeciso</option>
              <option value="molesto">Molesto</option>
              <option value="distante">Distante</option>
              <option value="entusiasmado">Entusiasmado</option>
            </select>

            <select
              className="bg-slate-700 border border-slate-600 p-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
              value={newProto.communication_style}
              onChange={e => setNewProto({ ...newProto, communication_style: e.target.value })}
            >
              <option value="">Estilo de comunicación</option>
              <option value="cordial">Cordial</option>
              <option value="directo">Directo</option>
              <option value="analítico">Analítico</option>
              <option value="reservado">Reservado</option>
              <option value="conversador">Conversador</option>
              <option value="breve">Breve</option>
            </select>

            <select
              className="bg-slate-700 border border-slate-600 p-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
              value={newProto.reaction_style}
              onChange={e => setNewProto({ ...newProto, reaction_style: e.target.value })}
            >
              <option value="">Cómo reacciona</option>
              <option value="valora claridad">Valora claridad</option>
              <option value="responde a empatía">Responde a empatía</option>
              <option value="necesita precisión">Necesita precisión</option>
              <option value="rechaza presión">Rechaza presión</option>
              <option value="necesita confianza">Necesita confianza</option>
              <option value="valora rapidez">Valora rapidez</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="bg-[#6be1e3] text-black px-5 py-2 rounded-xl font-bold text-sm hover:opacity-80">Guardar</button>
            <button onClick={() => setShowForm(false)} className="text-slate-400 text-sm px-4 py-2 hover:text-white">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl overflow-x-auto">
        <table className="w-full text-left text-slate-300 min-w-[600px]">
          <thead className="bg-slate-900 text-xs uppercase font-bold text-slate-500">
            <tr>
              <th className="px-5 py-4 w-[18%]">Perfil</th>
              <th className="px-5 py-4 w-[37%]">Descripción</th>
              <th className="px-5 py-4 w-[30%]">Objeción Principal</th>
              <th className="px-5 py-4 text-center w-[15%]">Acc.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filtered.map(p => (
              <tr key={p.id} className="h-24 hover:bg-slate-700/40 transition align-middle">
                <td className="px-5 py-4 align-middle">
                  <p className="font-bold text-white text-sm line-clamp-2 overflow-hidden">
                    {p.name}
                  </p>
                </td>

                <td className="px-5 py-4 align-middle">
                  <p className="text-sm text-slate-400 line-clamp-2 overflow-hidden">
                    {p.description}
                  </p>
                </td>

                <td className="px-5 py-4 align-middle">
                  <div className="line-clamp-2 overflow-hidden">
                    <span className="text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded-lg inline-block">
                      {p.objection}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4 align-middle">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => openViewModal(p)}
                      className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl hover:bg-cyan-500 hover:text-white transition"
                      title="Ver"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 bg-slate-700 text-slate-400 rounded-xl hover:bg-red-600 hover:text-white transition"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-slate-500">
                  No hay prototipos globales todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

            {viewProto && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[99999] backdrop-blur-sm"
          onClick={() => setViewProto(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Prototipo Global</p>
                <h3 className="text-xl font-bold text-white mt-1">{viewProto.name}</h3>
              </div>
              <button
                onClick={() => setViewProto(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-sm">
              <div>
                <p className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-2">Descripción</p>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-slate-300">
                  {viewProto.description || '—'}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-2">Objeción principal</p>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-red-300">
                  {viewProto.objection || '—'}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-2">Estado inicial</p>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-slate-300 min-h-[72px]">
                    {viewProto.initial_state || '—'}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-2">Estilo de comunicación</p>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-slate-300 min-h-[72px]">
                    {viewProto.communication_style || '—'}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-2">Cómo reacciona</p>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-slate-300 min-h-[72px]">
                    {viewProto.reaction_style || '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editProto && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[99999] backdrop-blur-sm"
          onClick={() => setEditProto(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Editar Prototipo Global</p>
                <h3 className="text-xl font-bold text-white mt-1">{editProto.name}</h3>
              </div>
              <button
                onClick={() => setEditProto(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
                placeholder="Nombre del perfil"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />

              <textarea
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#6be1e3] min-h-[110px]"
                placeholder="Descripción"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />

              <textarea
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#6be1e3] min-h-[90px]"
                placeholder="Objeción principal"
                value={editForm.objection}
                onChange={(e) => setEditForm({ ...editForm, objection: e.target.value })}
              />

              <div className="grid md:grid-cols-3 gap-3">
                <select
                  className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
                  value={editForm.initial_state || ''}
                  onChange={(e) => setEditForm({ ...editForm, initial_state: e.target.value })}
                >
                  <option value="">Estado inicial</option>
                  <option value="tranquilo">Tranquilo</option>
                  <option value="apurado">Apurado</option>
                  <option value="indeciso">Indeciso</option>
                  <option value="molesto">Molesto</option>
                  <option value="distante">Distante</option>
                  <option value="entusiasmado">Entusiasmado</option>
                </select>

                <select
                  className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
                  value={editForm.communication_style || ''}
                  onChange={(e) => setEditForm({ ...editForm, communication_style: e.target.value })}
                >
                  <option value="">Estilo de comunicación</option>
                  <option value="cordial">Cordial</option>
                  <option value="directo">Directo</option>
                  <option value="analítico">Analítico</option>
                  <option value="reservado">Reservado</option>
                  <option value="conversador">Conversador</option>
                  <option value="breve">Breve</option>
                </select>

                <select
                  className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
                  value={editForm.reaction_style || ''}
                  onChange={(e) => setEditForm({ ...editForm, reaction_style: e.target.value })}
                >
                  <option value="">Cómo reacciona</option>
                  <option value="valora claridad">Valora claridad</option>
                  <option value="responde a empatía">Responde a empatía</option>
                  <option value="necesita precisión">Necesita precisión</option>
                  <option value="rechaza presión">Rechaza presión</option>
                  <option value="necesita confianza">Necesita confianza</option>
                  <option value="valora rapidez">Valora rapidez</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleUpdate}
                  className="bg-[#6be1e3] text-black px-5 py-2 rounded-xl font-bold text-sm hover:opacity-80"
                >
                  Guardar cambios
                </button>

                <button
                  onClick={() => setEditProto(null)}
                  className="text-slate-400 text-sm px-4 py-2 hover:text-white"
                >
                  Cancelar
                </button>
              </div>
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
            <Search size={20} className="text-slate-400" />
            <input className="bg-transparent outline-none text-white w-full" placeholder="Buscar cápsula..." value={searchCapsule} onChange={e => setSearchCapsule(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setSearchCapsule(''); loadData(); }} className="bg-slate-700 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-600 flex items-center"><RefreshCw size={16} className="mr-2" /> Reiniciar</button>
            <button onClick={() => setModalCapsule(true)} className="bg-[#e17bd7] text-white px-4 py-2 rounded-xl font-bold flex items-center hover:opacity-90 shadow-lg"><Plus size={18} className="mr-2" /> Nueva Cápsula</button>
          </div>
        </div>
        <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left text-slate-300 min-w-[500px]">
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
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-white text-lg">{cap.title}</span>
                        <span className="text-xs text-slate-500 truncate max-w-md">{cap.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex gap-2 justify-center">
                      <button onClick={(e) => { e.stopPropagation(); setEditingCap(cap); setEditCapForm({ title: cap.title, description: cap.description }); }} className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition"><Edit2 size={16} /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteCap(cap.id); }} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition"><Trash2 size={18} /></button>
                    </div>
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
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      {/* Botón hamburguesa */}
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-[#e17bd7] text-white p-2 rounded-xl shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="text-xl">☰</span>
      </button>
      <aside className={`w-72 md:w-80 p-8 md:p-10 border-r border-slate-800 bg-[#1a181d] flex flex-col fixed h-full z-20 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="mb-12"><LogoOneWhite /></div>
        <div className="mb-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Rol</p>
          <h1 className="text-2xl font-bold text-white">Super Admin</h1>
        </div>
        <nav className="space-y-3 flex-1">
          <button onClick={() => { setActiveTab('empresas'); setSidebarOpen(false); }} className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center ${activeTab === 'empresas' ? 'bg-[#e17bd7] text-white font-bold shadow-lg translate-x-2' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Building className="mr-3 w-5 h-5" /> Clientes</button>
          <button onClick={() => { setActiveTab('capsulas'); setSidebarOpen(false); }} className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center ${activeTab === 'capsulas' ? 'bg-[#e4c76a] text-[#1a181d] font-bold shadow-lg translate-x-2' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Folder className="mr-3 w-5 h-5" /> Contenidos</button>
          <button onClick={() => { setActiveTab('prototipos'); setSidebarOpen(false); }} className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center ${activeTab === 'prototipos' ? 'bg-[#6be1e3] text-[#1a181d] font-bold shadow-lg translate-x-2' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Users className="mr-3 w-5 h-5" /> Prototipos</button>
        </nav>
        <button onClick={() => navigate('/login')} className="mt-12 text-red-400 text-sm flex items-center font-bold px-4 py-3 rounded-xl hover:bg-white/5 transition"><LogOut className="w-4 h-4 mr-3" /> Cerrar Sesión</button>
      </aside>
      <main className="flex-1 ml-0 md:ml-80 p-4 md:p-12 pt-16 md:pt-12">
        <h2 className="text-4xl font-bold mb-10 tracking-tight">
          {activeTab === 'empresas' ? 'Gestión de Clientes' : activeTab === 'capsulas' ? 'Biblioteca Global' : 'Prototipos Globales'}
        </h2>
        {activeTab === 'empresas' ? <CompaniesView /> : activeTab === 'capsulas' ? <CapsulesAdminView /> : <GlobalPrototypesView />}
      </main>

      {/* MODAL CREAR EMPRESA */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[99999] backdrop-blur-md overflow-y-auto">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-6"><h3 className="font-bold text-xl text-[#1a181d]">Alta Cliente</h3><button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-black"><X size={20} /></button></div>
            <div className="space-y-4">
              <input className="w-full p-3 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="Nombre Empresa *" onChange={e => setNewCompany({ ...newCompany, company_name: e.target.value })} />
              <input className="w-full p-3 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="Email Admin *" onChange={e => setNewCompany({ ...newCompany, email: e.target.value })} />
              <input className="w-full p-3 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="Teléfono" autoComplete="off" onChange={e => setNewCompany({ ...newCompany, phone: e.target.value })} />
            <RichTextEditor
              value={newCompany.mission_values}
              onChange={val => setNewCompany({ ...newCompany, mission_values: val })}
              placeholder="Misión y valores de la empresa (opcional)"
              minHeight="80px"
            />
              <input className="w-full p-3 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-cyan-500 outline-none" type="password" placeholder="Contraseña *" autoComplete="new-password" onChange={e => setNewCompany({ ...newCompany, password: e.target.value })} />
              <button onClick={handleCreateCompany} className="w-full bg-[#1a181d] text-white p-3 rounded-lg font-bold hover:opacity-90 mt-2">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VER EMPRESA */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[99999] backdrop-blur-md">
          <div className="bg-[#1a181d] rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 p-6 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-[#e17bd7]/20 flex items-center justify-center flex-shrink-0">
                <Building size={22} className="text-[#e17bd7]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-0.5">Empresa</p>
                <p className="text-white font-bold text-lg leading-tight">{editingCompany.company_name}</p>
                <p className="text-slate-400 text-sm">{editingCompany.email}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"><X size={20} /></button>
            </div>
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button onClick={() => setActiveCompanyTab('info')} className={`flex-1 py-3 text-sm font-bold transition ${activeCompanyTab === 'info' ? 'text-[#e17bd7] border-b-2 border-[#e17bd7]' : 'text-slate-400 hover:text-white'}`}>Información</button>
              <button onClick={() => setActiveCompanyTab('capsulas')} className={`flex-1 py-3 text-sm font-bold transition ${activeCompanyTab === 'capsulas' ? 'text-[#e17bd7] border-b-2 border-[#e17bd7]' : 'text-slate-400 hover:text-white'}`}>Cápsulas</button>
            </div>
            {/* Content */}
            <div className="overflow-y-auto flex-1 p-6">
              {activeCompanyTab === 'info' && (
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Nombre</label><input className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white mt-1 outline-none focus:ring-2 focus:ring-[#e17bd7]" value={editingCompany.company_name} onChange={e => setEditingCompany({ ...editingCompany, company_name: e.target.value })} /></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Email</label><input className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white mt-1 outline-none focus:ring-2 focus:ring-[#e17bd7]" value={editingCompany.email} onChange={e => setEditingCompany({ ...editingCompany, email: e.target.value })} /></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Teléfono</label><input className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white mt-1 outline-none focus:ring-2 focus:ring-[#e17bd7]" value={editingCompany.phone || ''} onChange={e => setEditingCompany({ ...editingCompany, phone: e.target.value })} /></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Misión y Valores</label><RichTextEditor value={editingCompany.mission_values || ''} onChange={val => setEditingCompany({ ...editingCompany, mission_values: val })} placeholder="Misión y valores..." minHeight="80px" /></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Nueva Clave (dejar vacío para no cambiar)</label><input className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white mt-1 outline-none focus:ring-2 focus:ring-[#e17bd7]" type="password" placeholder="••••••" autoComplete="new-password" onChange={e => setEditingCompany({ ...editingCompany, password: e.target.value })} /></div>
                  <button onClick={handleUpdateCompany} className="w-full bg-[#e17bd7] text-white p-3 rounded-xl font-bold hover:opacity-90 mt-2">Guardar Cambios</button>
                </div>
              )}
              {activeCompanyTab === 'capsulas' && (
                <div>
                  <p className="text-slate-400 text-sm mb-4">Habilitá o deshabilitá el acceso de esta empresa a cada cápsula.</p>
                  <div className="space-y-3">
                    {capsules.map(cap => {
                      const habilitada = companyCapsules.includes(cap.id);
                      return (
                        <div key={cap.id} className={`p-4 rounded-2xl border flex items-center gap-4 transition ${habilitada ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-sm truncate">{cap.title}</p>
                            <p className="text-slate-400 text-xs mt-0.5 truncate">{cap.description}</p>
                          </div>
                          <button onClick={() => toggleCompanyCapsule(cap.id)} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${habilitada ? 'bg-green-500 text-white hover:bg-red-500' : 'bg-white/10 text-slate-300 hover:bg-[#e17bd7] hover:text-white'}`}>
                            {habilitada ? <><CheckCircle size={14} /> Habilitada</> : <><Plus size={14} /> Habilitar</>}
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

      {/* MODAL EDITAR CÁPSULA */}
      {editingCap && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[99999]">
          <div className="bg-white p-6 rounded-2xl w-96">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-black text-xl">Editar Cápsula</h3>
              <button onClick={() => setEditingCap(null)} className="text-slate-400 hover:text-black"><X size={20} /></button>
            </div>
            <input className="w-full border border-slate-300 p-3 mb-3 rounded-lg text-black focus:ring-2 focus:ring-[#e17bd7] outline-none" placeholder="Título" value={editCapForm.title} onChange={e => setEditCapForm({ ...editCapForm, title: e.target.value })} />
            <input className="w-full border border-slate-300 p-3 mb-6 rounded-lg text-black focus:ring-2 focus:ring-[#e17bd7] outline-none" placeholder="Descripción" value={editCapForm.description} onChange={e => setEditCapForm({ ...editCapForm, description: e.target.value })} />
            <div className="flex gap-2">
              <button onClick={handleUpdateCapsule} className="flex-1 bg-[#1a181d] text-white p-3 rounded-lg font-bold hover:opacity-90">Guardar</button>
              <button onClick={() => setEditingCap(null)} className="text-red-500 px-4">Cancelar</button>
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
        <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 text-[#1a181d]">Biblioteca de Entrenamiento</h2>
        {capsules.length === 0 ? (
          <div className="text-center p-12 text-slate-400 bg-white rounded-2xl border-2 border-dashed">
            No hay cápsulas disponibles. El Super Admin debe crearlas.
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="md:hidden space-y-3">
              {capsules.map(c => {
                const videos = c.contents.filter(x => x.type === 'video').length;
                const pdfs = c.contents.filter(x => x.type === 'pdf').length;
                return (
                  <div key={c.id} className="bg-white border rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#e4c76a]/10 flex items-center justify-center flex-shrink-0">
                        <Folder size={18} className="text-[#e4c76a]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{c.title}</p>
                        <div className="flex gap-2 text-xs text-slate-400 mt-0.5">
                          {videos > 0 && <span>{videos} clase{videos !== 1 ? 's' : ''}</span>}
                          {pdfs > 0 && <span>{pdfs} material{pdfs !== 1 ? 'es' : ''}</span>}
                          {c.contents.length === 0 && <span className="italic">Vacío</span>}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setOpenFolder(c)} className="bg-[#1a181d] text-white px-3 py-2 rounded-xl text-xs font-bold hover:opacity-80 flex-shrink-0 ml-2">
                      Ingresar
                    </button>
                  </div>
                );
              })}
            </div>
            {/* Desktop: tabla */}
            <div className="hidden md:block bg-white rounded-2xl border shadow-sm overflow-hidden">
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
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800">{c.title}</p>
                              {c.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-sm">{c.description}</p>}
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
          </>
        )}
      </div>
    );
  }

  // Vista: dentro de una carpeta — tabla de contenidos
  const cap = openFolder;
  const videos = cap.contents.filter(c => c.type === 'video');
  const pdfs   = cap.contents.filter(c => c.type === 'pdf');

  // Mostrar descripción completa si existe
  const descripcionCompleta = cap.description && cap.description.trim();
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

      {descripcionCompleta && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 mb-6 text-sm text-slate-600 leading-relaxed">
          {descripcionCompleta}
        </div>
      )}

      {/* Tabla */}
      {cap.contents.length === 0 ? (
        <div className="text-center p-12 text-slate-400 bg-white rounded-2xl border-2 border-dashed">
          Carpeta vacía. El Super Admin puede agregar contenido.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
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
  const [globalProtos, setGlobalProtos] = useState([]);
  const [showGlobalList, setShowGlobalList] = useState(false);
  const [selectedGlobalProtoKey, setSelectedGlobalProtoKey] = useState('');
  const [editingInfo, setEditingInfo] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoText, setInfoText] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [viewProto, setViewProto] = useState(null);
  const [editProto, setEditProto] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    objection: '',
    initial_state: '',
    communication_style: '',
    reaction_style: ''
  });

  const openViewPrototype = (proto) => {
    setViewProto(proto);
  };

  const openEditPrototype = (proto) => {
    setEditProto(proto);
    setEditForm({
      name: proto.name || '',
      description: proto.description || '',
      objection: proto.objection || '',
      initial_state: proto.initial_state || '',
      communication_style: proto.communication_style || '',
      reaction_style: proto.reaction_style || ''
    });
  };

  const updatePrototype = async () => {
    if (!editForm.name || !editForm.description || !editForm.objection || !editForm.initial_state || !editForm.communication_style || !editForm.reaction_style) {
      return alert("Todos los campos son obligatorios, incluyendo estado inicial, estilo de comunicación y cómo reacciona");
    }

    try {
      await axios.put(`${API_URL}/prototypes/${editProto.id}`, {
        ...editForm,
        product_id: openProduct.id
      });
      setEditProto(null);
      await onUpdateProduct(openProduct.id, { info: openProduct.info || '' });
    } catch (e) {
      console.error(e);
      alert("Error al actualizar el prototipo");
    }
  };
  
  useEffect(() => {
    axios.get(`${API_URL}/global-prototypes`).then(res => {
      setGlobalProtos(Array.isArray(res.data) ? res.data : []);
    }).catch(e => console.error(e));
  }, []);

  // Cuando se abre un producto, sincronizar la info local
  const enterProduct = (p) => {
    setOpenProduct(p);
    setInfoText(p.info || '');
    setEditingInfo(false);
    setShowProtoForm(false);
    setShowGlobalList(false);
    setSelectedGlobalProtoKey('');
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
  
  const availableGlobalProtos = openProduct
    ? globalProtos.filter(gp => {
        const alreadyExists = openProduct.prototypes?.some(pr =>
          (pr.name || '').trim().toLowerCase() === (gp.name || '').trim().toLowerCase() &&
          (pr.description || '').trim().toLowerCase() === (gp.description || '').trim().toLowerCase() &&
          (pr.objection || '').trim().toLowerCase() === (gp.objection || '').trim().toLowerCase()
        );
        return !alreadyExists;
      })
    : [];
  // ── VISTA: lista de productos ──
  if (!openProduct) {
    return (
      <div>
        <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 text-[#1a181d]">Configuración de Productos</h2>

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
          <>
            {/* Mobile: cards */}
            <div className="md:hidden space-y-3">
              {products.map(p => (
                <div key={p.id} className="bg-white border rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#6be1e3]/10 flex items-center justify-center flex-shrink-0">
                      <Package size={16} className="text-[#6be1e3]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate">{p.name}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.prototypes.length > 0 ? 'bg-[#6be1e3]/10 text-[#3abfc1]' : 'bg-slate-100 text-slate-400'}`}>
                        {p.prototypes.length} prototipo{p.prototypes.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <button onClick={() => enterProduct(p)} className="bg-[#1a181d] text-white px-3 py-2 rounded-xl text-xs font-bold hover:opacity-80">
                      Ingresar
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop: tabla */}
            <div className="hidden md:block bg-white rounded-2xl border shadow-sm overflow-hidden">
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
                              ? <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[260px]">{p.info.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()}</p>
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
                        <button onClick={() => enterProduct(p)} className="inline-flex items-center gap-2 bg-[#1a181d] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#6be1e3] hover:text-black transition">
                          Ingresar <ChevronRight size={14} />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
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
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => { setShowGlobalList(!showGlobalList); setShowProtoForm(false); setEditingInfo(false); }}
            className="flex items-center gap-2 bg-slate-100 border border-slate-300 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-slate-200 transition"
          >
            <Users size={15} /> Usar Prototipo Global
          </button>
          <button
            onClick={() => { setShowProtoForm(!showProtoForm); setShowGlobalList(false); setEditingInfo(false); }}
            className="flex items-center gap-2 bg-[#6be1e3] text-black text-sm font-bold px-4 py-2.5 rounded-xl hover:opacity-80 transition"
          >
            <Plus size={15} /> Prototipo Cliente
          </button>
        </div>
      </div>

      {/* Sección: Información del producto */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FileText size={16} className="text-[#e17bd7]" /> Información del Producto
          </h3>
          {!editingInfo && (
            <div className="flex items-center gap-2">
              {p.info && (
                <button
                  onClick={() => setShowInfoModal(true)}
                  className="flex items-center gap-1.5 bg-[#6be1e3]/10 text-[#3abfc1] hover:bg-[#6be1e3] hover:text-black px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  <Eye size={13} /> Ver
                </button>
              )}
              <button
                onClick={() => { setEditingInfo(true); setInfoText(p.info || ''); }}
                className="flex items-center gap-1.5 bg-[#e17bd7]/10 text-[#e17bd7] hover:bg-[#e17bd7] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
              >
                <Edit2 size={13} /> Editar
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Esta información será usada por el agente de IA para conocer el producto y simular preguntas reales que haría un cliente durante el entrenamiento.
        </p>
        {editingInfo ? (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition ${loadingPdf ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#6be1e3]/15 text-[#3abfc1] hover:bg-[#6be1e3] hover:text-black'}`}>
                <Upload size={14} />
                {loadingPdf ? 'Procesando PDF...' : 'Importar desde PDF'}
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  disabled={loadingPdf}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setLoadingPdf(true);
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      const res = await axios.post(`${API_URL}/chat/pdf`, formData);
                      setInfoText(prev => prev ? prev + '\n\n' + res.data.text : res.data.text);
                    } catch {
                      alert('Error procesando el PDF. Intentá de nuevo.');
                    } finally {
                      setLoadingPdf(false);
                      e.target.value = '';
                    }
                  }}
                />
              </label>
              <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition ${loadingPdf ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#e17bd7]/15 text-[#e17bd7] hover:bg-[#e17bd7] hover:text-white'}`}>
                <ImageIcon size={14} />
                {loadingPdf ? 'Procesando...' : 'Importar desde imagen'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={loadingPdf}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setLoadingPdf(true);
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      const res = await axios.post(`${API_URL}/product/extract-from-image`, formData);
                      setInfoText(prev => prev ? prev + '\n\n' + res.data.text : res.data.text);
                    } catch {
                      alert('Error procesando la imagen. Intentá de nuevo.');
                    } finally {
                      setLoadingPdf(false);
                      e.target.value = '';
                    }
                  }}
                />
              </label>
              <span className="text-xs text-slate-400">El texto se agregará al editor para que puedas revisarlo antes de guardar.</span>
            </div>
            <RichTextEditor
              value={infoText}
              onChange={setInfoText}
              placeholder="Ej: 1️⃣ Precio: $1200  2️⃣ Características: X, Y, Z  3️⃣ Garantía: 12 meses..."
              minHeight="150px"
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
          <div>
            {p.info ? (
              <div className="relative">
                <div
                  className="text-sm bg-slate-50 rounded-xl px-3 py-2 text-slate-700 overflow-hidden"
                  style={{ maxHeight: '1.8em', WebkitLineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  dangerouslySetInnerHTML={{ __html: p.info }}
                />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent rounded-r-xl pointer-events-none" />
              </div>
            ) : (
              <p className="text-sm text-slate-300 italic px-1">Sin información cargada.</p>
            )}
          </div>
        )}
      </div>

      {showGlobalList && (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Prototipos Globales Disponibles
          </p>

          {availableGlobalProtos.length === 0 ? (
            <p className="text-sm text-slate-400 italic">
              No hay prototipos globales disponibles para este producto.
            </p>
          ) : (
            <div className="space-y-4">
              <select
                className="w-full border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6be1e3] bg-white"
                value={selectedGlobalProtoKey}
                onChange={(e) => setSelectedGlobalProtoKey(e.target.value)}
              >
                <option value="">Seleccioná un prototipo global</option>
                {availableGlobalProtos.map((gp, index) => {
                  const optionKey = `${gp.id ?? 'gp'}-${index}`;
                  return (
                    <option key={optionKey} value={optionKey}>
                      {gp.name}
                    </option>
                  );
                })}
              </select>

              {selectedGlobalProtoKey && (() => {
                const selectedGp = availableGlobalProtos.find((gp, index) => {
                  const optionKey = `${gp.id ?? 'gp'}-${index}`;
                  return optionKey === selectedGlobalProtoKey;
                });

                if (!selectedGp) return null;

                return (
                  <div className="p-4 bg-slate-50 rounded-xl border">
                    <p className="font-bold text-slate-800 text-sm">{selectedGp.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{selectedGp.description}</p>
                    <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded mt-2 inline-block">
                      {selectedGp.objection}
                    </span>

                    <div className="mt-4">
                      <button
                        onClick={async () => {
                          await addPrototype(p.id, {
                            name: selectedGp.name,
                            description: selectedGp.description,
                            objection: selectedGp.objection,
                            initial_state: selectedGp.initial_state || '',
                            communication_style: selectedGp.communication_style || '',
                            reaction_style: selectedGp.reaction_style || ''
                          });
                          setSelectedGlobalProtoKey('');
                        }}
                        className="flex items-center gap-2 bg-[#6be1e3] text-black text-xs font-bold px-4 py-2 rounded-xl hover:opacity-80 transition"
                      >
                        <Plus size={13} /> Agregar al producto
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

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

          <div className="grid md:grid-cols-3 gap-3 mb-3">
            <select
              className="border p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
              value={newProto.initial_state}
              onChange={e => setNewProto({ ...newProto, initial_state: e.target.value })}
            >
              <option value="">Estado inicial</option>
              <option value="tranquilo">Tranquilo</option>
              <option value="apurado">Apurado</option>
              <option value="indeciso">Indeciso</option>
              <option value="molesto">Molesto</option>
              <option value="distante">Distante</option>
              <option value="entusiasmado">Entusiasmado</option>
            </select>

            <select
              className="border p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
              value={newProto.communication_style}
              onChange={e => setNewProto({ ...newProto, communication_style: e.target.value })}
            >
              <option value="">Estilo de comunicación</option>
              <option value="cordial">Cordial</option>
              <option value="directo">Directo</option>
              <option value="analítico">Analítico</option>
              <option value="reservado">Reservado</option>
              <option value="conversador">Conversador</option>
              <option value="breve">Breve</option>
            </select>

            <select
              className="border p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
              value={newProto.reaction_style}
              onChange={e => setNewProto({ ...newProto, reaction_style: e.target.value })}
            >
              <option value="">Cómo reacciona</option>
              <option value="valora claridad">Valora claridad</option>
              <option value="responde a empatía">Responde a empatía</option>
              <option value="necesita precisión">Necesita precisión</option>
              <option value="rechaza presión">Rechaza presión</option>
              <option value="necesita confianza">Necesita confianza</option>
              <option value="valora rapidez">Valora rapidez</option>
            </select>
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
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden overflow-x-auto">
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
          <table className="w-full text-left table-fixed">
            <thead className="text-xs uppercase font-bold text-slate-400 tracking-wider border-b">
              <tr>
                <th className="px-6 py-3 w-[18%]">Perfil del cliente</th>
                <th className="px-6 py-3 w-[37%]">Descripción</th>
                <th className="px-6 py-3 w-[30%]">Objeción principal</th>
                <th className="px-6 py-3 text-center w-[15%]">Acc.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {p.prototypes.map(pr => (
                <tr key={pr.id} className="h-24 hover:bg-slate-50 transition align-middle">
                  <td className="px-6 py-4 align-middle">
                    <p className="font-bold text-slate-800 text-sm line-clamp-2 overflow-hidden">
                      {pr.name}
                    </p>
                  </td>

                  <td className="px-6 py-4 align-middle">
                    <p className="text-sm text-slate-500 line-clamp-2 overflow-hidden">
                      {pr.description}
                    </p>
                  </td>

                  <td className="px-6 py-4 align-middle">
                    <div className="line-clamp-2 overflow-hidden">
                      <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-lg inline-block">
                        {pr.objection}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openViewPrototype(pr)}
                        className="p-1.5 text-cyan-500 bg-cyan-50 hover:bg-cyan-500 hover:text-white rounded-lg transition"
                        title="Ver"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        onClick={() => openEditPrototype(pr)}
                        className="p-1.5 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-lg transition"
                        title="Editar"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => deletePrototype(pr.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* MODAL EDITAR PROTOTIPO */}
      {viewProto && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[99999] backdrop-blur-sm"
          onClick={() => setViewProto(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1a181d] px-6 py-4 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Prototipo de Cliente</p>
                <h3 className="text-xl font-bold text-white mt-1">{viewProto.name}</h3>
              </div>
              <button
                onClick={() => setViewProto(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-sm">
              <div>
                <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">Descripción</p>
                <div className="bg-slate-50 border rounded-2xl p-4 text-slate-700">
                  {viewProto.description || '—'}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">Objeción principal</p>
                <div className="bg-slate-50 border rounded-2xl p-4 text-red-500">
                  {viewProto.objection || '—'}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">Estado inicial</p>
                  <div className="bg-slate-50 border rounded-2xl p-4 text-slate-700 min-h-[72px]">
                    {viewProto.initial_state || '—'}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">Estilo de comunicación</p>
                  <div className="bg-slate-50 border rounded-2xl p-4 text-slate-700 min-h-[72px]">
                    {viewProto.communication_style || '—'}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">Cómo reacciona</p>
                  <div className="bg-slate-50 border rounded-2xl p-4 text-slate-700 min-h-[72px]">
                    {viewProto.reaction_style || '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editProto && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[99999] backdrop-blur-sm"
          onClick={() => setEditProto(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1a181d] px-6 py-4 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Editar Prototipo de Cliente</p>
                <h3 className="text-xl font-bold text-white mt-1">{editProto.name}</h3>
              </div>
              <button
                onClick={() => setEditProto(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                className="w-full bg-slate-50 border p-3 rounded-xl text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
                placeholder="Nombre del perfil"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />

              <textarea
                className="w-full bg-slate-50 border p-3 rounded-xl text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#6be1e3] min-h-[110px]"
                placeholder="Descripción"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />

              <textarea
                className="w-full bg-slate-50 border p-3 rounded-xl text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#6be1e3] min-h-[90px]"
                placeholder="Objeción principal"
                value={editForm.objection}
                onChange={(e) => setEditForm({ ...editForm, objection: e.target.value })}
              />

              <div className="grid md:grid-cols-3 gap-3">
                <select
                  className="bg-slate-50 border p-3 rounded-xl text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
                  value={editForm.initial_state || ''}
                  onChange={(e) => setEditForm({ ...editForm, initial_state: e.target.value })}
                >
                  <option value="">Estado inicial</option>
                  <option value="tranquilo">Tranquilo</option>
                  <option value="apurado">Apurado</option>
                  <option value="indeciso">Indeciso</option>
                  <option value="molesto">Molesto</option>
                  <option value="distante">Distante</option>
                  <option value="entusiasmado">Entusiasmado</option>
                </select>

                <select
                  className="bg-slate-50 border p-3 rounded-xl text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
                  value={editForm.communication_style || ''}
                  onChange={(e) => setEditForm({ ...editForm, communication_style: e.target.value })}
                >
                  <option value="">Estilo de comunicación</option>
                  <option value="cordial">Cordial</option>
                  <option value="directo">Directo</option>
                  <option value="analítico">Analítico</option>
                  <option value="reservado">Reservado</option>
                  <option value="conversador">Conversador</option>
                  <option value="breve">Breve</option>
                </select>

                <select
                  className="bg-slate-50 border p-3 rounded-xl text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#6be1e3]"
                  value={editForm.reaction_style || ''}
                  onChange={(e) => setEditForm({ ...editForm, reaction_style: e.target.value })}
                >
                  <option value="">Cómo reacciona</option>
                  <option value="valora claridad">Valora claridad</option>
                  <option value="responde a empatía">Responde a empatía</option>
                  <option value="necesita precisión">Necesita precisión</option>
                  <option value="rechaza presión">Rechaza presión</option>
                  <option value="necesita confianza">Necesita confianza</option>
                  <option value="valora rapidez">Valora rapidez</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={updatePrototype}
                  className="bg-[#6be1e3] text-black px-5 py-2 rounded-xl font-bold text-sm hover:opacity-80"
                >
                  Guardar cambios
                </button>

                <button
                  onClick={() => setEditProto(null)}
                  className="text-slate-400 text-sm px-4 py-2 hover:text-slate-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Ver Información del Producto */}
      {showInfoModal && openProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[99999] backdrop-blur-sm" onClick={() => setShowInfoModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a181d] px-6 py-4 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-[#e17bd7]" />
                <h3 className="font-bold text-white">Información del Producto</h3>
              </div>
              <button onClick={() => setShowInfoModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div
                className="text-sm text-slate-700 leading-relaxed rich-content"
                dangerouslySetInnerHTML={{ __html: openProduct.info }}
                style={{ lineHeight: '1.8' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ============================================================
// COMPANY DASHBOARD (Admin Empresa) — COMPLETAMENTE FUNCIONAL
// ============================================================
function CompanyDashboard() {
  const navigate = useNavigate();
  useEffect(() => { document.title = 'Dashboard | ONE Commercial IA'; }, []);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [tab, setTab] = useState('employees');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [capsules, setCapsules] = useState([]);
  const [newEmp, setNewEmp] = useState({ name: '', email: '', password: '' });
  const [newProd, setNewProd] = useState({ name: '' });
  const [newProto, setNewProto] = useState({ name: '', description: '', objection: '', initial_state: '', communication_style: '', reaction_style: '' });
  const [selProductId, setSelProductId] = useState(null);
  const [viewProto, setViewProto] = useState(null);
  const [editProto, setEditProto] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    objection: '',
    initial_state: '',
    communication_style: '',
    reaction_style: ''
  });

  const openViewPrototype = (proto) => {
    setViewProto(proto);
  };

  const openEditPrototype = (proto) => {
    setEditProto(proto);
    setEditForm({
      name: proto.name || '',
      description: proto.description || '',
      objection: proto.objection || '',
      initial_state: proto.initial_state || '',
      communication_style: proto.communication_style || '',
      reaction_style: proto.reaction_style || ''
    });
  };

  const updatePrototype = async () => {
    if (!editForm.name || !editForm.description || !editForm.objection) {
      return alert("Completá nombre, descripción y objeción");
    }

    try {
      await axios.put(`${API_URL}/prototypes/${editProto.id}`, editForm);
      setEditProto(null);
      loadAll();
    } catch (e) {
      console.error(e);
      alert("Error al actualizar el prototipo");
    }
  };

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

  const addPrototype = async (productId, dataOverride = null) => {
    const data = dataOverride || newProto;
    if (!data.name || !data.description || !data.objection || !data.initial_state || !data.communication_style || !data.reaction_style) return alert("Todos los campos son obligatorios, incluyendo estado inicial, estilo de comunicación y cómo reacciona");
    await axios.post(`${API_URL}/prototypes`, { ...data, product_id: productId });
    if (!dataOverride) {
      setNewProto({ name: '', description: '', objection: '', initial_state: '', communication_style: '', reaction_style: '' });
      setSelProductId(null);
    }
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
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-[#e17bd7] text-white p-2 rounded-xl shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="text-xl">☰</span>
      </button>
      <aside className={`w-72 bg-[#1a181d] text-white p-6 flex flex-col fixed h-full z-20 shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="mb-6"><LogoOneWhite small /></div>
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

      <main className="ml-0 md:ml-72 flex-1 p-4 md:p-10 pt-16 md:pt-10">
        {/* EQUIPO */}
        {tab === 'employees' && (
          <div>
            <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 text-[#1a181d]">Gestión de Equipo</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Formulario nuevo vendedor */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold mb-4 text-lg">Nuevo Vendedor</h3>
                <input className="w-full bg-slate-50 border p-3 rounded-xl mb-2 text-sm outline-none focus:ring-2 focus:ring-[#e17bd7]" placeholder="Nombre completo" value={newEmp.name} onChange={e => setNewEmp({ ...newEmp, name: e.target.value })} />
                <input className="w-full bg-slate-50 border p-3 rounded-xl mb-2 text-sm outline-none focus:ring-2 focus:ring-[#e17bd7]" placeholder="Email" value={newEmp.email} onChange={e => setNewEmp({ ...newEmp, email: e.target.value })} />
                <input className="w-full bg-slate-50 border p-3 rounded-xl mb-4 text-sm outline-none focus:ring-2 focus:ring-[#e17bd7]" type="password" placeholder="Contraseña" autoComplete="new-password" value={newEmp.password} onChange={e => setNewEmp({ ...newEmp, password: e.target.value })} />
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
                        {e.avg_score && <span className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full inline-block ${e.avg_score >= 7 ? 'bg-green-500' : e.avg_score >= 5 ? 'bg-orange-500' : 'bg-red-500'}`}></span><span className="text-xs text-slate-400">promedio</span></span>}
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
                    <input className="w-full mt-1 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#e17bd7] text-sm" type="password" placeholder="••••••••" autoComplete="new-password" value={profileEdit.password || ''} onChange={e => setProfileEdit({ ...profileEdit, password: e.target.value })} />
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
                        {profileEmp.sessions.filter(s => s.messages.filter(m => m.role === 'user').length >= 3).map((s, i) => {
                          const scoreBgColor = !s.score ? '' : s.score >= 7 ? 'bg-green-500' : s.score >= 5 ? 'bg-orange-500' : 'bg-red-500';
                          return (
                            <div key={s.id} className="w-full bg-slate-50 border p-4 rounded-xl flex justify-between items-center">
                              <div>
                                <p className="font-bold text-slate-800">Sesión #{profileEmp.sessions.length - i}</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {s.date ? new Date(s.date + 'Z').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">{s.messages.filter(m => m.role === 'user').length} intercambios</p>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                {s.score ? <span className={`w-5 h-5 rounded-full inline-block ${scoreBgColor}`}></span> : <span className="text-xs text-slate-400 bg-slate-200 px-2 py-1 rounded">Sin evaluar</span>}
                                <button
                                  onClick={() => setSelSession({ ...s, vistaInicial: 'chat' })}
                                  className="bg-slate-200 text-slate-700 hover:bg-[#1a181d] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                  Ver Chat
                                </button>
                                <button
                                  onClick={() => setSelSession({ ...s, vistaInicial: 'informe' })}
                                  className="bg-[#e17bd7]/20 text-[#e17bd7] hover:bg-[#e17bd7] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                  Ver Informe
                                </button>
                              </div>
                            </div>
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
                          <span className={`ml-auto w-5 h-5 rounded-full inline-block ${selSession.score >= 7 ? 'bg-green-500' : selSession.score >= 5 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                        )}
                      </div>
                      {selSession.vistaInicial !== 'informe' && (
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
                      )}
                      {selSession.vistaInicial !== 'chat' && (selSession.feedback_admin || selSession.feedback) && (
                        <div className="space-y-3">
                          {selSession.feedback_admin ? (
                            <div>
                              <div className="flex justify-end mb-3">
                                <button
                                  onClick={() => {
                                    const el = document.getElementById('informe-pdf');
                                    window.html2pdf().set({
                                      margin: [0, 0, 0, 0],
                                      filename: `Informe_Sesion_${profileEmp.name.replace(/ /g,'_')}.pdf`,
                                      image: { type: 'jpeg', quality: 0.98 },
                                      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
                                      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                                      pagebreak: { mode: ['css', 'legacy'] }
                                    }).from(el).save();
                                  }}
                                  className="flex items-center gap-2 bg-[#1a181d] text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition"
                                >
                                  ⬇ Descargar PDF
                                </button>
                              </div>
                              <div id="informe-pdf" style={{ fontFamily: 'sans-serif', maxWidth: '720px', margin: '0 auto', background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                <div style={{ padding: '2rem 2.5rem', background: '#fff' }}>
                                  {(() => {
                                    const text = selSession.feedback_admin;
                                    console.log("RAW_ADMIN:", JSON.stringify(text));

                                    // Captura valor en la misma línea O en la línea siguiente
                                    const getIndicador = (text, label) => {
                                      const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                      const regex = new RegExp(`${escaped}:\\s*([^\\n]+)`, 'i');
                                      const m = text.match(regex);
                                      if (m && m[1].trim() && m[1].trim() !== '—') return m[1].trim();
                                      // Si no encontró en la misma línea, busca en la línea siguiente
                                      const regexNext = new RegExp(`${escaped}:\\s*\\n([^\\n━]+)`, 'i');
                                      const m2 = text.match(regexNext);
                                      return m2 ? m2[1].trim() : '—';
                                    };

                                    // Captura bloques multilínea hasta el siguiente separador
                                    const getBloque = (text, label) => {
                                      const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                      const regex = new RegExp(`${escaped}:\\s*\\n?([\\s\\S]*?)(?=\\n━|\\n[A-ZÁÉÍÓÚÑ]{3,}:|$)`, 'i');
                                      const m = text.match(regex);
                                      if (!m) return '—';
                                      const val = m[1].trim();
                                      return val || '—';
                                    };

                                    const encabezado_vendedor = getIndicador(text, 'VENDEDOR');
                                    const encabezado_producto = getIndicador(text, 'PRODUCTO EVALUADO');
                                    const encabezado_prototipo = getIndicador(text, 'CLIENTE SIMULADO');

                                    const resultado = getIndicador(text, 'RESULTADO DE LA CONVERSACIÓN');
                                    const duracion = getIndicador(text, 'DURACIÓN');
                                    const alineacion = getIndicador(text, 'ALINEACIÓN CULTURAL');
                                    const prob_cierre = getIndicador(text, 'PROBABILIDAD DE CIERRE DETECTADA');

                                    const analisis_interaccion = getBloque(text, 'ANÁLISIS DE LA INTERACCIÓN');
                                    const motivo_resultado = getBloque(text, 'MOTIVO PRINCIPAL DEL RESULTADO');

                                    const momento_clave = getBloque(text, 'MOMENTO CLAVE');
                                    const impacto_quiebre = getBloque(text, 'IMPACTO EN EL RESULTADO');

                                    const nivel_objeciones = getIndicador(text, 'NIVEL DE MANEJO DE OBJECIONES');
                                    const objeciones = (() => {
                                      const m = text.match(/OBJECIONES DETECTADAS:\s*\n([\s\S]*?)(?=\nNIVEL DE MANEJO)/i);
                                      if (!m) return [];
                                      return m[1].split('\n').map(l => l.replace(/^[-•▸]\s*/, '').trim()).filter(l => l && l !== '—');
                                    })();

                                    const fortalezas = (() => {
                                      const m = text.match(/FORTALEZAS OBSERVADAS\s*\n━*\s*\n?([\s\S]*?)(?=\n━{5,}|\nOPORTUNIDADES)/i);
                                      if (!m) return [];
                                      return m[1].split('\n').map(l => l.replace(/^[-•▸]\s*/, '').trim()).filter(l => l && l !== '—' && !l.startsWith('━'));
                                    })();

                                    const mejoras = (() => {
                                      const m = text.match(/OPORTUNIDADES DE MEJORA\s*\n━*\s*\n?([\s\S]*?)(?=\n━{5,}|\nANÁLISIS DE TIEMPO)/i);
                                      if (!m) return [];
                                      return m[1].split('\n').map(l => l.replace(/^[-•▸]\s*/, '').trim()).filter(l => l && l !== '—' && !l.startsWith('━'));
                                    })();

                                    const tiempo_evaluacion = getIndicador(text, 'EVALUACIÓN DEL MANEJO DEL TIEMPO');
                                    const tiempo_impacto = getBloque(text, 'IMPACTO EN LA INTERACCIÓN');

                                    const proc_necesidades = getIndicador(text, 'DETECCIÓN DE NECESIDADES');
                                    const proc_presentacion = getIndicador(text, 'PRESENTACIÓN DEL PRODUCTO');
                                    const proc_objeciones = getIndicador(text, 'MANEJO DE OBJECIONES');
                                    const proc_confianza = getIndicador(text, 'GENERACIÓN DE CONFIANZA');
                                    const proc_cierre = getIndicador(text, 'INTENTO DE CIERRE');

                                    const cult_nivel = getIndicador(text, 'NIVEL DE ALINEACIÓN');
                                    const cult_analisis = getBloque(text, 'ANÁLISIS');
                                    const cult_recomendacion = getBloque(text, 'RECOMENDACIÓN');

                                    const emocional_perfil = getIndicador(text, 'PERFIL EMOCIONAL DETECTADO');
                                    const emocional_senales = getBloque(text, 'SEÑALES OBSERVADAS');
                                    const emocional_impacto = getBloque(text, 'IMPACTO EN LA INTERACCIÓN');

                                    const habilidades = (() => {
                                      const m = text.match(/HABILIDADES A DESARROLLAR[\s\S]*?\n([\s\S]*?)(?=━)/i);
                                      if (!m) return [];
                                      return m[1].split('\n').map(l => l.replace(/^\d+\.\s*/, '').trim()).filter(l => l && l !== '—');
                                    })();

                                    const resumen_sintesis = getBloque(text, 'SÍNTESIS DEL DESEMPEÑO');
                                    const resumen_aprendizaje = getBloque(text, 'PRINCIPAL APRENDIZAJE');
                                    const resumen_recomendacion = getBloque(text, 'RECOMENDACIÓN PRINCIPAL');

                                    const indicadores = (() => {
                                      const bloqueIndicadores = text.match(/INDICADORES DE DESEMPEÑO COMERCIAL[\s\S]*?\n━*\s*\n([\s\S]*?)(?=\n━{5,}|$)/i);
                                      const src = bloqueIndicadores ? bloqueIndicadores[1] : '';
                                      const getVal = (label) => {
                                        const esc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                        const r = new RegExp(`${esc}:\\s*([^\\n]+)`, 'i');
                                        const match = src.match(r);
                                        return match ? match[1].trim() : '—';
                                      };
                                      return [
                                        { label: 'Probabilidad de cierre',      value: getVal('PROBABILIDAD DE CIERRE') },
                                        { label: 'Claridad del asesoramiento',  value: getVal('CLARIDAD DEL ASESORAMIENTO') },
                                        { label: 'Detección de necesidades',    value: getVal('DETECCIÓN DE NECESIDADES') },
                                        { label: 'Manejo de objeciones',        value: getVal('MANEJO DE OBJECIONES') },
                                        { label: 'Confianza transmitida',       value: getVal('CONFIANZA TRANSMITIDA') },
                                        { label: 'Intento de cierre',           value: getVal('INTENTO DE CIERRE') },
                                        { label: 'Conocimiento del producto',   value: getVal('CONOCIMIENTO DEL PRODUCTO') },
                                        { label: 'Alineación cultural',         value: getVal('ALINEACIÓN CULTURAL') },
                                      ];
                                    })();

                                    const nivelColor = (val) => {
                                      const v = (val || '').toLowerCase();
                                      if (v.includes('alt') || v.includes('concret')) return '#16a34a';
                                      if (v.includes('med')) return '#d97706';
                                      return '#dc2626';
                                    };

                                    return (
                                      <>
                                        {/* HEADER */}
                                        <div style={{ background: '#0f1923', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                          <div>
                                            <div style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#6be1e3', fontWeight: 500, textTransform: 'uppercase', marginBottom: '8px' }}>Informe de Entrenamiento Comercial</div>
                                            <div style={{ fontSize: '22px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>{profileEmp.name}</div>
                                            <div style={{ fontSize: '13px', color: '#8892a0' }}>{profileEmp.email}</div>
                                            <div style={{ marginTop: '10px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                              {encabezado_producto !== '—' && <span style={{ fontSize: '12px', color: '#6be1e3' }}>📦 {encabezado_producto}</span>}
                                              {encabezado_prototipo !== '—' && <span style={{ fontSize: '12px', color: '#e17bd7' }}>👤 {encabezado_prototipo}</span>}
                                            </div>
                                          </div>
                                          <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '11px', color: '#8892a0', marginBottom: '4px' }}>{selSession.date ? new Date(selSession.date + 'Z').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}</div>
                                            {selSession.score && (
                                              <span style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', background: selSession.score >= 7 ? '#22c55e' : selSession.score >= 5 ? '#f97316' : '#ef4444' }}></span>
                                            )}
                                          </div>
                                        </div>
                                        <div style={{ height: '3px', background: 'linear-gradient(90deg, #6be1e3 0%, #e17bd7 50%, #e4c76a 100%)' }}></div>

                                        {/* BODY */}
                                        <div style={{ padding: '2rem 2.5rem', background: '#fff' }}>

                                          {/* INDICADORES RÁPIDOS */}
                                          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                            {[
                                              { label: 'Resultado', value: resultado, color: '#6be1e3' },
                                              { label: 'Duración', value: duracion, color: '#e4c76a' },
                                              { label: 'Alineación cultural', value: alineacion, color: '#e17bd7' },
                                              { label: 'Prob. de cierre', value: prob_cierre, color: '#6be1e3' },
                                            ].map((card, i) => (
                                              <div key={i} style={{ flex: '1 1 140px', background: '#f8f9fc', borderRadius: '8px', padding: '0.75rem 1rem', borderLeft: `3px solid ${card.color}` }}>
                                                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{card.label}</div>
                                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a181d' }}>{card.value || '—'}</div>
                                              </div>
                                            ))}
                                          </div>

                                          {/* EVALUACIÓN DEL ASESORAMIENTO */}
                                          <div style={{ marginBottom: '1.25rem' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a181d', borderBottom: '2px solid #6be1e3', paddingBottom: '4px', marginBottom: '8px' }}>📊 Evaluación del Asesoramiento</div>
                                            {analisis_interaccion && <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Análisis: </span><span style={{ fontSize: '12px', color: '#334155', lineHeight: '1.7' }}>{analisis_interaccion}</span></div>}
                                            {motivo_resultado && <div><span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Motivo del resultado: </span><span style={{ fontSize: '12px', color: '#334155', lineHeight: '1.7' }}>{motivo_resultado}</span></div>}
                                          </div>

                                          {/* PUNTO DE QUIEBRE */}
                                          <div style={{ marginBottom: '1.25rem', background: '#fff7ed', borderRadius: '8px', padding: '1rem', borderLeft: '3px solid #f97316', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ea580c', marginBottom: '8px' }}>🔴 Punto de Quiebre</div>
                                            {momento_clave && <div style={{ marginBottom: '6px' }}><span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Momento clave: </span><span style={{ fontSize: '12px', color: '#334155' }}>{momento_clave}</span></div>}
                                            {impacto_quiebre && <div><span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Impacto: </span><span style={{ fontSize: '12px', color: '#334155' }}>{impacto_quiebre}</span></div>}
                                          </div>

                                          {/* OBJECIONES */}
                                          <div style={{ marginBottom: '1.25rem' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a181d', borderBottom: '2px solid #e17bd7', paddingBottom: '4px', marginBottom: '8px' }}>💬 Objeciones del Cliente</div>
                                            {objeciones.map((o, i) => <div key={i} style={{ fontSize: '12px', color: '#334155', display: 'flex', gap: '6px', marginBottom: '3px' }}><span style={{ color: '#e17bd7' }}>▸</span>{o}</div>)}
                                            <div style={{ marginTop: '6px' }}><span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Nivel de manejo: </span><span style={{ fontSize: '12px', fontWeight: 700, color: nivelColor(nivel_objeciones) }}>{nivel_objeciones}</span></div>
                                          </div>

                                          {/* FORTALEZAS Y MEJORAS */}
                                          <div style={{ marginBottom: '1.25rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                            <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#16a34a', marginBottom: '8px' }}>✅ Fortalezas</div>
                                              {fortalezas.map((f, i) => <div key={i} style={{ fontSize: '12px', color: '#334155', display: 'flex', gap: '6px', marginBottom: '3px' }}><span style={{ color: '#16a34a' }}>▸</span>{f}</div>)}
                                            </div>
                                            <div style={{ background: '#fff7ed', borderRadius: '8px', padding: '1rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#ea580c', marginBottom: '8px' }}>⚠️ Oportunidades de Mejora</div>
                                              {mejoras.map((m, i) => <div key={i} style={{ fontSize: '12px', color: '#334155', display: 'flex', gap: '6px', marginBottom: '3px' }}><span style={{ color: '#ea580c' }}>▸</span>{m}</div>)}
                                            </div>
                                          </div>

                                          {/* ANÁLISIS DE TIEMPO */}
                                          <div style={{ marginBottom: '1.25rem', background: '#f8f9fc', borderRadius: '8px', padding: '1rem', borderLeft: '3px solid #e4c76a' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#92700a', marginBottom: '8px' }}>⏱️ Análisis de Tiempo</div>
                                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                              <div><span style={{ fontSize: '11px', color: '#64748b' }}>Duración: </span><span style={{ fontSize: '12px', fontWeight: 600 }}>{duracion}</span></div>
                                              <div><span style={{ fontSize: '11px', color: '#64748b' }}>Evaluación: </span><span style={{ fontSize: '12px', fontWeight: 600 }}>{tiempo_evaluacion}</span></div>
                                            </div>
                                            {tiempo_impacto && <div style={{ marginTop: '6px', fontSize: '12px', color: '#334155' }}>{tiempo_impacto}</div>}
                                          </div>

                                          {/* EVALUACIÓN DEL PROCESO */}
                                          <div style={{ marginBottom: '1.25rem' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a181d', borderBottom: '2px solid #6be1e3', paddingBottom: '4px', marginBottom: '8px' }}>🎯 Evaluación del Proceso de Venta</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                              {[
                                                { label: 'Detección de necesidades', value: proc_necesidades },
                                                { label: 'Presentación del producto', value: proc_presentacion },
                                                { label: 'Manejo de objeciones', value: proc_objeciones },
                                                { label: 'Generación de confianza', value: proc_confianza },
                                                { label: 'Intento de cierre', value: proc_cierre },
                                              ].map((item, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fc', padding: '6px 10px', borderRadius: '6px' }}>
                                                  <span style={{ fontSize: '11px', color: '#64748b' }}>{item.label}</span>
                                                  <span style={{ fontSize: '11px', fontWeight: 700, color: nivelColor(item.value) }}>{item.value}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>

                                          {/* ALINEACIÓN CULTURAL */}
                                          <div style={{ marginBottom: '1.25rem', background: '#f8f0ff', borderRadius: '8px', padding: '1rem', borderLeft: '3px solid #e17bd7' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#9333ea', marginBottom: '8px' }}>🏢 Alineación con la Cultura</div>
                                            <div style={{ marginBottom: '4px' }}><span style={{ fontSize: '11px', color: '#64748b' }}>Nivel: </span><span style={{ fontSize: '12px', fontWeight: 700, color: nivelColor(cult_nivel) }}>{cult_nivel}</span></div>
                                            {cult_analisis && <div style={{ marginBottom: '4px' }}><span style={{ fontSize: '11px', color: '#64748b' }}>Análisis: </span><span style={{ fontSize: '12px', color: '#334155' }}>{cult_analisis}</span></div>}
                                            {cult_recomendacion && <div><span style={{ fontSize: '11px', color: '#64748b' }}>Recomendación: </span><span style={{ fontSize: '12px', color: '#334155' }}>{cult_recomendacion}</span></div>}
                                          </div>

                                          {/* ESTADO DEL VENDEDOR */}
                                          <div style={{ marginBottom: '1.25rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a181d', borderBottom: '2px solid #6be1e3', paddingBottom: '4px', marginBottom: '8px' }}>🧠 Estado del Vendedor</div>
                                            {emocional_perfil && <div style={{ marginBottom: '4px' }}><span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Perfil emocional: </span><span style={{ fontSize: '12px', color: '#334155' }}>{emocional_perfil}</span></div>}
                                            {emocional_senales && <div style={{ marginBottom: '4px' }}><span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Señales observadas: </span><span style={{ fontSize: '12px', color: '#334155' }}>{emocional_senales}</span></div>}
                                            {emocional_impacto && <div><span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Impacto: </span><span style={{ fontSize: '12px', color: '#334155' }}>{emocional_impacto}</span></div>}
                                          </div>

                                          {/* HABILIDADES */}
                                          {habilidades.length > 0 && (
                                            <div style={{ marginBottom: '1.25rem' }}>
                                              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a181d', borderBottom: '2px solid #e4c76a', paddingBottom: '4px', marginBottom: '8px' }}>🛠️ Habilidades a Desarrollar</div>
                                              {habilidades.map((s, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12px', color: '#334155', marginBottom: '6px' }}>
                                                  <span style={{ minWidth: '18px', height: '18px', background: '#0f1923', color: '#6be1e3', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600 }}>{i + 1}</span>
                                                  <span>{s}</span>
                                                </div>
                                              ))}
                                            </div>
                                          )}

                                          {/* RESUMEN EJECUTIVO */}
                                          <div style={{ marginBottom: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', borderLeft: '3px solid #e17bd7', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>📋 Resumen Ejecutivo</div>
                                            {resumen_sintesis && <div style={{ marginBottom: '4px' }}><span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Síntesis: </span><span style={{ fontSize: '12px', color: '#334155' }}>{resumen_sintesis}</span></div>}
                                            {resumen_aprendizaje && <div style={{ marginBottom: '4px' }}><span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Aprendizaje: </span><span style={{ fontSize: '12px', color: '#334155' }}>{resumen_aprendizaje}</span></div>}
                                            {resumen_recomendacion && <div><span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Recomendación: </span><span style={{ fontSize: '12px', color: '#334155' }}>{resumen_recomendacion}</span></div>}
                                          </div>

                                          {/* TABLA DE INDICADORES */}
                                          <div style={{ marginBottom: '1rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a181d', borderBottom: '2px solid #6be1e3', paddingBottom: '4px', marginBottom: '8px' }}>📈 Indicadores de Desempeño Comercial</div>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                              <thead>
                                                <tr style={{ background: '#f8f9fc' }}>
                                                  <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '11px', borderBottom: '1px solid #e2e8f0' }}>Indicador</th>
                                                  <th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: '11px', borderBottom: '1px solid #e2e8f0' }}>Nivel</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {indicadores.map((ind, i) => (
                                                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '7px 12px', color: '#334155' }}>{ind.label}</td>
                                                    <td style={{ padding: '7px 12px', textAlign: 'right', fontWeight: 700, color: nivelColor(ind.value) }}>{ind.value}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>

                                        </div>

                                        {/* FOOTER */}
                                        <div style={{ background: '#f8f9fc', borderTop: '1px solid #e2e8f0', padding: '0.75rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>ONE Commercial IA — Sistema de Entrenamiento Comercial</div>
                                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Confidencial</div>
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>
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
function ProductList({ products, onStartChat }) {
  const [openProductId, setOpenProductId] = useState(null);

  // Vista tablero de prototipos
  if (openProductId !== null) {
    const product = products.find(p => p.id === openProductId);
    return (
      <div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setOpenProductId(null)}
            className="p-2.5 bg-white border rounded-xl hover:bg-slate-50 transition shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Simulación de Ventas</p>
            <h2 className="text-2xl font-bold text-[#1a181d] flex items-center gap-2">
              <Package size={20} className="text-[#e17bd7]" /> {product.name}
            </h2>
          </div>
          <span className="ml-auto text-xs bg-[#e17bd7]/10 text-[#e17bd7] px-3 py-1.5 rounded-full font-bold">
            {product.prototypes.length} perfil{product.prototypes.length !== 1 ? 'es' : ''} disponible{product.prototypes.length !== 1 ? 's' : ''}
          </span>
        </div>

        <p className="text-slate-500 mb-6">Seleccioná con qué perfil de cliente querés entrenar.</p>

        {/* Tablero de cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {product.prototypes.map(pr => (
            <button
              key={pr.id}
              onClick={() => onStartChat(pr.id)}
              className="group text-left bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#e17bd7] hover:shadow-lg transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e17bd7]/20 to-[#6be1e3]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-xl">👤</span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#e17bd7] transition-colors">
                {pr.name}
              </h3>
              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#e17bd7] opacity-0 group-hover:opacity-100 transition-opacity">
                Comenzar entrenamiento <ArrowRight size={13} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Vista lista de productos
  return (
    <>
      {/* Vista mobile: cards */}
      <div className="md:hidden space-y-3">
        {products.map(p => (
          <div key={p.id} className="bg-white border rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e17bd7]/20 to-[#6be1e3]/20 flex items-center justify-center flex-shrink-0">
                <Package size={16} className="text-[#e17bd7]" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-800 text-sm truncate">{p.name}</p>
                <span className="text-xs bg-[#e17bd7]/10 text-[#e17bd7] px-2 py-0.5 rounded-full font-bold">
                  {p.prototypes?.length || 0} perfil{(p.prototypes?.length || 0) !== 1 ? 'es' : ''}
                </span>
              </div>
            </div>
            <button onClick={() => setOpenProductId(p.id)} className="bg-[#1a181d] text-white px-3 py-2 rounded-xl text-xs font-bold hover:opacity-80 flex-shrink-0 ml-2">
              Ingresar
            </button>
          </div>
        ))}
      </div>
      {/* Vista desktop: tabla */}
      <div className="hidden md:block bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="text-xs uppercase font-bold text-slate-400 tracking-wider border-b bg-slate-50">
            <tr>
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Perfiles disponibles</th>
              <th className="px-6 py-3 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition align-middle">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e17bd7]/20 to-[#6be1e3]/20 flex items-center justify-center flex-shrink-0">
                      <Package size={16} className="text-[#e17bd7]" />
                    </div>
                    <p className="font-bold text-slate-800">{p.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-[#e17bd7]/10 text-[#e17bd7] px-3 py-1.5 rounded-full font-bold">
                    {p.prototypes?.length || 0} perfil{(p.prototypes?.length || 0) !== 1 ? 'es' : ''}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => setOpenProductId(p.id)} className="bg-[#1a181d] text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition">
                    Ingresar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
function ChatTimerDisplay({ seconds }) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return (
    <span className="ml-3 bg-slate-100 text-slate-600 font-mono font-bold text-sm px-3 py-1.5 rounded-xl">
      ⏱ {mins}:{secs}
    </span>
  );
}
function EmployeePortal() {
  const navigate = useNavigate();
  useEffect(() => { document.title = 'Portal | ONE Commercial IA'; }, []);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [view, setView] = useState('select'); // 'select' | 'chat' | 'feedback'
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [attachFile, setAttachFile] = useState(null);
  const [attachPreview, setAttachPreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [showChatEmoji, setShowChatEmoji] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);

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
      // Arrancar timer
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
      setView('chat');
    } catch (e) {
      alert("Error iniciando la simulación: " + (e.response?.data?.detail || e.message));
    } finally {
      setLoadingStart(false);
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !attachFile) || sending) return;
    const userMsg = input.trim();
    setInput('');
    setSending(true);

    // Construir mensaje visual para el chat
    let displayContent = userMsg;
    if (attachFile?.type === 'image') {
      displayContent = { text: userMsg, imageB64: attachFile.b64, mediaType: attachFile.media_type };
    } else if (attachFile?.type === 'pdf') {
      displayContent = userMsg ? `📄 documento.pdf\n${userMsg}` : `📄 documento.pdf`;
    }

    const newMsgs = [...msgs, { role: 'user', content: displayContent }];
    setMsgs(newMsgs);
    setAttachFile(null);
    setAttachPreview(null);

    try {
      let res;
      if (attachFile?.type === 'image') {
        res = await axios.post(`${API_URL}/chat/message-with-image`, {
          session_id: session,
          message: userMsg || "[imagen compartida]",
          image_b64: attachFile.b64,
          media_type: attachFile.media_type
        });
      } else {
        const messageToSend = attachFile?.type === 'pdf'
          ? `[El vendedor compartió un PDF:\n${attachFile.text}]\n${userMsg}`
          : userMsg;
        res = await axios.post(`${API_URL}/chat/message`, { session_id: session, message: messageToSend });
      }
      const aiResponse = res.data.response;
      const ventaCerrada = aiResponse.includes('[VENTA_CERRADA]');
      const cleanResponse = aiResponse.replace('[VENTA_CERRADA]', '').trim();
      setMsgs([...newMsgs, { role: 'ai', content: cleanResponse }, ...(ventaCerrada ? [{ role: 'sale_closed' }] : [])]);
    } catch {
      setMsgs([...newMsgs, { role: 'ai', content: '⚠️ Error de conexión. Intentá de nuevo.' }]);
    } finally {
      setSending(false);
    }
  };

const handleFileSelect = async (e, type) => {
  const file = e.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  if (type === 'image') formData.append('session_id', session);
  try {
    const endpoint = type === 'image' ? '/chat/image' : '/chat/pdf';
    const res = await axios.post(`${API_URL}${endpoint}`, formData);
    setAttachFile(res.data);
    setAttachPreview(type === 'image' ? `🖼 ${file.name}` : `📄 ${file.name}`);
  } catch { alert('Error procesando el archivo'); }
};

const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mr = new MediaRecorder(stream);
  mediaRecorderRef.current = mr;
  const chunks = [];
  mr.ondataavailable = e => chunks.push(e.data);
  mr.onstop = async () => {
    const blob = new Blob(chunks, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', blob, 'audio.webm');
    try {
      const res = await axios.post(`${API_URL}/chat/audio`, formData);
      setInput(res.data.text);
    } catch { alert('Error procesando el audio'); }
  };
  mr.start();
  setRecording(true);
};

const stopRecording = () => {
  mediaRecorderRef.current?.stop();
  setRecording(false);
};

  const endSession = async () => {
    // Detener timer y capturar duración ANTES de cualquier async
    clearInterval(timerRef.current);
    timerRef.current = null;
    const duration = elapsedSeconds;

    setSending(true);
    try {
      const res = await axios.post(`${API_URL}/chat/feedback`, {
        session_id: session,
        duration_seconds: duration   // ✅ Ahora se envía correctamente
      });
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
      <div className="flex flex-col bg-slate-100" style={{ height: '100dvh' }}>
        <header className="bg-white px-3 md:px-6 py-3 md:py-4 border-b flex justify-between items-center shadow-sm gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button
                onClick={async () => {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                    if (session) {
                        try { await axios.delete(`${API_URL}/sessions/${session}`); } catch (e) { console.error(e); }
                    }
                    setView('select'); setMsgs([]); setSession(null); setElapsedSeconds(0);
                }}
                className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition mr-2"
                title="Volver sin guardar"
            >
                <ArrowLeft size={18} />
            </button>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="min-w-0">
              <p className="font-bold text-[#1a181d] text-sm md:text-base truncate">{agentName} — Cliente Virtual</p>
              <p className="text-xs text-slate-400 hidden md:block">Simulación en curso • {msgs.length - 1} intercambios</p>
            </div>
            <ChatTimerDisplay seconds={elapsedSeconds} />
          </div>
          <button
            onClick={endSession}
            disabled={sending}
            className="bg-red-50 text-red-500 px-2 md:px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition disabled:opacity-50 text-xs md:text-sm flex-shrink-0"
          >
            {sending ? '...' : <span><span className="hidden md:inline">Terminar y </span>Evaluar</span>}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 max-w-4xl mx-auto w-full min-h-0">
          {msgs.map((m, i) => {
            if (m.role === 'sale_closed') return (
              <div key={i} className="flex justify-center my-4">
                <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-6 text-center max-w-sm shadow-lg">
                  <p className="text-4xl mb-2">🎉</p>
                  <p className="text-green-700 font-extrabold text-lg">¡Venta Cerrada!</p>
                  <p className="text-green-600 text-sm mt-1">El cliente confirmó la compra. ¡Excelente trabajo!</p>
                </div>
              </div>
            );
            return (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[75%] text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#1a181d] text-white rounded-br-sm' : 'bg-white text-slate-800 rounded-bl-sm border'}`}>
                  {typeof m.content === 'object' && m.content.imageB64 ? (
                    <div>
                      <img src={`data:${m.content.mediaType};base64,${m.content.imageB64}`} alt="imagen adjunta" className="rounded-xl max-w-full mb-2 max-h-60 object-contain" />
                      {m.content.text && <p>{m.content.text}</p>}
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            );
          })}
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

        <div className="bg-white border-t p-2 md:p-4 max-w-4xl mx-auto w-full flex-shrink-0">
          {/* Preview de archivo adjunto */}
          {attachPreview && (
            <div className="mb-3 flex items-center gap-2 bg-slate-50 border rounded-xl px-4 py-2">
              <span className="text-sm text-slate-600 flex-1">{attachPreview}</span>
              <button onClick={() => { setAttachFile(null); setAttachPreview(null); }} className="text-slate-400 hover:text-red-500"><X size={16} /></button>
            </div>
          )}
          <div className="flex gap-2 items-end">
            {/* Botón imagen */}
            <label className="cursor-pointer p-2 md:p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition flex-shrink-0" title="Adjuntar imagen">
              <input type="file" accept="image/*" className="hidden" onChange={e => handleFileSelect(e, 'image')} />
              <ImageIcon size={18} className="text-slate-500" />
            </label>
            {/* Botón PDF */}
            <label className="cursor-pointer p-2 md:p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition flex-shrink-0" title="Adjuntar PDF">
              <input type="file" accept=".pdf" className="hidden" onChange={e => handleFileSelect(e, 'pdf')} />
              <FileText size={18} className="text-slate-500" />
            </label>
            {/* Botón audio */}
            <button
              onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording}
              className={`p-2 md:p-3 rounded-xl transition flex-shrink-0 ${recording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              title="Mantené presionado para grabar"
            >
              <Mic size={18} />
            </button>
            {/* Botón emoji */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowChatEmoji(v => !v)}
                className="p-2 md:p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition flex-shrink-0 text-sm md:text-base"
                title="Insertar emoji"
              >
                😊
              </button>
              {showChatEmoji && (
                <div
                  style={{ position: 'absolute', bottom: '48px', left: 0, zIndex: 9999 }}
                  className="bg-white border rounded-xl shadow-2xl p-3 grid grid-cols-8 gap-1 w-56"
                >
                  {EMOJI_LIST.map((em, i) => (
                    <button
                      key={i}
                      type="button"
                      className="w-6 h-6 text-sm hover:scale-125 transition flex items-center justify-center rounded"
                      onClick={() => { setInput(prev => prev + em); setShowChatEmoji(false); }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <textarea
              className="flex-1 p-3 rounded-xl border bg-slate-50 outline-none focus:ring-2 focus:ring-[#6be1e3] text-sm resize-none min-w-0"
              value={input}
              placeholder={recording ? '🎙 Grabando...' : 'Escribí tu respuesta como vendedor...'}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={sending || recording}
              rows={1}
              style={{ maxHeight: '120px', overflowY: 'auto' }}
            ></textarea>
            <button
              onClick={sendMessage}
              disabled={sending || (!input.trim() && !attachFile)}
              className="bg-[#6be1e3] text-black p-4 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-40 flex-shrink-0"
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
    const scoreColor = score >= 7 ? 'text-green-500' : score >= 5 ? 'text-orange-500' : 'text-red-500';
    const scoreBg   = score >= 7 ? 'bg-green-50 border-green-200' : score >= 5 ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200';
    const scoreBgCircle = score >= 7 ? 'bg-green-500' : score >= 5 ? 'bg-orange-500' : 'bg-red-500';

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
          <h2 className="text-2xl font-bold text-[#1a181d] mb-6 text-center">Tu Resultado</h2>

          {/* Caso: conversación muy corta, sin puntuación */}
          {(score === 0 || feedback === 'sin_evaluacion') ? (
            <div className="text-center py-8">
              <p className="text-5xl mb-4">🤔</p>
              <p className="text-lg font-bold text-slate-700 mb-2">Conversación insuficiente</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                No hay suficiente información para generar una puntuación.<br/>
                Necesitás al menos <strong>3 intercambios reales</strong> con el cliente para recibir un resultado.
              </p>
            </div>
          ) : (
            <>
              {/* Puntaje */}
              <div className={`text-center p-6 rounded-2xl border mb-6 ${scoreBg}`}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Puntuación Final</p>
                <span className={`w-16 h-16 rounded-full inline-block ${scoreBgCircle}`}></span>
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
            </>
          )}

          <button
            onClick={() => { setView('select'); setFeedback(null); setScore(null); setMsgs([]); setSession(null); }}
            className="w-full bg-[#1a181d] text-white py-4 rounded-xl font-bold hover:opacity-90 transition mt-6"
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
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-[#e17bd7] text-white p-2 rounded-xl shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="text-xl">☰</span>
      </button>
      <aside className={`w-64 bg-[#1a181d] text-white p-6 flex flex-col fixed h-full z-20 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="mb-4"><LogoOneWhite small /></div>
        <div className="mb-6 px-2">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Vendedor</p>
          <p className="font-bold text-white">{user.name}</p>
        </div>
        <nav className="space-y-2 flex-1">
          <button onClick={() => { setActiveSection('entrenar'); setSidebarOpen(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${activeSection === 'entrenar' ? 'bg-[#e17bd7] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><BrainCircuit size={18} /> Entrenar</button>
          <button onClick={() => { setActiveSection('capsulas'); setSidebarOpen(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${activeSection === 'capsulas' ? 'bg-[#6be1e3] text-black font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><BookOpen size={18} /> Biblioteca</button>
          <button onClick={() => { setActiveSection('historial'); setSidebarOpen(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${activeSection === 'historial' ? 'bg-[#e4c76a] text-black font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><TrendingUp size={18} /> Mi Progreso</button>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="text-red-400 flex items-center gap-2 text-sm font-bold px-2 py-3 hover:bg-white/5 rounded-xl transition">
          <LogOut size={16} /> Salir
        </button>
      </aside>

      <main className="ml-0 md:ml-64 flex-1 p-4 md:p-10 pt-16 md:pt-10">
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
            <ProductList products={products} onStartChat={startChat} />
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
                const scoreBgColor = !s.score ? '' : s.score >= 7 ? 'bg-green-500' : s.score >= 5 ? 'bg-orange-500' : 'bg-red-500';
                return (
                  <div key={s.id} className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg">Sesión #{i + 1}</p>
                        <p className="text-xs text-slate-400">{s.date ? new Date(s.date + 'Z').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Fecha no disponible'}</p>
                      </div>
                      <div className="text-right">
                        {s.score ? <span className={`w-8 h-8 rounded-full inline-block ${scoreBgColor}`}></span> : <p className="text-slate-400 text-sm">Sin evaluar</p>}
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