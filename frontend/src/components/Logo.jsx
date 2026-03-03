import React from 'react';

// 🔴 INSTRUCCIÓN VITAL PARA TU VS CODE 🔴
// 1. Borra las dos barras "//" al inicio de la siguiente línea para activar la imagen real en tu PC:
import logoIcon from '../assets/Logo.svg';

// 2. Borra por completo la siguiente línea cuando pegues esto en tu PC:

export const LogoOne = ({ small = false }) => {
  return (
    // w-max asegura que el contenedor tome el ancho exacto sin dejarse aplastar
    <div className="flex items-center gap-3 select-none w-max">
      
      {/* flex-shrink-0 evita que la imagen se reduzca o deforme por el panel */}
      <img 
        src={logoIcon} 
        alt="ONE Commercial" 
        className={`${small ? 'h-8' : 'h-10'} w-auto object-contain flex-shrink-0`}
      />
      
      {/* whitespace-nowrap asegura que NUNCA se parta en dos líneas */}
      <span className={`font-sans font-bold tracking-wide whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#6be1e3] to-[#e17bd7] ${small ? 'text-xl' : 'text-2xl'}`}>
        Commercial IA
      </span>
      
    </div>
  );
};

export default LogoOne;