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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {algorithms.map((algo, index) => (
          <AlgorithmCard 
            key={index} 
            algorithm={algo} 
            onNavigate={handleNavigate}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Execution Times Histogram</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((testNum) => (
            <BarChartJS key={testNum} testNum={testNum} algorithms={algorithms} />
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Clique Size Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CliqueHistogram 
            outputFile="/code/ELS outputs/WikiVote output ELS.txt" 
            title="WikiVote Dataset - Clique Size Distribution" 
          />
          <CliqueHistogram 
            outputFile="/code/ELS outputs/Email-Enron output ELS.txt" 
            title="Email-Enron Dataset - Clique Size Distribution" 
          />
        </div>
      </div>
    </>
  );
}
