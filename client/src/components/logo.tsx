import React from 'react';
import { useLocation } from 'wouter';

export function Logo() {
  const [location, navigate] = useLocation();

  return (
    <div 
      className="flex items-center cursor-pointer" 
      onClick={() => navigate("/")}
    >
      <i className="fas fa-leaf text-primary text-xl mr-2"></i>
      <h1 className="text-xl font-semibold text-neutral-800">NutriTrack</h1>
    </div>
  );
}
