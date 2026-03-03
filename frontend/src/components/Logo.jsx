import React from 'react';
import logoBlanco from '../assets/Logo-blanco.png';
import logoNegro from '../assets/Logo-negro.png';

export const LogoOne = ({ small = false, dark = false }) => (
  <div className="flex items-center select-none">
    <img
      src={dark ? logoBlanco : logoNegro}
      alt="ONE Commercial IA"
      className={`${small ? 'h-8' : 'h-10'} w-auto object-contain`}
    />
  </div>
);