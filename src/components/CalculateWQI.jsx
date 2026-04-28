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

export function scoreEC(ec) {
  if (ec < 500) return 100;
  if (ec < 1500) return 70;
  return 40;
}

export function scoreTemp(temp) {
  if (temp >= 20 && temp <= 30) return 100;
  if (temp >= 15 && temp <= 35) return 70;
  return 50;
}

export function scoreTurbidity(turbidity) {
  if (turbidity <= 5) return 100;
  if (turbidity <= 25) return 80;
  if (turbidity <= 100) return 50;
  return 20;                        
}

export function calculateWQIData(sensorData) {
  if (!sensorData) return { level: 4, causes: [] };
  
  const phScore = scorePH(sensorData.ph);
  const tdsScore = scoreTDS(sensorData.tds);
  const ecScore = scoreEC(sensorData.ec);
  const tempScore = scoreTemp(sensorData.temperature);
  const turbScore = scoreTurbidity(sensorData.turbidity);

  const wqi = 
    (0.25 * phScore) + 
    (0.20 * tdsScore) + 
    (0.20 * turbScore) + 
    (0.20 * ecScore) + 
    (0.15 * tempScore);
    
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
      type: phScore <= 50 ? "danger" : "warning", 
      reason: "di luar rentang optimal." 
    });
    
    if (tdsScore < 100) causes.push({ 
      name: "TDS", 
      value: `${sensorData.tds} ppm`, 
      type: tdsScore <= 60 ? "danger" : "warning", 
      reason: "melebihi ambang batas." 
    });

    if (turbScore < 100) causes.push({ 
      name: "Turbidity", 
      value: `${sensorData.turbidity} NTU`, 
      type: turbScore <= 50 ? "danger" : "warning", 
      reason: "air terpantau keruh." 
    });
    
    if (ecScore < 100) causes.push({ 
      name: "EC", 
      value: `${sensorData.ec} µS/cm`, 
      type: ecScore <= 40 ? "danger" : "warning", 
      reason: "meningkat di atas ideal." 
    });
    
    if (tempScore < 100) causes.push({ 
      name: "Suhu", 
      value: `${sensorData.temperature}°C`, 
      type: tempScore <= 50 ? "danger" : "warning", 
      reason: "di luar suhu normal." 
    });
  }

  return { level, causes };
}