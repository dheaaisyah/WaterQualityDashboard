import React, { useState } from 'react';
import { Droplet, Thermometer, Activity, AlertTriangle, MessageCircle, X, Send, ActivitySquare } from 'lucide-react';

export default function ChatBot() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
    {isChatOpen && (
        <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl w-80 mb-4 overflow-hidden flex flex-col">
            <div className="bg-slate-700 p-3 flex justify-between items-center">
                <div className="flex items-center gap-2 text-white font-medium">
                <MessageCircle size={18} className="text-blue-400" />Aqua-Bot
            </div>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={18} />
            </button>
        </div>
        <div className="p-4 h-64 overflow-y-auto flex flex-col gap-3 text-sm bg-slate-900">
            <div className="bg-slate-800 p-2 rounded-lg rounded-tl-none self-start max-w-[85%] text-slate-300">
                Halo! Ada yang ingin ditanyakan seputar kondisi air saat ini, histori kemarin, atau prediksi besok?
            </div>
            <div className="bg-blue-600 p-2 rounded-lg rounded-tr-none self-end max-w-[85%] text-white">
                Bagaimana kondisi pH hari ini?
            </div>
            <div className="bg-slate-800 p-2 rounded-lg rounded-tl-none self-start max-w-[85%] text-slate-300 border-l-2 border-blue-400">
                Kondisi pH saat ini terpantau stabil di angka 7.2. Prediksi untuk besok juga tetap berada di ambang batas normal.
            </div>
        </div>
        <div className="p-3 border-t border-slate-700 bg-slate-800 flex gap-2">
            <input 
            type="text" 
            placeholder="Tanya sesuatu..." 
            className="w-full bg-slate-900 text-sm text-white rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"/>
            <button className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md transition">
            <Send size={16} />
            </button>
        </div>
    </div>
    )}

    <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-500/20 transition-transform hover:scale-105">
        <MessageCircle size={24} />
    </button>
    </div>
  );
}