import React from 'react';
// Asegúrate de que tu archivo SVG esté en esta ruta
// Si no tienes la imagen, el código usará el texto automáticamente.
// import logoIcon from '../assets/Logo.svg'; 

const logoIcon = null; // Placeholder para evitar error si no hay imagen

const COLORS = {
  black: "#1a181d",
  pink: "#e17bd7",
  cyan: "#6be1e3"
};

export const LogoOne = ({ small = false }) => (
  <div className={`flex items-center gap-3 select-none`}>
    {logoIcon ? (
      <img 
        src={logoIcon} 
        alt="ONE" 
        className={`${small ? 'h-8' : 'h-10'} w-auto object-contain`}
        onError={(e) => {e.target.style.display='none';}} 
      />
    ) : (
      <div className={`${small ? 'w-8 h-8' : 'w-10 h-10'} rounded-full border-2 flex items-center justify-center relative overflow-hidden bg-white`} style={{ borderColor: COLORS.pink }}>
        <div className="absolute w-full h-full opacity-30 blur-sm" style={{ backgroundColor: COLORS.cyan }}></div>
        <span className={`font-bold z-10 ${small ? 'text-[9px]' : 'text-[10px]'}`} style={{ color: COLORS.black }}>ONE</span>
      </div>
    )}
    <div className="flex flex-col justify-center leading-none">
      <span className={`font-sans font-bold tracking-tight text-[#1a181d] ${small ? 'text-lg' : 'text-2xl'}`}>
        ONE
      </span>
      <span className={`font-sans font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#6be1e3] to-[#e17bd7] ${small ? 'text-[8px]' : 'text-[10px]'}`}>
        Commercial AI
      </span>
    </div>
  </div>
);