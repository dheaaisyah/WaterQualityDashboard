import React from 'react';
import { CheckCircle, Info, AlertTriangle, ShieldAlert } from 'lucide-react';

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
  if (!sensorData) return { level: 3, causes: [] };
  
  const phScore = scorePH(sensorData.ph);
  const tdsScore = scoreTDS(sensorData.tds);
  const ecScore = scoreEC(sensorData.ec);
  const tempScore = scoreTemp(sensorData.temperature);

  const wqi = (0.3 * phScore) + (0.3 * tdsScore) + (0.2 * ecScore) + (0.2 * tempScore);
  const roundedWqi = Math.round(wqi);

  let level = 4;
  if (roundedWqi >= 90) level = 1;
  else if (roundedWqi >= 75) level = 2;
  else if (roundedWqi >= 50) level = 3;

  const causes = [];
  if (level !== 1) {
    if (phScore < 100) causes.push({ 
      name: "pH", 
      value: sensorData.ph, 
      color: phScore <= 50 ? "text-red-400" : "text-orange-400", 
      reason: "di luar rentang optimal." 
    });
    
    if (tdsScore < 100) causes.push({ 
      name: "TDS", 
      value: `${sensorData.tds} ppm`, 
      color: tdsScore <= 60 ? "text-red-400" : "text-orange-400", 
      reason: "melebihi ambang batas." 
    });
    
    if (ecScore < 100) causes.push({ 
      name: "EC", 
      value: `${sensorData.ec} µS/cm`, 
      color: ecScore <= 40 ? "text-red-400" : "text-orange-400", 
      reason: "meningkat di atas ideal." 
    });
    
    if (tempScore < 100) causes.push({ 
      name: "Suhu", 
      value: `${sensorData.temperature}°C`, 
      color: tempScore <= 50 ? "text-red-400" : "text-orange-400", 
      reason: "di luar suhu normal." 
    });
  }

  return { level, causes };
}

export default function WaterQualityIndex({ sensorData }) {
  
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
      desc: "Air tidak disarankan untuk digunakan secara langsung tanpa proses filtrasi terlebih dahulu.",
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