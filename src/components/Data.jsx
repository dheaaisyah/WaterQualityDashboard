import React from 'react';
import ChartSection from './ChartSection';
import { Droplet, Thermometer, Activity, AlertTriangle, MessageCircle, X, Send, ActivitySquare, CheckCircle, Info, ShieldAlert } from 'lucide-react';

function scorePH(ph) {
  if (ph >= 6.5 && ph <= 8.5) return 100;
  if (ph >= 6.0 && ph <= 9.0) return 80;
  if (ph >= 5.5 && ph <= 9.5) return 50;
  return 20;
}

function scoreTDS(tds) {
  if (tds < 300) return 100;
  if (tds < 600) return 80;
  if (tds < 1000) return 60;
  return 30;
}

function scoreEC(ec) {
  if (ec < 500) return 100;
  if (ec < 1500) return 70;
  return 40;
}

function scoreTemp(temp) {
  if (temp >= 20 && temp <= 30) return 100;
  if (temp >= 15 && temp <= 35) return 70;
  return 50;
}

function calculateWQIData(sensorData) {
  if (!sensorData) return { level: 4, causes: [] };
  
  const phScore = scorePH(sensorData.ph);
  const tdsScore = scoreTDS(sensorData.tds);
  const ecScore = scoreEC(sensorData.ec);
  const tempScore = scoreTemp(sensorData.temperature);

  // Rumus pembobotan WQI
  const wqi = (0.3 * phScore) + (0.3 * tdsScore) + (0.2 * ecScore) + (0.2 * tempScore);
  const roundedWqi = Math.round(wqi);

  let level = 4;
  if (roundedWqi >= 90) level = 1;
  else if (roundedWqi >= 75) level = 2;
  else if (roundedWqi >= 50) level = 3;

  const causes = [];
  
  if (level !== 1) {
    if (phScore < 100) causes.push({ name: "pH", value: sensorData.ph, color: phScore <= 50 ? "text-red-400" : "text-orange-400", reason: "di luar rentang optimal." });
    if (tdsScore < 100) causes.push({ name: "TDS", value: `${sensorData.tds} ppm`, color: tdsScore <= 60 ? "text-red-400" : "text-orange-400", reason: "melebihi ambang batas." });
    if (ecScore < 100) causes.push({ name: "EC", value: `${sensorData.ec} µS/cm`, color: ecScore <= 40 ? "text-red-400" : "text-orange-400", reason: "meningkat di atas ideal." });
    if (tempScore < 100) causes.push({ name: "Suhu", value: `${sensorData.temperature}°C`, color: tempScore <= 50 ? "text-red-400" : "text-orange-400", reason: "di luar suhu normal." });
    
    // Tambahan deteksi Turbidity langsung (karena sangat penting untuk kekeruhan air)
    if (sensorData.turbidity > 5.0) causes.push({ name: "Turbidity", value: `${sensorData.turbidity} NTU`, color: "text-red-400", reason: "air terlalu keruh." });
  }

  return { level, causes };
}

function WaterQualityIndex({ sensorData }) {
  const { level, causes } = calculateWQIData(sensorData);

  const statusConfig = {
    1: {
      title: "Air Minum (Excellent Quality)",
      desc: "Parameter fisik dan kimia berada dalam rentang aman.",
      border: "border-emerald-500",
      bgIcon: "bg-emerald-500/20",
      textAccent: "text-emerald-400",
      Icon: CheckCircle
    },
    2: {
      title: "Air Bersih (Good Quality)",
      desc: "Disarankan untuk tidak dikonsumsi langsung tanpa proses pengolahan.",
      border: "border-blue-500",
      bgIcon: "bg-blue-500/20",
      textAccent: "text-blue-400",
      Icon: Info
    },
    3: {
      title: "Membutuhkan Pengolahan (Moderate Quality)",
      desc: "Air tidak disarankan untuk digunakan secara langsung tanpa filtrasi.",
      border: "border-orange-500",
      bgIcon: "bg-orange-500/20",
      textAccent: "text-orange-400",
      Icon: AlertTriangle
    },
    4: {
      title: "Tidak Dapat Digunakan (Poor Quality)",
      desc: "Tidak disarankan untuk digunakan dalam bentuk apa pun tanpa pengolahan intensif.",
      border: "border-red-500",
      bgIcon: "bg-red-500/20",
      textAccent: "text-red-500",
      Icon: ShieldAlert
    }
  };

  const currentStatus = statusConfig[level] || statusConfig[4];
  const StatusIcon = currentStatus.Icon;

  return (
    <div className={`mb-6 bg-slate-800 rounded-xl p-6 border-l-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300 ${currentStatus.border}`}>
        <div className="flex items-center gap-4 w-full md:w-2/3">
            <div className={`p-3 rounded-full flex-shrink-0 ${currentStatus.bgIcon}`}>
                <StatusIcon size={32} className={currentStatus.textAccent} />
            </div>
            <div>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Status Kualitas Air Keseluruhan
                </h2>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                    {currentStatus.title}
                </div>
                <p className={`text-sm mt-1 font-medium ${currentStatus.textAccent}`}>
                    {currentStatus.desc}
                </p>
            </div>
        </div>

        {level === 1 || causes.length === 0 ? (
          <div className="text-sm bg-slate-900 p-4 rounded-lg border border-slate-700 w-full md:w-1/3 flex items-center justify-center text-slate-400 font-medium">
            Kondisi air terpantau optimal.
          </div>
        ) : (
          <div className="text-sm bg-slate-900 p-4 rounded-lg border border-slate-700 w-full md:w-1/3">
            <span className="text-slate-400 block mb-2 font-medium">Penyebab Penurunan Kualitas:</span>
            <ul className="text-slate-300 list-disc list-inside space-y-1.5">
              {causes.map((cause, index) => (
                <li key={index}>
                  <span className={`${cause.color} font-semibold`}>{cause.name} ({cause.value})</span> {cause.reason}
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}

export default function Data() {
  const metrics = [
    { name: 'pH', value: '7.2', unit: 'pH', status: 'Normal', color: 'text-green-400', icon: Droplet },
    { name: 'Suhu', value: '28.5', unit: '°C', status: 'Normal', color: 'text-green-400', icon: Thermometer },
    { name: 'EC', value: '1250', unit: 'µS/cm', status: 'Tinggi', color: 'text-orange-400', icon: Activity },
    { name: 'TDS', value: '100', unit: 'ppm', status: 'Normal', color: 'text-green-400', icon: ActivitySquare },
    { name: 'Turbidity', value: '4.2', unit: 'NTU', status: 'Bahaya', color: 'text-red-500', icon: AlertTriangle },
  ];

  const alerts = [
    { time: '18:25', message: 'Turbidity mencapai 4.2 NTU (Melebihi batas aman 3.0 NTU)', type: 'danger' },
    { time: '18:10', message: 'EC meningkat secara signifikan ke 1250 µS/cm', type: 'warning' },
  ];

  const getMetricValue = (metricName) => parseFloat(metrics.find(m => m.name === metricName)?.value || 0);
  
  const currentSensorData = {
    ph: getMetricValue('pH'),
    temperature: getMetricValue('Suhu'),
    ec: getMetricValue('EC'),
    tds: getMetricValue('TDS'),
    turbidity: getMetricValue('Turbidity')
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-6 font-sans">
      <WaterQualityIndex sensorData={currentSensorData} />

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
                    
                    <div 
                      className={`
                        inline-flex items-center gap-1.5 px-2 py-0.5 mt-2 rounded-full text-[10px] font-bold uppercase tracking-wider border
                        ${metric.status === 'Normal' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                        ${metric.status === 'Tinggi' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                        ${metric.status === 'Bahaya' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                      `}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        metric.status === 'Normal' ? 'bg-emerald-400' : 
                        metric.status === 'Tinggi' ? 'bg-orange-400' : 'bg-red-500 animate-pulse'
                      }`}></span>
                      {metric.status}
                    </div>
                    {/* -------------------------------------- */}

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
              <AlertTriangle size={18} className="text-red-400" />
              <h2 className="text-2xl font-semibold text-white">Alert Log</h2>
            </div>
            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <div key={idx} className={`p-3 rounded-lg border text-sm ${alert.type === 'danger' ? 'bg-red-500/10 border-red-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-300">{alert.time}</span>
                  </div>
                  <p className={alert.type === 'danger' ? 'text-red-300' : 'text-orange-300'}>
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}