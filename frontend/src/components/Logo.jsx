import React from 'react';
import logoIcon from '../assets/Logo.png';

export const LogoOne = ({ small = false }) => (
  <div className="flex items-center gap-1 select-none">
    <img
      src={logoIcon}
      alt="ONE Logo"
      className={`${small ? 'h-10' : 'h-14'} w-auto object-contain`}
    />
    <span className={`font-sans text-white ${small ? 'text-lg' : 'text-2xl'}`}>
      <span className="font-bold">NE</span>{' '}
      <span className="font-light">Commercial IA</span>
    </span>
  </div>
);