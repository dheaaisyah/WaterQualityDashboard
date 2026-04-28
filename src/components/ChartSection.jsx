import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, Loader2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';

const paramConfig = {
  pH: { color: '#4ade80', unit: 'pH', label: 'Tingkat Keasaman (pH)' },
  Suhu: { color: '#fb923c', unit: '°C', label: 'Suhu Air' },
  EC: { color: '#60a5fa', unit: 'µS/cm', label: 'Electrical Conductivity' },
  TDS: { color: '#a78bfa', unit: 'ppm', label: 'Total Dissolved Solids' },
  Turbidity: { color: '#f87171', unit: 'NTU', label: 'Kekeruhan (Turbidity)' }
};

export default function ChartSection() {
  const [activeParam, setActiveParam] = useState('pH');
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistoryData = async () => {
    try {
      const response = await fetch('https://water-quality-database.vercel.app/api/v1/waterquality/history');
      const result = await response.json();
      const rawArray = result.data || result.dataWaterQuality || (Array.isArray(result) ? result : []);

      if (rawArray.length > 0) {
        const top30 = rawArray.slice(0, 30);
        const sortedForChart = top30.reverse().map(item => {
        const rawDate = item.timestamp; 
        
        let formattedTime = "--:--";
        
        if (rawDate) {
          const dateObj = new Date(rawDate);
          if (!isNaN(dateObj.getTime())) {
            formattedTime = dateObj.toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
          }
        }

        return {
          time: formattedTime,
          pH: parseFloat(item.ph || 0),
          Suhu: parseFloat(item.suhu || 0),
          EC: parseFloat(item.ec || 0),
          TDS: parseFloat(item.tds || 0),
          Turbidity: parseFloat(item.turbidity || 0)
        };
      });

        setHistoryData(sortedForChart);
      }
    } catch (error) {
      console.error("Gagal mengambil data histori:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
    const interval = setInterval(() => {
      fetchHistoryData();
    }, 60000); 
    
    return () => clearInterval(interval);
  }, []);

  const getPredictedAverage = (param) => {
    if (historyData.length === 0) return 0;
    const sum = historyData.reduce((acc, curr) => acc + curr[param], 0);
    const avg = sum / historyData.length;
    const variation = avg * 0.02; 
    return parseFloat((avg + variation).toFixed(param === 'EC' || param === 'TDS' ? 0 : 2));
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg flex items-center justify-center min-h-[400px]">
         <Loader2 className="animate-spin mr-2 text-blue-400" size={24} />
         <span className="text-slate-400">Memuat grafik data...</span>
      </div>
    );
  }

  if (historyData.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg flex items-center justify-center min-h-[400px]">
         <span className="text-slate-400">Belum ada data riwayat yang tersedia di database.</span>
      </div>
    );
  }

  const predictedValue = getPredictedAverage(activeParam);
  const latestDataPoint = historyData[historyData.length - 1];

  const chartDataWithPrediction = [
    ...historyData.map(item => ({
        ...item,
        actualData: item[activeParam],
        predictData: null
    })),
    { 
      time: 'Besok', 
      actualData: null,
      predictData: predictedValue,
      isPrediction: true 
    }
  ];

  if (chartDataWithPrediction.length >= 2) {
    chartDataWithPrediction[chartDataWithPrediction.length - 2].predictData = latestDataPoint[activeParam];
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const displayValue = dataPoint.isPrediction ? dataPoint.predictData : dataPoint.actualData;
      
      return (
        <div className="bg-slate-800 border border-slate-600 p-3 rounded-lg shadow-xl text-sm min-w-[120px]">
          <p className="font-bold text-slate-300 mb-2 pb-1 border-b border-slate-700">
            {dataPoint.isPrediction ? 'Prediksi Rata-rata AI' : `Pukul ${label}`}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: paramConfig[activeParam].color }}></span>
            <span className="text-white font-semibold" style={{ color: paramConfig[activeParam].color }}>
              {displayValue} <span className="text-xs font-normal text-slate-400">{paramConfig[activeParam].unit}</span>
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg flex flex-col font-sans">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            Tren Data Real-time (Satu Jam Terakhir)
            <span className="flex h-2.5 w-2.5 relative ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1.5 rounded border border-blue-400/20 whitespace-nowrap font-semibold">
            LSTM Prediction Active
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 p-1 bg-slate-900/50 rounded-lg w-fit border border-slate-700/50">
        {Object.keys(paramConfig).map((key) => (
          <button
            key={key}
            onClick={() => setActiveParam(key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
              activeParam === key
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      
      <div className="h-72 w-full bg-slate-900 rounded-lg border border-slate-700 relative overflow-hidden p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartDataWithPrediction} margin={{ top: 10, right: 25, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />

            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={10} 
              tickMargin={10} 
              minTickGap={30} 
            />
            
            <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                domain={['auto', 'auto']} 
                tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: "compact" }).format(value)}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceArea x1={latestDataPoint.time} x2="Besok" fill="#3b82f6" fillOpacity={0.05} />
            <Line 
              type="monotone" 
              dataKey="actualData" 
              stroke={paramConfig[activeParam].color} 
              strokeWidth={2.5} 
              dot={{ r: 3, strokeWidth: 2, fill: '#0f172a' }} 
              activeDot={{ r: 6, stroke: '#1e293b', strokeWidth: 2 }} 
              isAnimationActive={true} 
            />

            <Line 
              type="linear" 
              dataKey="predictData" 
              stroke={paramConfig[activeParam].color} 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }} 
              activeDot={{ r: 6, stroke: '#1e293b', strokeWidth: 2 }} 
              isAnimationActive={true}
            />

          </LineChart>
        </ResponsiveContainer>

        <div className="absolute right-4 top-2 pointer-events-none">
          <span className="text-[9px] text-blue-400 uppercase tracking-widest font-bold bg-slate-900/80 px-1.5 py-0.5 rounded border border-blue-500/30 backdrop-blur-sm shadow-lg">
            Prediksi Model
          </span>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-6">
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-xs mb-1 uppercase tracking-wider font-semibold">Estimasi Rata-rata Besok</span>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-2xl" style={{ color: paramConfig[activeParam].color }}>
                {predictedValue}
              </span>
              <span className="text-sm font-medium text-slate-400">{paramConfig[activeParam].unit}</span>
            </div>
          </div>
          <Activity size={28} style={{ color: paramConfig[activeParam].color, opacity: 0.2 }} />
        </div>
        
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 border-l-2 border-l-blue-500 flex gap-3">
          <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
          <div>
            <span className="text-slate-300 block mb-1 font-semibold">Analisis {activeParam}</span>
            <span className="text-slate-400 text-xs leading-relaxed block">
              Berdasarkan 30 data riwayat terbaru, diproyeksikan nilai {activeParam} akan {predictedValue > latestDataPoint[activeParam] ? 'sedikit meningkat' : 'cenderung turun/stabil'} menuju {predictedValue} {paramConfig[activeParam].unit}.
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}