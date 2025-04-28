import React from 'react';
import { CollapsibleSection } from './CollapsibleSection.tsx';

interface DensestSubgraphContentProps {
  expandedSections: {[key: string]: boolean};
  toggleSection: (sectionKey: string) => void;
}

export const DensestSubgraphContent: React.FC<DensestSubgraphContentProps> = ({ expandedSections, toggleSection }) => {
  return (
    <div className="prose max-w-none">
      <h1 className="text-2xl font-bold mb-4">
        Finding the Densest Subgraph based on h-Clique Density
      </h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Algorithm Overview</h2>
        <p className="mb-4">
          This algorithm aims to find a subgraph within a given graph that exhibits the highest "density". The density is defined based on the number of h-cliques (or structures closely related to h-cliques) present within the subgraph relative to the number of vertices in that subgraph. It leverages techniques from network flow (specifically, Dinic's algorithm for max-flow/min-cut) and combinatorial search to solve an optimization problem that identifies this densest subgraph.
        </p>
        <p className="mb-4">
          The core idea involves iteratively searching for the optimal density value (alpha) using a binary search approach. For each candidate density, a flow network is constructed. The minimum cut in this network corresponds to a partition of vertices, and the properties of this cut help determine whether the optimal density is higher or lower than the current candidate.
        </p>
      </div>

      <CollapsibleSection 
        title="Key Components"
        id="densest-key-components"
        isExpanded={expandedSections["densest-key-components"] !== false}
        toggleExpanded={() => toggleSection("densest-key-components")}
      >
        <div>
          <h3 className="text-lg font-medium mb-2">1. (h-1)-Clique Enumeration</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Identifies all cliques of size h-1 ("almost cliques") in the input graph using a recursive backtracking approach (`expandCliques`).</li>
            <li className="mb-2">For each (h-1)-clique, it also finds potential vertices that could extend it to an h-clique (`cliqueCandidates`).</li>
            <li className="mb-2">Pre-calculates vertex degrees based on their participation in these potential h-cliques (`calculateVertexDegrees`).</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">2. Flow Network Construction (Dinic's Algorithm)</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Uses Dinic's algorithm to compute the maximum flow (and implicitly, the minimum cut) in a specially constructed network.</li>
            <li className="mb-2">The network includes a source (src), a sink (tgt), nodes representing graph vertices, and nodes representing the enumerated (h-1)-cliques.</li>
            <li className="mb-2">Edges and capacities are set up based on the pre-calculated vertex degrees, the candidate density (alpha), and the relationships between vertices and the (h-1)-cliques they belong to or can extend.</li>
            <li className="mb-2">Specifically:
              <ul className="list-disc pl-6 mt-2">
                <li>Edges from src to vertex nodes have capacity equal to the vertex's degree.</li>
                <li>Edges from vertex nodes to the sink have capacity alpha * h.</li>
                <li>Edges connect (h-1)-clique nodes to their constituent vertex nodes (infinite capacity).</li>
                <li>Edges connect vertex nodes (potential extenders) to the (h-1)-clique nodes they can extend (capacity 1.0).</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-lg font-medium mb-2">3. Binary Search on Density (alpha)</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Performs a binary search over possible density values (alpha).</li>
            <li className="mb-2">In each iteration, constructs the flow network described above with the current alpha.</li>
            <li className="mb-2">Computes the max-flow/min-cut using `computeMaxFlow`. The `identifyMinCut` function determines the set of nodes reachable from the source in the residual graph.</li>
            <li className="mb-2">The vertices corresponding to reachable nodes form the candidate subgraph for that alpha.</li>
            <li className="mb-2">If the subgraph is empty, the target density (alpha) is too high; otherwise, it's potentially achievable, and the search continues in the higher range.</li>
            <li className="mb-2">The best non-empty subgraph found during the search is returned.</li>
          </ul>
           <h3 className="text-lg font-medium mb-2">4. Density Evaluation</h3>
           <ul className="list-disc pl-6 mb-4">
             <li className="mb-2">The `evaluateDensity` function calculates the actual density of the resulting subgraph by counting the number of h-cliques formed within it and dividing by the number of nodes.</li>
           </ul>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Implementation Details"
        id="densest-implementation"
        isExpanded={expandedSections["densest-implementation"] !== false}
        toggleExpanded={() => toggleSection("densest-implementation")}
      >
        <div>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Graph Representation</strong>: Uses adjacency lists ({'<code>vector<vector<int>></code>'} graph) sorted for efficient searching (`binary_search`). Maps original labels to contiguous IDs.</li>
            <li className="mb-2"><strong>Flow Network</strong>: Implemented in the `FlowNetwork` class using adjacency lists storing `FlowEdge` structs. Includes `buildLevelGraph` and `sendFlow` for Dinic's algorithm phases.</li>
            <li className="mb-2"><strong>Clique Handling</strong>: Stores (h-1)-cliques (`almostCliques`) and their potential extensions (`cliqueCandidates`). Uses a map (`cliqueID`) to avoid duplicate (h-1)-cliques during enumeration.</li>
            <li className="mb-2"><strong>Core Logic</strong>: The `densestSubgraph` function orchestrates the binary search and flow network construction/computation.</li>
            <li className="mb-2"><strong>Input Reading</strong>: `readGraph` handles file input, parsing vertex/edge counts, h value, and edge list, managing label-to-ID mapping.</li>
            <li className="mb-2"><strong>Precision</strong>: Uses `double` for capacities and flow, comparing against a small epsilon (`1e-9`) to handle floating-point inaccuracies.</li>
          </ul>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Theoretical Guarantees"
        id="densest-theoretical"
        isExpanded={expandedSections["densest-theoretical"] !== false}
        toggleExpanded={() => toggleSection("densest-theoretical")}
      >
        <div>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">The algorithm relies on the max-flow min-cut theorem. The specific construction of the flow network relates the minimum cut value to the density objective function.</li>
            <li className="mb-2">The binary search converges towards the maximum possible density value achievable according to the defined metric.</li>
            <li className="mb-2">The overall time complexity is influenced by:
                <ul className="list-disc pl-6 mt-2">
                  <li>The (h-1)-clique enumeration step, which can be exponential in the worst case.</li>
                  <li>The complexity of Dinic's algorithm (e.g., O(V^2 * E) or better variants, where V and E are nodes/edges in the flow network, which depends on the number of vertices and (h-1)-cliques).</li>
                  <li>The number of iterations in the binary search (logarithmic in the range of possible densities).</li>
                </ul>
            </li>
             <li className="mb-2">Space complexity depends on storing the graph, the enumerated (h-1)-cliques, and the flow network structures.</li>
          </ul>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Observations"
        id="densest-observations"
        isExpanded={expandedSections["densest-observations"] !== false}
        toggleExpanded={() => toggleSection("densest-observations")}
      >
        <div>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">The definition of "density" is specific to this algorithm, focusing on h-cliques or near h-cliques.</li>
            <li className="mb-2">Performance heavily depends on the number of (h-1)-cliques found in the graph, which can vary significantly based on graph structure and the value of 'h'.</li>
            <li className="mb-2">The use of max-flow is a powerful technique for solving certain types of optimization problems on graphs, including variations of densest subgraph problems.</li>
            <li className="mb-2">The binary search approach requires careful selection of the search range and termination condition based on desired precision.</li>
            <li className="mb-2">The algorithm might be computationally intensive for large graphs or graphs with a very high number of (h-1)-cliques.</li>
            <li className="mb-2">The parameter 'h' directly influences the complexity and the nature of the density being measured. Smaller 'h' values generally lead to faster execution but measure density based on smaller structures.</li>
          </ul>
        </div>
      </CollapsibleSection>
    </div>
  );
};