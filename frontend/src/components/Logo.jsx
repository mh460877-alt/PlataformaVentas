import React from 'react';
// 🟢 INSTRUCCIÓN PARA TU VS CODE 🟢
// 1. Borra las dos barras "//" al inicio de la siguiente línea para activarla:
import logoIcon from '../assets/Logo.svg';
// 2. Borra por completo esta línea:

export const LogoOne = ({ small = false }) => {
  return (
    <div className="flex items-center select-none">
      <img 
        src={logoIcon} 
        alt="ONE Commercial" 
        /* Hacemos la imagen un poco más grande para que luzca perfecta */
        className={`${small ? 'h-8' : 'h-12'} w-auto object-contain`}
      />
    </div>
  );
};

export default LogoOne;