"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
} from "chart.js";
import { Line, Bar, Pie, Doughnut, PolarArea } from "react-chartjs-2";

ChartJS.register({
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
});

type ChartType = "line" | "bar" | "pie" | "doughnut" | "polarArea";

interface DynamicChartProps {
  type: ChartType;
  data: any;
  options?: any;
  className? : string
}

const DynamicChart: React.FC<DynamicChartProps> = ({ type, data, options, className }) => {
  const renderChart = () => {
    switch (type) {
      case "line":
        return <Line data={data} options={options} />;
      case "bar":
        return <Bar data={data} options={{ ...options, maintainAspectRatio: false }}  />;
      case "pie":
        return <Pie data={data} options={{ ...options, maintainAspectRatio: false }} className={className}/>;
      case "doughnut":
        return <Doughnut data={data} options={options}/>;
      case "polarArea":
        return <PolarArea data={data} options={options}/>;
      default:
        return null;
    }
  };

  return (
    <div className={` h-[400px] rounded-md m-4 ${className || ''} `}>
      {renderChart()}
    </div>
  );
};

export default DynamicChart;
