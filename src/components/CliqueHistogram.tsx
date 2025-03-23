import { useEffect, useState } from 'react';
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
import { parseELSOutput, ParsedELSOutput } from '../utils/parseCliqueData';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  outputFile: string;
  title: string;
  height?: number;
}

export function CliqueHistogram({ outputFile, title, height = 400 }: Props) {
  const [data, setData] = useState<ParsedELSOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const parsedData = await parseELSOutput(outputFile);
        setData(parsedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load clique distribution data');
        setLoading(false);
        console.error('Error loading clique data:', err);
      }
    };

    fetchData();
  }, [outputFile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-white rounded-lg shadow p-4" style={{ height: `${height}px` }}>
        <p>Loading histogram data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center bg-white rounded-lg shadow p-4" style={{ height: `${height}px` }}>
        <p className="text-red-500">{error || 'Could not load histogram data'}</p>
      </div>
    );
  }

  const chartData = {
    labels: data.distribution.map(item => item.cliqueSize.toString()),
    datasets: [
      {
        label: 'Number of Cliques',
        data: data.distribution.map(item => item.count),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
        borderRadius: 0,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
        barThickness: 'flex'
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Count: ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Cliques',
          font: {
            weight: 'bold' as const
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
          text: 'Clique Size',
          font: {
            weight: 'bold' as const
          }
        },
        barPercentage: 1.0,
        categoryPercentage: 1.0
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4" style={{ height: `${height}px` }}>
      <div className="text-sm text-gray-500 mb-2">
        <strong>Total Cliques:</strong> {data.totalCliques.toLocaleString()} | 
        <strong> Largest Clique Size:</strong> {data.largestCliqueSize}
      </div>
      <div style={{ height: `${height - 40}px` }}>
        <Bar 
          data={chartData} 
          options={chartOptions}
        />
      </div>
    </div>
  );
}
