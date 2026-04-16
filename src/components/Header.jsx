import { useState } from "react";

export default function Header() {
  return (
    <div className="flex items-center justify-between px-10 py-2 border-b border-gray-200">
      <h1 className="text-2xl font-manrope font-bold text-gray-800">
        Water Quality Monitoring Dashboard
      </h1>

      {/* Ganti search bar dengan logo/nama */}
      <div className="w-10 h-10 rounded-full bg-[#3599C2] flex items-center justify-center">
        <span className="text-white font-bold text-lg">D</span>
      </div>
    </div>
  );
}