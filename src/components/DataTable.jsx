import { useState } from "react";

const statusColors = {
  Good: { bg: "#D1FAE4", text: "#079669" },
  Moderate: { bg: "#FFF7EC", text: "#F97315" },
  Bad: { bg: "#FEE2E2", text: "#E01D48" },
};

const infoMessages = {
  Good: "Kualitas air dalam batas normal.",
  Moderate: "Kualitas air perlu diperhatikan.",
  Bad: "Kualitas air di luar batas standar, segera periksa!",
};

const data = [
  { time:"06/03/2026 16:00", temp:"25.1", acidity:"7.2", tds:"320", turbidity:"5", status:"Good" },
  { time:"06/03/2026 16:02", temp:"26.3", acidity:"7.3", tds:"330", turbidity:"5", status:"Good" },
  { time:"06/03/2026 16:04", temp:"27.5", acidity:"7.2", tds:"335", turbidity:"6", status:"Good" },
  { time:"06/03/2026 16:06", temp:"29.0", acidity:"7.4", tds:"340", turbidity:"6", status:"Moderate" },
  { time:"06/03/2026 16:08", temp:"30.2", acidity:"7.3", tds:"345", turbidity:"7", status:"Moderate" },
  { time:"06/03/2026 16:10", temp:"31.4", acidity:"7.5", tds:"350", turbidity:"7", status:"Moderate" },
  { time:"06/03/2026 16:12", temp:"33.1", acidity:"7.4", tds:"355", turbidity:"8", status:"Moderate" },
  { time:"06/03/2026 16:14", temp:"34.0", acidity:"7.6", tds:"360", turbidity:"8", status:"Moderate" },
  { time:"06/03/2026 16:16", temp:"36.5", acidity:"7.7", tds:"370", turbidity:"9", status:"Moderate" },
  { time:"06/03/2026 16:18", temp:"38.2", acidity:"7.8", tds:"380", turbidity:"9", status:"Moderate" },

  { time:"06/03/2026 16:20", temp:"40.5", acidity:"7.9", tds:"390", turbidity:"10", status:"Bad" },
  { time:"06/03/2026 16:22", temp:"42.0", acidity:"8.0", tds:"400", turbidity:"11", status:"Bad" },
  { time:"06/03/2026 16:24", temp:"44.3", acidity:"8.1", tds:"410", turbidity:"12", status:"Bad" },
  { time:"06/03/2026 16:26", temp:"45.7", acidity:"8.2", tds:"420", turbidity:"12", status:"Bad" },
  { time:"06/03/2026 16:28", temp:"47.8", acidity:"8.3", tds:"430", turbidity:"13", status:"Bad" },
  { time:"06/03/2026 16:30", temp:"49.1", acidity:"8.4", tds:"440", turbidity:"14", status:"Bad" },
  { time:"06/03/2026 16:32", temp:"50.5", acidity:"8.5", tds:"450", turbidity:"15", status:"Bad" },
  { time:"06/03/2026 16:34", temp:"52.3", acidity:"8.6", tds:"460", turbidity:"16", status:"Bad" },
  { time:"06/03/2026 16:36", temp:"54.0", acidity:"8.7", tds:"470", turbidity:"17", status:"Bad" },
  { time:"06/03/2026 16:38", temp:"55.6", acidity:"8.8", tds:"480", turbidity:"18", status:"Bad" }
];

export default function DataTable() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const parseDate = (str) => {
    const [date, time] = str.split(" ");
    const [day, month, year] = date.split("/");
    return new Date(`${year}-${month}-${day}T${time}`);
  };

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const filteredData = data
    .filter((item) => parseDate(item.time) >= oneHourAgo)
    .sort((a, b) => parseDate(b.time) - parseDate(a.time));

  const startIndex = (page - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200">
      <table className="w-full text-center">
        <thead className="bg-white text-gray-600 border-b border-gray-200">
          <tr>
            <th className="p-3 font-semibold">Timestamp</th>
            <th className="p-3 font-semibold">Temperature (°C)</th>
            <th className="p-3 font-semibold">Acidity</th>
            <th className="p-3 font-semibold">TDS (ppm)</th>
            <th className="p-3 font-semibold">Turbidity (NTU)</th>
            <th className="p-3 font-semibold">Status</th>
            <th className="p-3 font-semibold">Information</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-6 text-gray-400">Belum ada data dalam 1 jam terakhir.</td>
            </tr>
          ) : (
            currentData.map((item, i) => {
              const statusColor = statusColors[item.status] || statusColors.Good;
              return (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.time}</td>
                  <td className="p-3 font-medium">{item.temp}</td>
                  <td className="p-3 font-medium">{item.acidity}</td>
                  <td className="p-3 font-medium">{item.tds}</td>
                  <td className="p-3 font-medium">{item.turbidity}</td>
                  <td className="p-3 font-medium">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: statusColor.bg, color: statusColor.text }}x>{item.status}
                    </span>
                  </td>
                  <td className="p-3 font-medium">{infoMessages[item.status]}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center p-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}>
          Previous
        </button>
        <span className="text-sm">Page {page} of {totalPages || 1}</span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || totalPages === 0}>
          Next
        </button>
      </div>
    </div>
  );
}