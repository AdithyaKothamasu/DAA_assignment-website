import { AlgorithmData } from '../types.ts';

interface Props {
  algorithm: AlgorithmData;
  onNavigate: (page: 'details' | 'implementation', algorithmName: string) => void;
}

export function AlgorithmCard({ algorithm, onNavigate }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-3">{algorithm.name}</h2>
      
      <div className="mb-4">
        <p className='text-sm font-medium text-slate-600 mb-1'>Paper:</p>
        <a 
          href={algorithm.paperUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 mb-3 block transition-all duration-200 hover:text-indigo-800 hover:underline"
          onClick={(e) => {
            if (algorithm.paperUrl) {
              e.preventDefault();
              window.open(algorithm.paperUrl, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          {algorithm.paper}
        </a>
      </div>
      
      <div className="flex space-x-3 mt-8"> {/* Increased top margin */}
        {/* <button 
          onClick={() => onNavigate('details', algorithm.name)}
          className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
        >
        Details
        </button> */}
        <button 
          onClick={() => onNavigate('implementation', algorithm.name)}
          className="flex-1 bg-emerald-600 text-white py-2 px-3 rounded-md hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium"
        >
          Implementation
        </button>
      </div>
    </div>
  );
}
