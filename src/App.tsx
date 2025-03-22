import { useState } from 'react';
import { Header } from './components/Header';
import { Overview } from './pages/Overview';
import { Datasets } from './pages/Datasets';
import { Implementation } from './pages/Implementation.tsx';
import { AlgorithmData } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'datasets' | 'implementation'>('overview');

  const algorithms: AlgorithmData[] = [
    {
      name: "Chiba-1985-arboricity",
      nameingraph: "Chiba",
      paper: "ARBORICITY AND SUBGRAPH LISTING ALGORITHMS*",
      paperUrl: "/papers/chiba copy.pdf",  // Replace with actual URL
      description: "Brief description of the first algorithm and its approach to solving the problem.",
      timeComplexity: "O(n log n)",
      results: {
        testCase1: 120,
        testCase2: 250,
        testCase3: 380
      },
      implementation: {
        language: 'cpp',
        filePath: '/code/chiba.cpp'
      }
    },
    {
      name: "tomita06cliques",
      nameingraph: "Tomita",
      paper: "The worst-case time complexity for generating all maximal cliques and computational experiments",
      paperUrl: "/papers/tomita copy.pdf",  // Replace with actual URL
      description: "Brief description of the second algorithm and its approach to solving the problem.",
      timeComplexity: "O(n²)",
      results: {
        testCase1: 150,
        testCase2: 280,
        testCase3: 420
      },
      implementation: {
        language: 'cpp',
        filePath: '/code/tomita.cpp'
      }
    },
    {
      name: "ELS",
      nameingraph: "ELS",
      paper: "Listing All Maximal Cliques in Sparse Graphs in Near-optimal Time",
      paperUrl: "/papers/ELS copy.pdf",  // Replace with actual URL
      description: "The implementation follows the degeneracy-ordered Bron-Kerbosch algorithm proposed in the paper. This algorithm efficiently enumerates maximal cliques in graphs with low degeneracy, achieving a time complexity of O(dn.3^(d/3)), where d is the graph's degeneracy and n the number of vertices.",
      timeComplexity: "O(dn.3^(d/3))",
      results: {
        testCase1: 129385,
        testCase2: 225931,
        testCase3: 350
      },
      implementation: {
        language: 'cpp',
        filePath: '/code/ELS.cpp'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-12">
          {activeTab === 'overview' ? (
            <Overview algorithms={algorithms} />
          ) : activeTab === 'datasets' ? (
            <Datasets />
          ) : (
            <Implementation algorithms={algorithms} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;