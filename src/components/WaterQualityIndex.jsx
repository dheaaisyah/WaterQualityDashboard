import React from 'react';
import { CheckCircle, Info, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function WaterQualityIndex({ level }) {
  const statusConfig = {
    1: { title: "Air Minum (Excellent Quality)", desc: "Parameter fisik dan kimia berada dalam rentang aman.", border: "border-emerald-500", bgIcon: "bg-emerald-500/20", textAccent: "text-emerald-400", Icon: CheckCircle },
    2: { title: "Air Bersih (Good Quality)", desc: "Disarankan untuk tidak dikonsumsi langsung tanpa proses pengolahan.", border: "border-blue-500", bgIcon: "bg-blue-500/20", textAccent: "text-blue-400", Icon: Info },
    3: { title: "Membutuhkan Pengolahan (Moderate Quality)", desc: "Air tidak disarankan untuk digunakan secara langsung tanpa filtrasi.", border: "border-orange-500", bgIcon: "bg-orange-500/20", textAccent: "text-orange-400", Icon: AlertTriangle },
    4: { title: "Tidak Dapat Digunakan (Poor Quality)", desc: "Tidak disarankan untuk digunakan dalam bentuk apa pun tanpa pengolahan intensif.", border: "border-red-500", bgIcon: "bg-red-500/20", textAccent: "text-red-500", Icon: ShieldAlert }
  };

  const currentStatus = statusConfig[level] || statusConfig[4];
  const StatusIcon = currentStatus.Icon;

  return (
    <div className={`mb-6 bg-slate-800 rounded-xl p-6 border-l-4 shadow-lg flex items-center gap-4 w-full transition-colors duration-300 ${currentStatus.border}`}>
        <div className={`p-3 rounded-full flex-shrink-0 ${currentStatus.bgIcon}`}>
            <StatusIcon size={32} className={currentStatus.textAccent} />
        </div>
        <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Status Kualitas Air Keseluruhan</h2>
            <div className="text-2xl font-bold text-white flex items-center gap-2">{currentStatus.title}</div>
            <p className={`text-sm mt-1 font-medium ${currentStatus.textAccent}`}>{currentStatus.desc}</p>
        </div>
    </div>
  );
}