import { AlgorithmData } from '../types.ts';

interface Props {
  algorithm: AlgorithmData;
}

export function AlgorithmCard({ algorithm }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{algorithm.name}</h2>
      <p className='text-l text-slate-600 mb-2'>Paper:</p>
    <a 
      href={algorithm.paperUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-indigo-600 mb-4 block transition-all duration-200 hover:text-indigo-800 hover:underline"
      onClick={(e) => {
        if (algorithm.paperUrl) {
        e.preventDefault();
        window.open(algorithm.paperUrl, '_blank', 'noopener,noreferrer');
        }
      }}
    >
      {algorithm.paper}
    </a>
      <p className="text-gray-600 mb-6">{algorithm.description}</p>
      <div className="space-y-3">
        <div className="flex items-center text-gray-700">
          <span>Time Complexity: {algorithm.timeComplexity}</span>
        </div>
      </div>
    </div>
  );
}
