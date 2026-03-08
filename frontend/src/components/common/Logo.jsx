import React from "react";

export default function Logo() {
  return (
    <div className="flex flex-col items-center justify-center select-none">
      
      {/* Factory Icon */}
      <div className="mb-2">
        <svg
          width="60"
          height="60"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="8" y="28" width="48" height="24" rx="2" fill="#0D1625" stroke="#00D4FF" strokeWidth="2"/>
          <rect x="14" y="34" width="6" height="6" fill="#00D4FF"/>
          <rect x="24" y="34" width="6" height="6" fill="#00D4FF"/>
          <rect x="34" y="34" width="6" height="6" fill="#00D4FF"/>
          <rect x="44" y="34" width="6" height="6" fill="#00D4FF"/>
          <rect x="18" y="16" width="6" height="12" fill="#00D4FF"/>
          <rect x="36" y="12" width="6" height="16" fill="#00D4FF"/>
        </svg>
      </div>

      {/* SmartFactory Text */}
      <h1 className="text-2xl font-bold tracking-wider">
        <span className="text-cyan-400">smart</span>
        <span className="text-white">factory</span>
      </h1>

      {/* Localhost */}
      <p className="text-xs text-gray-400 tracking-[4px]">localhost</p>
    </div>
  );
}