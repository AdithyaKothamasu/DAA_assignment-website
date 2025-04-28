import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface ExecutionTimeData {
  dataset: string;
  metrics: {
    edges: { exact: number; coreExact: number };
    triangles: { exact: number; coreExact: number };
    fourClique: { exact: number; coreExact: number };
    fiveClique: { exact: number; coreExact: number };
    sixClique: { exact: number; coreExact: number };
  };
}

// Data provided by the user
const executionTimeData: ExecutionTimeData[] = [
  {
    dataset: "As-733",
    metrics: {
      edges: { exact: 0.108505, coreExact: 0.0172293 },
      triangles: { exact: 0.161009, coreExact: 0.0230673 },
      fourClique: { exact: 0.195171, coreExact: 0.0217878 },
      fiveClique: { exact: 0.230951, coreExact: 0.0208934 },
      sixClique: { exact: 0.256636, coreExact: 0.01411 },
    },
  },
  {
    dataset: "As-Caida",
    metrics: {
      edges: { exact: 11.5292, coreExact: 0.70964 },
      triangles: { exact: 29.4891, coreExact: 0.648696 },
      fourClique: { exact: 29.7509, coreExact: 0.73 },
      fiveClique: { exact: 43.7922, coreExact: 1.24737 },
      sixClique: { exact: 65.3595, coreExact: 1.93756 },
    },
  },
  {
    dataset: "NetScience",
    metrics: {
      edges: { exact: 0.083931, coreExact: 0.0153445 },
      triangles: { exact: 0.130733, coreExact: 0.0298912 },
      fourClique: { exact: 0.270155, coreExact: 0.0613352 },
      fiveClique: { exact: 0.469823, coreExact: 0.155448 },
      sixClique: { exact: 1.35155, coreExact: 0.460086 },
    },
  },
  {
    dataset: "CA-HepTH",
    metrics: {
      edges: { exact: 1.91762, coreExact: 0.176854 },
      triangles: { exact: 5.60966, coreExact: 0.304187 },
      fourClique: { exact: 8.2996, coreExact: 0.613626 },
      fiveClique: { exact: 20.6467, coreExact: 2.55357 },
      sixClique: { exact: 85.3097, coreExact: 12.3521 },
    },
  },
  {
    dataset: "Yeast",
    metrics: {
      edges: { exact: 0.0486444, coreExact: 0.0348889 },
      triangles: { exact: 0.091634, coreExact: 0.0214371 },
      fourClique: { exact: 0.043433, coreExact: 0.006371 },
      fiveClique: { exact: 0.043312, coreExact: 0.0082984 },
      sixClique: { exact: 0.035895, coreExact: 0.0085693 },
    },
  },
];

const metricKeys: (keyof ExecutionTimeData["metrics"])[] = [
  "edges",
  "triangles",
  "fourClique",
  "fiveClique",
  "sixClique",
];
const metricLabels = {
  edges: "Edge",
  triangles: "Triangle",
  fourClique: "4-Clique",
  fiveClique: "5-Clique",
  sixClique: "6-Clique",
};

const labels = metricKeys.map((key) => metricLabels[key]);

// Define distinct colors for datasets and types (Exact vs CoreExact)
const datasetColors = [
  { exact: 'rgba(54, 162, 235, 0.8)', coreExact: 'rgba(54, 162, 235, 0.4)' }, // Blue tones
  { exact: 'rgba(255, 99, 132, 0.8)', coreExact: 'rgba(255, 99, 132, 0.4)' }, // Red tones
  { exact: 'rgba(75, 192, 192, 0.8)', coreExact: 'rgba(75, 192, 192, 0.4)' }, // Green tones
  { exact: 'rgba(255, 206, 86, 0.8)', coreExact: 'rgba(255, 206, 86, 0.4)' }, // Yellow tones
  { exact: 'rgba(153, 102, 255, 0.8)', coreExact: 'rgba(153, 102, 255, 0.4)' }, // Purple tones
];


const datasets = executionTimeData.flatMap((data, index) => {
    const colorPair = datasetColors[index % datasetColors.length];
    return [
        {
            label: `${data.dataset} (Exact Time)`,
            data: metricKeys.map(key => data.metrics[key].exact),
            backgroundColor: colorPair.exact,
            borderColor: colorPair.exact.replace('0.8', '1'), // Darker border
            borderWidth: 1,
        },
        {
            label: `${data.dataset} (Core Exact Time)`,
            data: metricKeys.map(key => data.metrics[key].coreExact),
            backgroundColor: colorPair.coreExact,
            borderColor: colorPair.coreExact.replace('0.4', '1'), // Darker border
            borderWidth: 1,
        }
    ];
});


const chartData = {
  labels,
  datasets,
};

const options = {
  plugins: {
    title: {
      display: true,
      text: "Execution Time Comparison: Exact vs Core Exact across Datasets and Clique Sizes",
      font: {
        size: 18,
      }
    },
    legend: {
      position: "top" as const,
    },
    tooltip: {
        callbacks: {
            label: function(context: import('chart.js').TooltipItem<'bar'>) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += context.parsed.y.toFixed(5); // Show more precision for time
                }
                return label;
            }
        }
    },
    datalabels: {
        display: true,
        anchor: 'end' as const,
        align: 'top' as const,
        offset: -5,
        color: '#555',
        font: {
          size: 9,
          weight: 'bold' as const,
        },
        formatter: (value: number) => {
          if (value === 0) return '0';
          // Adjust precision for time values
          if (value < 0.01) return value.toExponential(1);
          return value.toFixed(2);
        },
        rotation: -45,
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: "Clique Type",
        font: {
          size: 14,
        }
      },
      ticks: {
        font: {
          size: 12,
        }
      }
    },
    y: {
      type: "logarithmic" as const,
      title: {
        display: true,
        text: "Execution Time (seconds, Log Scale)", // Updated axis label
        font: {
          size: 14,
        }
      },
      min: 0.001, // Adjust min for time scale
      max: 1000, // Adjust max for time scale
      ticks: {
         font: {
          size: 12,
        },
        callback: function(value: number | string, _index: number, _ticks: import('chart.js').Tick[]) {
            const numValue = Number(value);
            // Adjust labels for time scale
            if ([0.001, 0.01, 0.1, 1, 10, 100, 1000].includes(numValue)) {
                return numValue.toString();
            }
            return null;
        },
      },
      afterBuildTicks: (scaleInstance: import('chart.js').Scale) => {
        const desiredTicks = [0.001, 0.01, 0.1, 1, 10, 100, 1000];
        scaleInstance.ticks = desiredTicks.map(value => ({ value, label: value.toString(), major: false }));
      }
    },
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
};

export function ExecutionTimeChart() {
  return (
    <div className="w-full p-4 bg-white rounded shadow">
      <div style={{ height: '500px' }}> {/* Set a fixed height */}
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}