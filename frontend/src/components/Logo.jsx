import React from 'react';

// 🔴🔴🔴 INSTRUCCIÓN VITAL PARA TU VISUAL STUDIO CODE 🔴🔴🔴
// Para que no salte el error en este entorno, he comentado el import.
// Cuando pegues este código en tu computadora, DEBES hacer 2 cosas:
// 1. Borra las dos barras "//" de la línea de abajo para activarla:
import logoIcon from '../assets/Logo.svg';

// 2. Borra por completo la siguiente línea:

export const LogoOne = ({ small = false, isDarkBackground = true }) => {
  const textColor = isDarkBackground ? 'text-white' : 'text-[#1a181d]';

  return (
    <div className="flex items-center gap-3 select-none">
      <img 
        src={logoIcon} 
        alt="ONE Commercial" 
        className={`${small ? 'h-8' : 'h-10'} w-auto object-contain`}
      />
      
      <span className={`font-sans whitespace-nowrap tracking-wide font-medium ${textColor} ${small ? 'text-xl' : 'text-2xl'}`}>
        Commercial IA
      </span>
    </div>
  );
};

export default LogoOne;