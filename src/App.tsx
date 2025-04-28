import { useState } from "react";
import { Header } from "./components/Header";
import { Overview } from "./pages/Overview";
import { Datasets } from "./pages/Datasets";
import { Implementation } from "./pages/Implementation.tsx";
import { AlgorithmData } from "./types";

import { DetailsAndObservations } from "./pages/DetailsAndObservations"; // Import the component

function App() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "datasets" | "implementation" | "details"
  >("overview");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("");

  const algorithms: AlgorithmData[] = [
    {
      name: "Exact Algorithm",
      nameingraph: "Densest Subgraph (h-Clique)", // Or a shorter name if preferred
      paper: "Efficient Algorithms for Densest Subgraph Discovery", // Placeholder paper title
      paperUrl: "public/papers/efficient algo copy.pdf",
      results: {
        // Placeholder results
        testCase1: 0,
        testCase2: 0,
        testCase3: 0,
      },
      implementation: {
        language: "cpp",
        filePath: `${import.meta.env.BASE_URL}code/DensestSubgraph.cpp`,
      },
    }, // Add comma here
    {
      name: "CoreExact",
      nameingraph: "CoreExact",
      paper: "Efficient Algorithms for Densest Subgraph Discovery",
      paperUrl: "public/papers/efficient algo copy.pdf",
      implementation: {
        language: "cpp",
        filePath: `${import.meta.env.BASE_URL}code/4.cpp`,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-8xl mx-auto px-10 py-8">
        <div className="space-y-12">
          {activeTab === "overview" ? (
            <Overview
              algorithms={algorithms}
              onTabChange={setActiveTab}
              setSelectedAlgorithm={setSelectedAlgorithm}
            />
          ) : activeTab === "datasets" ? (
            <Datasets />
          ) : activeTab === "implementation" ? ( // Keep Implementation tab
            <Implementation
              algorithms={algorithms}
              initialSelected={selectedAlgorithm}
            />
          ) : (
            // Add the 'details' tab rendering
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
