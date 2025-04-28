import { AlgorithmData } from '../types.ts';
import { AlgorithmCard } from '../components/AlgorithmCard';
import { DensityChart } from '../components/DensityChart'; // Import DensityChart
import { ExecutionTimeChart } from '../components/ExecutionTimeChart'; // Import ExecutionTimeChart

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

      {/* Add Density Chart Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Dataset Density Comparison</h2>
        <DensityChart />
      </div>

      {/* Add Execution Time Chart Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Dataset Execution Time Comparison</h2>
        <ExecutionTimeChart />
      </div>
      
    </>
  );
}
