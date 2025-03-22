import { useState } from 'react';
import { AlgorithmData } from '../types';
import { ELSContent } from '../components/algorithm-details/ELSContent';
import { TomitaContent } from '../components/algorithm-details/TomitaContent';
import { ChibaNishizekiContent } from '../components/algorithm-details/ChibaNishizekiContent';

interface Props {
  algorithms: AlgorithmData[];
  initialSelected?: string;
}

export function DetailsAndObservations({ algorithms, initialSelected = "" }: Props) {
  const [selectedAlgo, setSelectedAlgo] = useState<string>(
    initialSelected && algorithms.some(a => a.name === initialSelected)
      ? initialSelected
      : algorithms[0].name
  );
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  
  // Helper function to toggle section expansion
  const toggleSection = (sectionKey: string) => {
    setExpandedSections({
      ...expandedSections,
      [sectionKey]: !expandedSections[sectionKey]
    });
  };

  // Function to render the selected algorithm content
  const renderAlgorithmContent = () => {
    switch(selectedAlgo) {
      case 'ELS':
        return <ELSContent expandedSections={expandedSections} toggleSection={toggleSection} />;
      case 'tomita06cliques':
        return <TomitaContent expandedSections={expandedSections} toggleSection={toggleSection} />;
      case 'Chiba-1985-arboricity':
        return <ChibaNishizekiContent expandedSections={expandedSections} toggleSection={toggleSection} />;
      default:
        return <div className="p-6 text-center">Algorithm content not available</div>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center ">
          {algorithms.map((algo) => (
            <button
              key={algo.name}
              onClick={() => setSelectedAlgo(algo.name)}
              className={`px-4 mx-4 py-2 m-1 rounded-md transition-colors ${
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
        {renderAlgorithmContent()}
      </div>
    </div>
  );
}
