import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const colors = {
  temperature: "#668E73",
  acidity: "#FFBB03",
  tds: "#6796D0",
  turbidity: "#975FA1",
};

const dataSets = {
  temperature: [
    { time: "10.02", value: 24 }, { time: "10.04", value: 26 }, { time: "10.06", value: 25 },
    { time: "10.08", value: 27 }, { time: "10.10", value: 26 }, { time: "10.12", value: 28 },
    { time: "10.14", value: 29 }, { time: "10.16", value: 27 }, { time: "10.18", value: 26 },
    { time: "10.20", value: 25 }, { time: "10.22", value: 24 }, { time: "10.24", value: 26 },
    { time: "10.26", value: 27 }, { time: "10.28", value: 28 }, { time: "10.30", value: 29 },
    { time: "10.32", value: 27 }, { time: "10.34", value: 26 }, { time: "10.36", value: 25 },
    { time: "10.38", value: 24 }, { time: "10.40", value: 26 }, { time: "10.42", value: 27 },
    { time: "10.44", value: 28 }, { time: "10.46", value: 29 }, { time: "10.48", value: 27 },
    { time: "10.50", value: 26 }, { time: "10.52", value: 25 }, { time: "10.54", value: 24 },
    { time: "10.56", value: 26 }, { time: "10.58", value: 27 }, { time: "11.00", value: 28 }
  ],

  acidity: [
    { time: "10.02", value: 7.2 }, { time: "10.04", value: 7.3 }, { time: "10.06", value: 7.1 },
    { time: "10.08", value: 7.4 }, { time: "10.10", value: 7.2 }, { time: "10.12", value: 7.3 },
    { time: "10.14", value: 7.5 }, { time: "10.16", value: 7.2 }, { time: "10.18", value: 7.3 },
    { time: "10.20", value: 7.1 }, { time: "10.22", value: 7.2 }, { time: "10.24", value: 7.3 },
    { time: "10.26", value: 7.4 }, { time: "10.28", value: 7.2 }, { time: "10.30", value: 7.1 },
    { time: "10.32", value: 7.3 }, { time: "10.34", value: 7.4 }, { time: "10.36", value: 7.5 },
    { time: "10.38", value: 7.3 }, { time: "10.40", value: 7.2 }, { time: "10.42", value: 7.1 },
    { time: "10.44", value: 7.2 }, { time: "10.46", value: 7.3 }, { time: "10.48", value: 7.4 },
    { time: "10.50", value: 7.2 }, { time: "10.52", value: 7.1 }, { time: "10.54", value: 7.3 },
    { time: "10.56", value: 7.4 }, { time: "10.58", value: 7.2 }, { time: "11.00", value: 7.3 }
  ],

  tds: [
    { time: "10.02", value: 320 }, { time: "10.04", value: 340 }, { time: "10.06", value: 330 },
    { time: "10.08", value: 350 }, { time: "10.10", value: 345 }, { time: "10.12", value: 360 },
    { time: "10.14", value: 370 }, { time: "10.16", value: 355 }, { time: "10.18", value: 340 },
    { time: "10.20", value: 335 }, { time: "10.22", value: 345 }, { time: "10.24", value: 350 },
    { time: "10.26", value: 360 }, { time: "10.28", value: 355 }, { time: "10.30", value: 340 },
    { time: "10.32", value: 330 }, { time: "10.34", value: 345 }, { time: "10.36", value: 360 },
    { time: "10.38", value: 370 }, { time: "10.40", value: 355 }, { time: "10.42", value: 340 },
    { time: "10.44", value: 335 }, { time: "10.46", value: 345 }, { time: "10.48", value: 350 },
    { time: "10.50", value: 360 }, { time: "10.52", value: 355 }, { time: "10.54", value: 340 },
    { time: "10.56", value: 330 }, { time: "10.58", value: 345 }, { time: "11.00", value: 355 }
  ],

  turbidity: [
    { time: "10.02", value: 5 }, { time: "10.04", value: 6 }, { time: "10.06", value: 5 },
    { time: "10.08", value: 7 }, { time: "10.10", value: 6 }, { time: "10.12", value: 8 },
    { time: "10.14", value: 7 }, { time: "10.16", value: 6 }, { time: "10.18", value: 5 },
    { time: "10.20", value: 6 }, { time: "10.22", value: 7 }, { time: "10.24", value: 6 },
    { time: "10.26", value: 5 }, { time: "10.28", value: 6 }, { time: "10.30", value: 7 },
    { time: "10.32", value: 8 }, { time: "10.34", value: 7 }, { time: "10.36", value: 6 },
    { time: "10.38", value: 5 }, { time: "10.40", value: 6 }, { time: "10.42", value: 7 },
    { time: "10.44", value: 6 }, { time: "10.46", value: 5 }, { time: "10.48", value: 6 },
    { time: "10.50", value: 7 }, { time: "10.52", value: 8 }, { time: "10.54", value: 7 },
    { time: "10.56", value: 6 }, { time: "10.58", value: 5 }, { time: "11.00", value: 6 }
  ]
};

export default function ChartSection() {

  const [sensor, setSensor] = useState("temperature");

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-200">
        <span className="font-semibold mb-2">Real-Time System Trends</span>

        <select
          className="border rounded px-2 py-1 mb-2"
          value={sensor}
          onChange={(e) => setSensor(e.target.value)}>
          <option value="temperature">Temperature</option>
          <option value="acidity">pH</option>
          <option value="tds">TDS</option>
          <option value="turbidity">Turbidity</option>
        </select>
      </div>

      <div className="h-[220px] mt-3 font-semibold">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dataSets[sensor]}
            margin={{ top: 20, right: 20, left: -25, bottom: -10 }}
          >
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              fill={colors[sensor]}
              radius={[4,4,0,0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}