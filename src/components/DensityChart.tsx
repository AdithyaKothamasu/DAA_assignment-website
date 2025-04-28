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

interface DensityData {
  dataset: string;
  metrics: {
    edges: { exact: number; coreExact: number };
    triangles: { exact: number; coreExact: number };
    fourClique: { exact: number; coreExact: number };
    fiveClique: { exact: number; coreExact: number };
    sixClique: { exact: number; coreExact: number };
  };
}

const densityData: DensityData[] = [
  {
    dataset: "As-733",
    metrics: {
      edges: { exact: 0.5, coreExact: 1 },
      triangles: { exact: 7, coreExact: 3.33333 },
      fourClique: { exact: 5, coreExact: 2.5 },
      fiveClique: { exact: 3, coreExact: 0.2 },
      sixClique: { exact: 0, coreExact: 0 },
    },
  },
  {
    dataset: "As-Caida",
    metrics: {
      edges: { exact: 2, coreExact: 2 },
      triangles: { exact: 4.66667, coreExact: 4.66667 },
      fourClique: { exact: 0.25, coreExact: 0.25 },
      fiveClique: { exact: 0, coreExact: 0 },
      sixClique: { exact: 0, coreExact: 0 },
    },
  },
  {
    dataset: "NetScience",
    metrics: {
      edges: { exact: 9.5, coreExact: 9.5 },
      triangles: { exact: 57, coreExact: 57 },
      fourClique: { exact: 242.25, coreExact: 242.25 },
      fiveClique: { exact: 775.2, coreExact: 775.2 },
      sixClique: { exact: 1938, coreExact: 1938 },
    },
  },
  {
    dataset: "CA-HepTH",
    metrics: {
      edges: { exact: 7.29023, coreExact: 7.31322 },
      triangles: { exact: 155, coreExact: 155 },
      fourClique: { exact: 1123.75, coreExact: 1123.75 },
      fiveClique: { exact: 6293, coreExact: 6293 },
      sixClique: { exact: 28318.5, coreExact: 28318.5 },
    },
  },
{
    dataset: "Yeast",
    metrics: {
      edges: { exact: 0, coreExact: 0.5 },
      triangles: { exact: 0.636364, coreExact: 2.25 },
      fourClique: { exact: 0, coreExact: 2.71429 },
      fiveClique: { exact: 0, coreExact: 1 },
      sixClique: { exact: 0, coreExact: 0.166667 },
    },
  },
];

const metricKeys: (keyof DensityData["metrics"])[] = [
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
];


const datasets = densityData.flatMap((data, index) => {
    const colorPair = datasetColors[index % datasetColors.length];
    return [
        {
            label: `${data.dataset} (Exact)`,
            data: metricKeys.map(key => data.metrics[key].exact),
            backgroundColor: colorPair.exact,
            borderColor: colorPair.exact.replace('0.8', '1'), // Darker border
            borderWidth: 1,
            // stack: `${data.dataset}`, // Remove stack to place bars side-by-side
        },
        {
            label: `${data.dataset} (Core Exact)`,
            data: metricKeys.map(key => data.metrics[key].coreExact),
            backgroundColor: colorPair.coreExact,
            borderColor: colorPair.coreExact.replace('0.4', '1'), // Darker border
            borderWidth: 1,
            // stack: `${data.dataset}`, // Remove stack to place bars side-by-side
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
      text: "Density Comparison: Exact vs Core Exact across Datasets and Clique Sizes",
      font: {
        size: 18,
      }
    },
    legend: {
      position: "top" as const,
    },
    tooltip: {
        callbacks: {
            // Use TooltipItem type from Chart.js
            label: function(context: import('chart.js').TooltipItem<'bar'>) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    // Handle potential zero values before log transform if needed
                    // For display, show the original value
                    label += context.parsed.y.toFixed(3);
                }
                return label;
            }
        }
    },
    datalabels: {
        display: true, // Enable data labels
        anchor: 'end' as const, // Position label at the top of the bar - Use 'as const'
        align: 'top' as const, // Align label to the top - Use 'as const' for type assertion
        offset: -5, // Adjust offset slightly below the top edge
        color: '#555', // Set label color
        font: {
          size: 9, // Use a smaller font size
          weight: 'bold' as const, // Use 'as const' for type assertion
        },
        formatter: (value: number) => {
          if (value === 0) {
            return '0'; // Explicitly show 0
          }
          // Show up to 2 decimal places for non-zero values
          // Use scientific notation for very large or small numbers if needed,
          // but toFixed(2) is likely fine here.
          return value.toFixed(2);
        },
        // Rotate labels to prevent horizontal overlap
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
        text: "Density Value (Log Scale)",
        font: {
          size: 14,
        }
      },
      min: 0.1, // Adjust min to avoid issues with log(0) and show small values
      max: 100000, // Set explicit max to create space for labels
      ticks: {
         font: {
          size: 12,
        },
        // Use callback to format ticks, e.g., show 1, 10, 100, 1000
        // Prefix unused variables with _ and provide type for ticks
        callback: function(value: number | string, _index: number, _ticks: import('chart.js').Tick[]) {
            const numValue = Number(value);
            // Show labels for powers of 10 or specific significant values
            if (numValue === 0.1 || numValue === 1 || numValue === 10 || numValue === 100 || numValue === 1000 || numValue === 10000 || numValue === 100000) {
                return numValue.toString();
            }
            return null; // Hide other labels for clarity
        },
      },
      // Provide type for scaleInstance
      afterBuildTicks: (scaleInstance: import('chart.js').Scale) => {
        // Ensure specific ticks are included if not automatically generated
        const desiredTicks = [0.1, 1, 10, 100, 1000, 10000, 30000];
        // Ensure ticks is compatible with Chart.js Tick definition
        scaleInstance.ticks = desiredTicks.map(value => ({ value, label: value.toString(), major: false }));
      }
    },
  },
  interaction: {
    mode: 'index' as const, // Show tooltips for all datasets on hover over a category
    intersect: false,
  },
};

export function DensityChart() {
  return (
    <div className="w-full p-4 bg-white rounded shadow">
      <div style={{ height: '500px' }}> {/* Set a fixed height for the chart container */}
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}
