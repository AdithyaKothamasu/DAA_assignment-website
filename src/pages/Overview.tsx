import { AlgorithmData } from '../types.ts';
import { AlgorithmCard } from '../components/AlgorithmCard';
import { BarChart } from '../components/BarChart';

interface Props {
  algorithms: AlgorithmData[];
}

export function Overview({ algorithms }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {algorithms.map((algo, index) => (
          <AlgorithmCard key={index} algorithm={algo} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Experimental Observations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((testNum) => (
            <BarChart key={testNum} testNum={testNum} algorithms={algorithms} />
          ))}
        </div>
      </div>
    </>
  );
}
