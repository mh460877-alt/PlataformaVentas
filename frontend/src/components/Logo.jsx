import React from 'react';

// Almacenamos la ruta como una cadena de texto pura. 
// Esto asegura que el compilador no falle intentando buscar el archivo localmente.
// Si esta ruta no te funciona en local, simplemente cambia esta línea por:
// import logoIcon from '../assets/Logo.svg';
const logoIcon = '/src/assets/Logo.svg';

export const LogoOne = ({ small = false, isDarkBackground = true }) => {
  // Ajusta el color del texto dependiendo de si el fondo es oscuro (SuperAdmin) o claro (Login)
  const textColor = isDarkBackground ? 'text-white' : 'text-[#1a181d]';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Aquí insertamos tu archivo Logo.svg real como una imagen estándar */}
      <img
        src={logoIcon}
        alt="ONE"
        className={`${small ? 'h-8' : 'h-10'} w-auto object-contain`}
      />
      
      {/* El texto "Commercial IA" perfectamente alineado al lado, 
          con una tipografía limpia y sin la palabra ONE */}
      <span className={`font-sans tracking-wide ${small ? 'text-xl' : 'text-3xl'} ${textColor}`}>
        Commercial IA
      </span>
    </div>
  );
};

export default LogoOne;