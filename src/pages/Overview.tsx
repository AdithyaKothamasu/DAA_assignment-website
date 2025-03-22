import { AlgorithmData } from '../types.ts';
import { AlgorithmCard } from '../components/AlgorithmCard';
import { BarChartJS } from '../components/BarChartJS';
import { CliqueHistogram } from '../components/CliqueHistogram';

interface Props {
  algorithms: AlgorithmData[];
  onTabChange: (tab: 'overview' | 'datasets' | 'implementation' | 'details') => void;
  setSelectedAlgorithm: (name: string) => void;
}

export function Overview({ algorithms, onTabChange, setSelectedAlgorithm }: Props) {
  const handleNavigate = (page: 'details' | 'implementation', algorithmName: string) => {
    setSelectedAlgorithm(algorithmName);
    onTabChange(page);
  };

  const datasets = [
    { id: 1, name: "WikiVote" },
    { id: 2, name: "Email-Enron" },
    { id: 3, name: "Skitter" }
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Algorithms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {algorithms.map((algo, index) => (
            <AlgorithmCard 
              key={index} 
              algorithm={algo} 
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Execution Times Histogram</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {datasets.map((dataset) => (
            <BarChartJS 
              key={dataset.id} 
              testNum={dataset.id} 
              datasetName={dataset.name}
              algorithms={algorithms} 
            />
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Clique Size Distribution</h2>
        
        {/* WikiVote Dataset Histogram */}
        <div className="mb-12">
          <h3 className="text-lg font-medium text-gray-800 mb-4">WikiVote Dataset</h3>
          <div className="h-[500px]">
            <CliqueHistogram 
              outputFile="/code/WikiVote output ELS.txt" 
              title="WikiVote Dataset - Clique Size Distribution" 
              height={500}
            />
          </div>
        </div>
        
        {/* Email-Enron Dataset Histogram */}
        <div className="mb-12">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Email-Enron Dataset</h3>
          <div className="h-[500px]">
            <CliqueHistogram 
              outputFile="/code/Email-Enron output ELS.txt" 
              title="Email-Enron Dataset - Clique Size Distribution" 
              height={500}
            />
          </div>
        </div>
        
        {/* Skitter Dataset Histogram */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Skitter Dataset</h3>
          <div className="h-[500px]">
            <CliqueHistogram 
              outputFile="/code/skitter output els.txt" 
              title="Skitter Dataset - Clique Size Distribution" 
              height={500}
            />
          </div>
        </div>
      </div>
    </>
  );
}
