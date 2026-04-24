import Header from "../components/Header";
import WaterQualityIndex from "../components/WaterQualityIndex";
import Data from "../components/Data";
import ChatBot from "../components/chatbot";
import { useSensorData } from "../hooks/useSensorData";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-6 font-sans">
      <Header />
      <Data />
      <ChatBot /> 




    </div>
  );
}