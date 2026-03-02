import React from 'react';
// 1. Importación real para tu computadora (en este chat marcará error, no te preocupes)
import logoIcon from '../assets/Logo.svg'; 

const COLORS = {
  black: "#1a181d",
  pink: "#e17bd7",
  cyan: "#6be1e3"
};

// 2. Mantenemos tu estructura agregando solo 'isDarkBackground' para el color del texto
export const LogoOne = ({ small = false, isDarkBackground = true }) => {
  const textColor = isDarkBackground ? 'text-white' : 'text-[#1a181d]';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Si existe la imagen la muestra, sino usa tu círculo de respaldo original */}
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
      
      {/* 3. El texto ajustado: Quitamos el "ONE" repetido y dejamos "Commercial IA" */}
      <div className="flex flex-col justify-center leading-none">
        <span className={`font-sans font-bold tracking-tight ${textColor} ${small ? 'text-lg' : 'text-2xl'}`}>
          Commercial IA
        </span>
        <span className={`font-sans font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#6be1e3] to-[#e17bd7] ${small ? 'text-[8px]' : 'text-[10px]'}`}>
          Soluciones Inteligentes
        </span>
      </div>
    </div>
  );
};

export default LogoOne;