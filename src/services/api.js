const BASE_URL = "https://dheaaisyyy.pythonanywhere.com/api"; 

// Ambil data sensor terbaru (1 jam terakhir)
export async function fetchSensorData() {
  const response = await fetch(`${BASE_URL}/sensor-data`);
  if (!response.ok) throw new Error("Gagal mengambil data sensor");
  return response.json();
}

// Ambil prediksi terbaru
export async function fetchPrediction() {
  const response = await fetch(`${BASE_URL}/prediction`);
  if (!response.ok) throw new Error("Gagal mengambil data prediksi");
  return response.json();
}