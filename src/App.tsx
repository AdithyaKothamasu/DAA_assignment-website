import { useState } from 'react';
import { Header } from './components/Header';
import { Overview } from './pages/Overview';
import { Datasets } from './pages/Datasets';
import { Implementation } from './pages/Implementation.tsx';
import { DetailsAndObservations } from './pages/DetailsAndObservations';
import { AlgorithmData } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'datasets' | 'implementation' | 'details'>('overview');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("");

  const algorithms: AlgorithmData[] = [
    {
      name: "Chiba-1985-arboricity",
      nameingraph: "Chiba",
      paper: "Arboricity And Subgraph Listing Algorithms by Norishige Chiba and Takao Nishizeki",
      paperUrl: `${import.meta.env.BASE_URL}papers/chiba copy.pdf`,
      timeComplexity: "O(n log n)",
      results: {
        testCase1: 120,
        testCase2: 250,
        testCase3: 380
      },
      implementation: {
        language: 'cpp',
        filePath: `${import.meta.env.BASE_URL}code/chiba.cpp`
      }
    },
    {
      name: "tomita06cliques",
      nameingraph: "Tomita",
      paper: "The worst-case time complexity for generating all maximal cliques and computational experiments",
      paperUrl: `${import.meta.env.BASE_URL}papers/tomita copy.pdf`,
      timeComplexity: "O(3^(n/3))",
      results: {
        testCase1: 2557,
        testCase2: 4957,
        testCase3: 14520257
      },
      implementation: {
        language: 'cpp',
        filePath: `${import.meta.env.BASE_URL}code/Tomita.cpp`
      }
    },
    {
      name: "ELS",
      nameingraph: "ELS",
      paper: "Listing All Maximal Cliques in Sparse Graphs in Near-optimal Time",
      paperUrl: `${import.meta.env.BASE_URL}papers/ELS copy.pdf`,
      timeComplexity: "O(dn.3^(d/3))",
      results: {
        testCase1: 3259,
        testCase2: 4657,
        testCase3: 1.33532e+07
      },
      implementation: {
        language: 'cpp',
        filePath: `${import.meta.env.BASE_URL}code/ELS.cpp`
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-8xl mx-auto px-10 py-8">
        <div className="space-y-12">
          {activeTab === 'overview' ? (
            <Overview 
              algorithms={algorithms} 
              onTabChange={setActiveTab}
              setSelectedAlgorithm={setSelectedAlgorithm}
            />
          ) : activeTab === 'datasets' ? (
            <Datasets />
          ) : activeTab === 'implementation' ? (
            <Implementation 
              algorithms={algorithms} 
              initialSelected={selectedAlgorithm}
            />
          ) : (
            <DetailsAndObservations 
              algorithms={algorithms}
              initialSelected={selectedAlgorithm}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;