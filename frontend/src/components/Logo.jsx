import React from 'react';
// ESTA ES LA LÍNEA MÁGICA: Obliga a Netlify a empaquetar tu imagen
import logoIcon from '../assets/Logo.svg';

const COLORS = {
  black: "#1a181d",
  pink: "#e17bd7",
  cyan: "#6be1e3"
};

export const LogoOne = ({ small = false, isDarkBackground = true }) => {
  const textColor = isDarkBackground ? 'text-white' : 'text-[#1a181d]';

  return (
    <div className={`flex items-center gap-3 select-none`}>
      {logoIcon ? (
        <img 
          src={logoIcon} 
          alt="ONE" 
          className={`${small ? 'h-8' : 'h-10'} w-auto object-contain`}
          onError={(e) => { e.target.style.display='none'; }} 
        />
      ) : (
        <div className={`${small ? 'w-8 h-8' : 'w-10 h-10'} rounded-full border-2 flex items-center justify-center relative overflow-hidden bg-white`} style={{ borderColor: COLORS.pink }}>
          <div className="absolute w-full h-full opacity-30 blur-sm" style={{ backgroundColor: COLORS.cyan }}></div>
          <span className={`font-bold z-10 ${small ? 'text-[9px]' : 'text-[10px]'}`} style={{ color: COLORS.black }}>ONE</span>
        </div>
      )}

      {/* Usamos whitespace-nowrap para que Comercial IA se mantenga en 1 sola línea */}
      <div className="flex flex-col justify-center leading-none mt-1">
        <span className={`font-sans whitespace-nowrap tracking-wide ${textColor} ${small ? 'text-xl' : 'text-2xl'}`}>
          Commercial IA
        </span>
      </div>
    </div>
  );
};

export default LogoOne;
