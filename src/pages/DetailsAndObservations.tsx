import { useState } from 'react';
import { AlgorithmData } from '../types';
import { DensestSubgraphContent } from '../components/algorithm-details/DensestSubgraphContent'; // Import the remaining component

interface Props {
  algorithms: AlgorithmData[];
  initialSelected?: string;
}

export function DetailsAndObservations({ algorithms, initialSelected = "" }: Props) {
  const [selectedAlgo, setSelectedAlgo] = useState<string>(
    initialSelected && algorithms.some(a => a.name === initialSelected)
      ? initialSelected
      : algorithms[0]?.name || "" // Handle case where algorithms might be empty initially
  );
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  
  // Helper function to toggle section expansion
  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey] // Toggle based on previous state
    }));
  };

  // Function to render the selected algorithm content
  const renderAlgorithmContent = () => {
    switch(selectedAlgo) {
      case 'DensestSubgraph': // Only case remaining
        return <DensestSubgraphContent expandedSections={expandedSections} toggleSection={toggleSection} />;
      default: {
        // Find the algorithm data to display its name if available
        const algoData = algorithms.find(a => a.name === selectedAlgo);
        const displayName = algoData ? algoData.name : 'Selected algorithm';
        return <div className="p-6 text-center">{displayName} content not available or component not mapped.</div>;
      }
    }
  };

  // Find the currently selected algorithm object to display its name
  const currentAlgorithm = algorithms.find(algo => algo.name === selectedAlgo);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center flex-wrap"> {/* Added flex-wrap for smaller screens */}
          {algorithms.map((algo) => (
            <button
              key={algo.name}
              onClick={() => setSelectedAlgo(algo.name)}
              className={`px-4 py-2 m-1 rounded-md transition-colors ${ // Adjusted margin
                selectedAlgo === algo.name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {algo.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
         {/* Display the name of the currently selected algorithm */}
         {currentAlgorithm && (
           <h2 className="text-2xl font-bold mb-4 text-gray-800">{currentAlgorithm.name} Details</h2>
         )}
        {renderAlgorithmContent()}
      </div>
    </div>
  );
}
