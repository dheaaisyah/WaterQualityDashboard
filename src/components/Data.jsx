import React, { useState, useEffect } from 'react';
import ChartSection from './ChartSection';
import WaterQualityIndex from './WaterQualityIndex';
import { calculateWQIData } from './CalculateWQI';
import { Droplet, Thermometer, Activity, AlertTriangle, ActivitySquare, Loader2 } from 'lucide-react';

export default function Data() {
  const [sensorData, setSensorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLatestData = async () => {
    try {
      const response = await fetch('https://water-quality-database.vercel.app/api/v1/waterquality/latest');
      const result = await response.json();

      if (result.success && result.dataWaterQuality) {
        const parsedData = {
          ph: parseFloat(result.dataWaterQuality.ph || 0),
          temperature: parseFloat(result.dataWaterQuality.suhu || 0), 
          ec: parseFloat(result.dataWaterQuality.ec || 0),
          tds: parseFloat(result.dataWaterQuality.tds || 0),
          turbidity: parseFloat(result.dataWaterQuality.turbidity || 0),
          updatedAt: new Date(result.dataWaterQuality.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        setSensorData(parsedData);
      } else {
        throw new Error(result.message || "Gagal mengambil data");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestData();
    const interval = setInterval(() => { fetchLatestData(); }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (name, value) => {
    if (name === 'pH') return (value >= 6.5 && value <= 8.5) ? 'Normal' : 'Bahaya';
    if (name === 'Suhu') return (value >= 20 && value <= 30) ? 'Normal' : 'Tinggi';
    if (name === 'EC') return value < 500 ? 'Normal' : (value < 1500 ? 'Tinggi' : 'Bahaya');
    if (name === 'TDS') return value < 300 ? 'Normal' : (value < 600 ? 'Tinggi' : 'Bahaya');
    if (name === 'Turbidity') return value < 3.0 ? 'Normal' : 'Bahaya';
    return 'Normal';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mr-2" size={24} /> Memuat data sensor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400">
        <AlertTriangle className="mr-2" size={24} /> Error: {error}
      </div>
    );
  }

  const metrics = [
    { name: 'pH', value: sensorData.ph.toFixed(2), unit: 'pH', status: getStatus('pH', sensorData.ph), icon: Droplet },
    { name: 'Suhu', value: sensorData.temperature.toFixed(1), unit: '°C', status: getStatus('Suhu', sensorData.temperature), icon: Thermometer },
    { name: 'EC', value: sensorData.ec.toFixed(0), unit: 'µS/cm', status: getStatus('EC', sensorData.ec), icon: Activity },
    { name: 'TDS', value: sensorData.tds.toFixed(0), unit: 'ppm', status: getStatus('TDS', sensorData.tds), icon: ActivitySquare },
    { name: 'Turbidity', value: sensorData.turbidity.toFixed(1), unit: 'NTU', status: getStatus('Turbidity', sensorData.turbidity), icon: AlertTriangle },
  ];

  const { level, causes } = calculateWQIData(sensorData);

  const alerts = [
    ...causes.map(cause => ({
      time: sensorData.updatedAt,
      message: `Peringatan: ${cause.name} (${cause.value}) ${cause.reason}`,
      type: cause.type
    })),
    { time: sensorData.updatedAt, message: `Data terakhir diperbarui dari server`, type: 'info' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-6 font-sans">
      
      <WaterQualityIndex level={level} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {metrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-400 font-medium text-sm">{metric.name}</span>
                    <Icon size={18} className="text-slate-500" />
                  </div>
                  
                  <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold text-white">
                      {metric.value} <span className="text-sm font-normal text-slate-400">{metric.unit}</span>
                    </div>
                    
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 mt-2 rounded-full text-[10px] font-bold uppercase tracking-wider border
                        ${metric.status === 'Normal' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                        ${metric.status === 'Tinggi' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                        ${metric.status === 'Bahaya' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                        ${metric.status === 'Info' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${metric.status === 'Normal' ? 'bg-emerald-400' : metric.status === 'Tinggi' ? 'bg-orange-400' : 'bg-red-500 animate-pulse'}`}></span>
                      {metric.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <ChartSection />
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg h-full max-h-[600px] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700">
              <AlertTriangle size={18} className={alerts.some(a => a.type === 'danger') ? "text-red-400" : "text-blue-400"} />
              <h2 className="text-2xl font-semibold text-white">Log Aktivitas</h2>
            </div>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                 <div className="p-3 text-center text-sm text-slate-500">Sistem berjalan normal.</div>
              ) : (
                alerts.map((alert, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border text-sm ${alert.type === 'danger' ? 'bg-red-500/10 border-red-500/30' : alert.type === 'warning' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-300">{alert.time}</span>
                    </div>
                    <p className={alert.type === 'danger' ? 'text-red-300' : alert.type === 'warning' ? 'text-orange-300' : 'text-blue-300'}>
                      {alert.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}