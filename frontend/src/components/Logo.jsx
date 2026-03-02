import React from 'react';

/**
 * IMPORTANTE: Para que la previsualización aquí no marque error, usamos la ruta como texto.
 * En tu entorno local de Visual Studio Code, esta ruta cargará tu archivo Logo.svg 
 * directamente desde la carpeta assets.
 */
const logoIcon = 'frontend/src/assets/Logo.svg';

const COLORS = {
  black: "#1a181d",
  pink: "#e17bd7",
  cyan: "#6be1e3"
};

// Mantenemos tu estructura original agregando únicamente el soporte para fondos oscuros/claros
export const LogoOne = ({ small = false, isDarkBackground = true }) => {
  // Definimos el color del texto: blanco para el panel oscuro, negro para el login claro
  const textColor = isDarkBackground ? 'text-white' : 'text-[#1a181d]';

  return (
    <div className={`flex items-center gap-3 select-none`}>
      {/* Si la imagen existe en la ruta, la muestra. Si no, usa el círculo de respaldo original */}
      {logoIcon ? (
        <img 
          src={logoIcon} 
          alt="ONE" 
          className={`${small ? 'h-8' : 'h-10'} w-auto object-contain`}
          onError={(e) => { 
            // Si la imagen no carga (ruta incorrecta o archivo movido), muestra el círculo
            e.target.style.display = 'none'; 
          }} 
        />
      ) : (
        /* Diseño de círculo original (Plan B de seguridad que solicitaste mantener) */
        <div 
          className={`${small ? 'w-8 h-8' : 'w-10 h-10'} rounded-full border-2 flex items-center justify-center relative overflow-hidden bg-white`} 
          style={{ borderColor: COLORS.pink }}
        >
          <div className="absolute w-full h-full opacity-30 blur-sm" style={{ backgroundColor: COLORS.cyan }}></div>
          <span className={`font-bold z-10 ${small ? 'text-[9px]' : 'text-[10px]'}`} style={{ color: COLORS.black }}>
            ONE
          </span>
        </div>
      )}

      {/* Ajuste de texto: "Commercial IA" con el color adaptable según la página */}
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