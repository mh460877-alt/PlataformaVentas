import React from 'react';
import logoIcon from '../assets/Logo.svg';

export const LogoOne = ({ small = false, whiteText = false }) => (
  <div className={`flex items-center gap-3 select-none`}>
    <img
      src={logoIcon}
      alt="ONE Commercial IA"
      className={`${small ? 'h-8' : 'h-10'} w-auto object-contain`}
      onError={(e) => { e.target.style.display = 'none'; }}
    />
    <span
      className={`font-sans font-bold tracking-tight ${small ? 'text-lg' : 'text-2xl'}`}
      style={{ color: whiteText ? '#ffffff' : '#1a181d' }}
    >
      Commercial IA
    </span>
  </div>
);