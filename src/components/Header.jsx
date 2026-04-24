import { useState } from "react";

export default function Header() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-700 pb-4">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Water Quality Monitoring System</h1>
        <p className="text-sm text-slate-400">A monitoring dashboard that presents integrated real-time system observation data to assist in analysis, monitoring, and evaluation processes.</p>
      </div>
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <div className="flex items-center gap-2 text-sm bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>Online
        </div>
        <span className="text-sm text-slate-400">Update: Hari ini, 18:30 WIB</span>
      </div>
    </header>
  );
}