const statusColors = {
  Normal: {
    bg: "#D1FAE4",
    text: "#079669",
  },
  Moderate: {
    bg: "#FFF7EC",
    text: "#F97315",
  },
  High: {
    bg: "#FEE2E2",
    text: "#E01D48",
  },
};

export default function PredictionCard({title, value, unit, icon, status}) {
  const statusColor = statusColors[status];

  return (
    <div className="p-6 rounded-xl text-gray-600 border border-gray-200 bg-white shadow-md">
      <div className="flex items-center gap-2">
        <img src={icon} alt={title} className="w-8 h-8" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <span className="text-4xl font-semibold">{value}</span>
          <span className="text-xl ml-1">{unit}</span>
        </div>
        <div
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{ backgroundColor: statusColor.bg, color: statusColor.text,}}>{status}
        </div>
      </div>
    </div>
  );
}