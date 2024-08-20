// src/components/WeeklyRevenueChart.jsx
import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register the required Chart.js components
Chart.register(...registerables);

const WeeklyRevenueChart = ({ data }) => {
  const chartRef = useRef(null);

  // Chart.js configuration
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Weekly Revenue',
        data: data.values,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Revenue: $${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days of the Week',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Revenue ($)',
        },
      },
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.chartInstance?.destroy();
    }
  }, [data]);

  return (
    <div>
      <h2>Weekly Revenue Chart</h2>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default WeeklyRevenueChart;
