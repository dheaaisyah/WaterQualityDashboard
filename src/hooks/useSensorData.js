import { useState, useEffect } from "react";
import { fetchSensorData, fetchPrediction } from "../services/api";

export function useSensorData(intervalMs = 120000) { 
  const [sensorData, setSensorData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const [data, pred] = await Promise.all([
        fetchSensorData(),
        fetchPrediction(),
      ]);
      setSensorData(data);
      setPrediction(pred);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, intervalMs);
    return () => clearInterval(interval);
  }, []);

  return { sensorData, prediction, loading, error };
}