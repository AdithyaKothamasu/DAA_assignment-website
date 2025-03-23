import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AlgorithmData } from '../types.ts';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  // Legend
);

interface Props {
  testNum: number;
  datasetName: string;
  algorithms: AlgorithmData[];
}

export function BarChartJS({ testNum, datasetName, algorithms }: Props) {
  const testCaseKey = `testCase${testNum}` as keyof typeof algorithms[0]['results'];
  const values = algorithms.map(algo => algo.results[testCaseKey]);
  
  const chartData = {
    labels: algorithms.map(algo => algo.nameingraph),
    datasets: [
      {
        label: `Execution Time (ms)`,
        data: values,
        backgroundColor: algorithms.map((_, index) => {
          const colors = [
            'rgba(99, 102, 241, 0.7)',  // Indigo
            'rgba(59, 130, 246, 0.7)',  // Blue
            'rgba(16, 185, 129, 0.7)'   // Green
          ];
          return colors[index % colors.length];
        }),
        borderColor: algorithms.map((_, index) => {
          const colors = [
            'rgb(79, 82, 221)',  // Indigo
            'rgb(39, 110, 226)',  // Blue
            'rgb(6, 165, 109)'   // Green
          ];
          return colors[index % colors.length];
        }),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${datasetName} Dataset`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw.toLocaleString()} ms`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Execution Time (ms)',
          font: {
            weight: 'bold' as const,
          }
        },
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString();
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Algorithm',
          font: {
            weight: 'bold' as const,
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[400px]">
      <Bar 
        data={chartData} 
        options={chartOptions}
      />
    </div>
  );
}
