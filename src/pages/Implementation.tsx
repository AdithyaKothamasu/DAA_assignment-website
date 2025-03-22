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
}

export function Implementation({ algorithms }: Props) {
  const [selectedAlgo, setSelectedAlgo] = useState<string>(algorithms[0].name);
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
    "Chiba-1985-arboricity": `// Sample implementation of Chiba algorithm
#include <vector>
#include <set>
#include <iostream>

void findCliques(const std::vector<std::set<int>>& graph) {
    // Implementation of the Chiba arboricity-based algorithm
    // for maximal clique enumeration
    // ...
}`,
    "tomita06cliques": `// Sample implementation of Tomita algorithm
#include <vector>
#include <set>
#include <algorithm>

void bronKerbosch(std::set<int> R, std::set<int> P, std::set<int> X,
                 const std::vector<std::set<int>>& graph) {
    if (P.empty() && X.empty()) {
        // Report maximum clique R
        return;
    }
    // Choose pivot
    // ...
}`,
    "ELS": `// Sample implementation of ELS algorithm
#include <vector>
#include <set>
#include <algorithm>

void findCliquesELS(const std::vector<std::set<int>>& graph) {
    // ELS algorithm implementation for maximal clique enumeration
    // ...
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
