import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Layers, Target } from 'lucide-react';
import { LogoOne } from '../components/Logo';

const COLORS = {
  black: "#1a181d", white: "#fefeff", pink: "#e17bd7", 
  cyan: "#6be1e3", gold: "#e4c76a", gray: "#a4a8c0",
  gradient_text: "bg-clip-text text-transparent bg-gradient-to-r from-[#6be1e3] via-[#e17bd7] to-[#e4c76a]"
};

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden flex flex-col" style={{ backgroundColor: COLORS.white }}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#e17bd7]/10 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-[#6be1e3]/10 to-transparent rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full relative z-20">
        <LogoOne />
        <button onClick={() => navigate('/login')} className="px-6 py-2 rounded-full font-bold text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 text-sm" style={{ backgroundColor: COLORS.black }}>
          Ingresar
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 w-full max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-12 mt-4">
          <div className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase border border-slate-200 rounded-full">Ecosistema ONE | Human-Tech</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-[#1a181d]">
            Entrenamiento Comercial <br/>
            <span className={COLORS.gradient_text}>Estratégico y Medible</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            Simula escenarios reales, evalúa el desempeño objetivamente y asegura el cierre.
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="text-white px-8 py-3 rounded-xl text-base font-bold shadow-xl transition-all hover:scale-105 flex items-center mx-auto gap-2 group"
            style={{ background: `linear-gradient(90deg, ${COLORS.cyan} 0%, ${COLORS.pink} 100%)` }}
          >
            Comenzar Ahora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition"/>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full mb-12">
          {[{icon: BrainCircuit, color: COLORS.cyan, title: "Simulación", desc: "Clientes virtuales realistas."}, {icon: Layers, color: COLORS.pink, title: "Cápsulas", desc: "Biblioteca de contenidos."}, {icon: Target, color: COLORS.gold, title: "Analítica", desc: "Feedback objetivo."}].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 border border-slate-100 group relative overflow-hidden">
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-slate-50" style={{ color: item.color }}><item.icon size={24}/></div>
                    <h3 className="text-lg font-bold mb-2 text-[#1a181d]">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="py-6 text-center text-slate-400 text-xs border-t border-slate-50 bg-white">© 2026 ONE Commercial AI.</footer>
    </div>
  );
}