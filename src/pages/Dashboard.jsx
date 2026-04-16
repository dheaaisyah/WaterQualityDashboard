import Header from "../components/Header";
import SensorCard from "../components/SensorCard";
import PredictionCard from "../components/PredictionCard";
import ChartSection from "../components/ChartSection";
import DataTable from "../components/DataTable";
import { useSensorData } from "../hooks/useSensorData";

export default function Dashboard() {
  
  // const { sensorData, prediction, loading, error } = useSensorData();

  // if (loading) return <div className="p-10">Memuat data...</div>;
  // if (error) return <div className="p-10 text-red-500">Error: {error}</div>;

  // const latest = sensorData[0] ?? {};

  return (
    <div className="bg-white p-4 font-manrope">
      <Header />

     <div className="mt-4 flex flex-col px-10">
        <h1 className="text-xl font-bold text-gray-800">
          Dashboard Monitoring System
        </h1>
        <span className="text-gray-800 mt-1 font-regular">
          A monitoring dashboard that presents integrated real-time system observation data to assist in analysis, monitoring, and evaluation processes.
        </span>
      </div>

      <div className="px-10 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="grid grid-cols-2 gap-3">
            <SensorCard title="Temperature" value="25.2" unit="°C" color="temperature" status="Moderate" icon="/temp1.svg"/>
            <SensorCard title="Acidity" value="7.3" unit="" color="acidity" status="Normal" icon="/acid1.svg" />
            <SensorCard title="TDS" value="350" unit="ppm" color="tds" status="High" icon="/tds1.svg" />
            <SensorCard title="Turbidity" value="5.6" unit="NTU" color="turbidity" status="Moderate" icon="/turbidity1.svg" />
          </div>
          <div className="col-span bg-white border rounded-xl p-6">
            <ChartSection />
          </div>
        </div>
      </div>

      <div className="flex flex-col px-10">
        <div className="grid grid-cols-4 gap-3 mt-4">
          <PredictionCard title="Temperature Prediction" value="26.5" unit="°C" status="Normal" icon="/temp2.svg"/>
            <PredictionCard title="Acidity Prediction" value="7.1" unit="" status="Moderate" icon="/acid2.svg" />
            <PredictionCard title="TDS Prediction" value="360" unit="ppm" status="High" icon="/tds2.svg" />
            <PredictionCard title="Turbidity Prediction" value="5.0" unit="NTU" status="Normal" icon="/turbidity2.svg" />
        </div>
      </div>

      <div className="px-10 mt-4">
        <DataTable />
      </div>

      <div className="mt-10 text-center text-gray-400">
        <span>© 2026 Dhea Aisyah Putri. All rights reserved</span>
      </div>




    </div>
  );
}