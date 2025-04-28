import { useState, useEffect } from 'react';
import { AlgorithmData } from '../types';
import { loadCodeFile } from '../utils/fileLoader';
// Import Prism when the component mounts (client-side only)
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import tomorrow from 'react-syntax-highlighter/dist/esm/styles/prism/tomorrow';

// Register language
SyntaxHighlighter.registerLanguage('cpp', cpp);

interface Props {
  algorithms: AlgorithmData[];
  initialSelected?: string;
}

export function Implementation({ algorithms, initialSelected = "" }: Props) {
  const [selectedAlgo, setSelectedAlgo] = useState<string>(
    initialSelected && algorithms.some(a => a.name === initialSelected)
      ? initialSelected
      : algorithms[0].name
  );
  const [codeContent, setCodeContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadAllCode = async () => {
      setLoading(true);
      const newCodeContent: Record<string, string> = {};
      const newErrors: Record<string, boolean> = {};
      
      for (const algo of algorithms) {
        try {
          const code = await loadCodeFile(algo.implementation.filePath);
          newCodeContent[algo.name] = code;
        } catch (error: unknown) {
          console.error(`Error loading ${algo.name} code:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          newCodeContent[algo.name] = `// Failed to load code for ${algo.name}\n// Error: ${errorMessage}`;
          newErrors[algo.name] = true;
        }
      }
      
      setCodeContent(newCodeContent);
      setErrors(newErrors);
      setLoading(false);
    };

    loadAllCode();
  }, [algorithms]);

  const selectedAlgorithm = algorithms.find(algo => algo.name === selectedAlgo);

  // Fallback code samples in case file loading fails
  const fallbackCode: Record<string, string> = {
    "DensestSubgraph": `// Sample implementation for Densest Subgraph (h-Clique)
#include <vector>
#include <iostream>
#include <numeric>

// Placeholder for the complex flow network and binary search logic
std::vector<int> findDensestSubgraph(int h) {
    std::cout << "Finding densest subgraph with h=" << h << std::endl;
    // ... implementation using max-flow/min-cut ...
    return {};
}`
  };

 return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center">
          {algorithms.map((algo) => (
            <button
              key={algo.name}
              onClick={() => setSelectedAlgo(algo.name)}
              className={`px-4 py-2 mx-4 rounded-md transition-colors ${
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

      {selectedAlgorithm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedAlgorithm.name}
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">
                Language: {selectedAlgorithm.implementation.language}
              </span>
              <span className="text-xs text-gray-400">
                File: {selectedAlgorithm.implementation.filePath}
              </span>
            </div>
            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <p>Loading code...</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px] rounded-lg">
                <SyntaxHighlighter 
                  language="cpp" 
                  style={tomorrow}
                  wrapLines={true}
                  showLineNumbers={true}
                  customStyle={{
                    borderRadius: '0.5rem',
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                >
                  {errors[selectedAlgorithm.name] 
                    ? fallbackCode[selectedAlgorithm.name] || codeContent[selectedAlgorithm.name]
                    : codeContent[selectedAlgorithm.name] || fallbackCode[selectedAlgorithm.name]}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
