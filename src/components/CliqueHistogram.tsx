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
}

export function CliqueHistogram({ outputFile, title }: Props) {
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
      <div className="flex justify-center items-center h-[400px] bg-white rounded-lg shadow p-4">
        <p>Loading histogram data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-white rounded-lg shadow p-4">
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
      },
    ],
  };

  const chartOptions = {
    responsive: true,
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
        },
      },
      x: {
        title: {
          display: true,
          text: 'Clique Size',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[400px]">
      <div className="text-sm text-gray-500 mb-2">
        Total Cliques: {data.totalCliques.toLocaleString()} | 
        Largest Clique Size: {data.largestCliqueSize}
      </div>
      <div className="h-[320px]">
        <Bar 
          data={chartData} 
          options={chartOptions}
        />
      </div>
    </div>
  );
}
