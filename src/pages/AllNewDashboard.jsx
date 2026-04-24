import Header from "../components/Header";
import SensorCard from "../components/SensorCard";
import PredictionCard from "../components/PredictionCard";
import ChartSection from "../components/ChartSection";
import DataTable from "../components/DataTable";
import AllNew from "../components/AllNew";
import { useSensorData } from "../hooks/useSensorData";

export default function Dashboard() {
  
  // const { sensorData, prediction, loading, error } = useSensorData();

  // if (loading) return <div className="p-10">Memuat data...</div>;
  // if (error) return <div className="p-10 text-red-500">Error: {error}</div>;

  // const latest = sensorData[0] ?? {};

  return (
    <div className="bg-white p-4 font-manrope">
        <AllNew />
    </div>
  );
}