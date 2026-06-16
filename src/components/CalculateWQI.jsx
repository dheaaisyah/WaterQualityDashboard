export function scorePH(ph) {
  if (ph >= 6.5 && ph <= 8.5) return 100;
  if (ph >= 6.0 && ph <= 9.0) return 80;
  if (ph >= 5.5 && ph <= 9.5) return 50;
  return 20;
}

export function scoreTDS(tds) {
  if (tds < 300) return 100;
  if (tds < 600) return 80;
  if (tds < 1000) return 60;
  return 30;
}

export function scoreTemp(temp) {
  if (temp >= 20 && temp <= 30) return 100;
  if (temp >= 15 && temp <= 35) return 70;
  return 50;
}

export function scoreTurbidity(turbidity) {
  if (turbidity <= 5.0) return 100;
  if (turbidity <= 25.0) return 80;
  if (turbidity <= 100.0) return 50;
  return 20;
}

export function calculateWQIData(sensorData) {
  if (!sensorData) return { level: 4, causes: [] };

  const phScore   = scorePH(sensorData.ph);
  const tdsScore  = scoreTDS(sensorData.tds);
  const tempScore = scoreTemp(sensorData.temperature);
  const turbScore = scoreTurbidity(sensorData.turbidity);

  // Bobot NSF-WQI Termodifikasi
  const wqi =
    (0.306 * phScore) +
    (0.194 * tdsScore) +
    (0.278 * tempScore) +
    (0.222 * turbScore);

  const roundedWqi = Math.round(wqi);

  // Klasifikasi berdasarkan Tabel
  let level;
  if (roundedWqi >= 90)      level = 1; // Sangat Baik (Excellent)
  else if (roundedWqi >= 70) level = 2; // Baik (Good)
  else if (roundedWqi >= 50) level = 3; // Sedang (Medium)
  else if (roundedWqi >= 25) level = 4; // Buruk (Poor)
  else                       level = 5; // Sangat Buruk (Very Poor)

  const causes = [];

  if (level !== 1) {
    if (phScore < 100)   causes.push({ name: "pH",       value: sensorData.ph,                       type: phScore   <= 50 ? "danger" : "warning", reason: "di luar rentang optimal." });
    if (tdsScore < 100)  causes.push({ name: "TDS",      value: `${sensorData.tds} ppm`,              type: tdsScore  <= 60 ? "danger" : "warning", reason: "melebihi ambang batas." });
    if (tempScore < 100) causes.push({ name: "Suhu",     value: `${sensorData.temperature}°C`,        type: tempScore <= 50 ? "danger" : "warning", reason: "di luar suhu normal." });
    if (turbScore < 100) causes.push({ name: "Turbidity",value: `${sensorData.turbidity.toFixed(1)} NTU`, type: turbScore <= 50 ? "danger" : "warning", reason: "air terpantau keruh." });
  }

  return { level, causes };
}