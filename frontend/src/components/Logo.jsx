import React from 'react';
import logoIcon from '../assets/Logo.svg';

export const LogoOne = ({ small = false }) => (
  <div className="flex items-center gap-1 select-none">
    <img
      src={logoIcon}
      alt="ONE Logo"
      className={`${small ? 'h-10' : 'h-14'} w-auto object-contain`}
    />
    <div className="flex items-baseline gap-2 leading-none">
      <span
        className={`font-sans font-bold text-white ${small ? 'text-xl' : 'text-3xl'}`}
      >
        NE
      </span>
      <span
        className={`font-sans font-light text-white ${small ? 'text-sm' : 'text-xl'}`}
      >
        Commercial IA
      </span>
    </div>
  </div>
);