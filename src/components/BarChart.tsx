import { AlgorithmData } from '../types.ts';

interface Props {
  testNum: number;
  algorithms: AlgorithmData[];
}

export function BarChart({ testNum, algorithms }: Props) {
  const testCaseKey = `testCase${testNum}` as keyof typeof algorithms[0]['results'];
  const values = algorithms.map(algo => algo.results[testCaseKey]);
  const maxValue = Math.max(...values);

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Test Case {testNum}</h3>
      <div className="flex justify-around h-64 mb-6 px-4 mt-4">
        {algorithms.map((algo) => {
          const value = algo.results[testCaseKey];
          const heightPercentage = Math.round((value / maxValue) * 100);

          return (
            <div key={algo.name} className="flex flex-col items-center w-20">
              <div className="relative w-full h-64">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-indigo-600 hover:bg-indigo-700 rounded-t transition-all duration-300"
                  style={{ height: `${heightPercentage}%` }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-gray-700 text-xs font-medium whitespace-nowrap">
                    {value}ms
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 text-center">
                <div className="font-small truncate">{algo.nameingraph}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
