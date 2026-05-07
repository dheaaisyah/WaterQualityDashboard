import React, { useState, useEffect } from "react";

export default function Header() {
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchTime = async () => {
    try {
      const response = await fetch('https://water-quality-database.vercel.app/api/v1/waterquality/latest');
      const result = await response.json();

      if (result.success && result.dataWaterQuality) {
        // Menggunakan waktu_masuk dari database sesuai skema
        const rawTime = result.dataWaterQuality.waktu_masuk || result.dataWaterQuality.updatedAt;

        if (rawTime) {
          // Membersihkan string waktu agar kebal terhadap offset Timezone browser
          const cleanDateStr = String(rawTime).replace('Z', '').replace('T', ' ');
          const dateObj = new Date(cleanDateStr);
          
          if (!isNaN(dateObj.getTime())) {
            const formattedTime = dateObj.toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }).replace('.', ':');
            
            setLastUpdate(formattedTime);
          }
        }
      }
    } catch (error) {
      console.error("Gagal mengambil waktu update:", error);
    }
  };

  useEffect(() => {
    fetchTime();
    // Sinkronisasi otomatis setiap 1 menit
    const interval = setInterval(fetchTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-700 pb-4 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Water Quality Monitoring System</h1>
        <p className="text-sm text-slate-400 mt-1">
          A monitoring dashboard that presents integrated real-time system observation data to assist in analysis, monitoring, and evaluation processes.
        </p>
      </div>
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <div className="flex items-center gap-2 text-sm bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200">Online</span>
        </div>
        <span className="text-sm font-medium text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
          Update: Hari ini, <span className="text-blue-400 font-bold">{lastUpdate ? `${lastUpdate} WIB` : "--:-- WIB"}</span>
        </span>
      </div>
    </header>
  );
}