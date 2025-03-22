import React from 'react';
import { CollapsibleSection } from './CollapsibleSection.tsx';

interface ELSContentProps {
  expandedSections: {[key: string]: boolean};
  toggleSection: (sectionKey: string) => void;
}

export const ELSContent: React.FC<ELSContentProps> = ({ expandedSections, toggleSection }) => {
  return (
    <div className="prose max-w-none">
      <h1 className="text-2xl font-bold mb-4">
        ELS Algorithm (Enhanced Bron-Kerbosch with Degeneracy Ordering)
      </h1>
      
      <div className="mb-6">
        <p className="mb-4">
          The <strong>ELS (Eppstein-Löffler-Strash) algorithm</strong> is a fixed-parameter tractable variant of the Bron-Kerbosch algorithm 
          optimized for sparse graphs. It leverages <strong>degeneracy ordering</strong> to enumerate all maximal cliques in 
          <strong> near-optimal time</strong> O(dn · 3^(d/3)), where d is the graph's degeneracy and n is the vertex count. 
          This approach outperforms traditional methods on real-world networks like social/biochemical graphs with low degeneracy.
        </p>
      </div>

      <CollapsibleSection 
        title="Key Components"
        id="els-key-components"
        isExpanded={expandedSections["els-key-components"] !== false}
        toggleExpanded={() => toggleSection("els-key-components")}
      >
        <div>
          <h3 className="text-lg font-medium mb-2">1. Degeneracy Ordering</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Objective</strong>: Order vertices such that each vertex has ≤ d later neighbors.</li>
            <li className="mb-2">
              <strong>Implementation</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li>Computed via bucket-sort in O(n + m) time (DO function).</li>
                <li>Iteratively removes vertices with the smallest residual degree, updating neighbor degrees dynamically.</li>
              </ul>
            </li>
            <li className="mb-2"><strong>Impact</strong>: Minimizes candidate set size during clique expansion, reducing recursive branches.</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">2. Modified Bron-Kerbosch Backtracking</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>Core Logic</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Sets</strong>: Maintains R (current clique), P (candidate vertices), X (excluded vertices).</li>
                <li><strong>Pivot Selection</strong>: Uses the first vertex in P ∪ X (simpler than Tomita's max-neighbor heuristic).</li>
                <li><strong>In-Place Partitioning</strong>: Dynamically partitions neighbors of pivot during recursion.</li>
              </ul>
            </li>
            <li className="mb-2"><strong>Recursion</strong>: Explores cliques containing vertex v ∈ P, pruning non-neighbors of v from P/X.</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">3. Output-Sensitive Optimization</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>Key Features</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Degeneracy-Based Pruning</strong>: Limits later neighbors to d, bounding recursion depth.</li>
                <li><strong>Binary Search Checks</strong>: Adjacency checks in O(log k) time (k = vertex degree).</li>
              </ul>
            </li>
          </ul>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Implementation Details"
        id="els-implementation"
        isExpanded={expandedSections["els-implementation"] !== false}
        toggleExpanded={() => toggleSection("els-implementation")}
      >
        <div>
          <h3 className="text-lg font-medium mb-2">1. Graph Representation</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Input Handling</strong>: Reads adjacency lists (e.g., as-skitter.txt) into a map&lt;int, set&lt;int&gt;&gt;.</li>
            <li className="mb-2"><strong>Indexed Conversion</strong>: Maps raw vertex IDs to contiguous indices for cache efficiency (convertToAdjList).</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">2. Degeneracy Ordering (DO Function)</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Bucket Sorting</strong>: Uses dynamic degree buckets for O(n + m) complexity.</li>
            <li className="mb-2"><strong>Efficiency</strong>: Each vertex/edge processed once, suitable for large-scale graphs.</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">3. Clique Enumeration</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Progress Tracking</strong>: Logs progress every 1,000 vertices.</li>
            <li className="mb-2"><strong>Clique Counting</strong>: Stores results in cliqueCount (size → frequency map).</li>
            <li className="mb-2"><strong>Memory Optimization</strong>: Avoids adjacency matrices; uses sorted adjacency lists.</li>
          </ul>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Theoretical Guarantees"
        id="els-theoretical"
        isExpanded={expandedSections["els-theoretical"] !== false}
        toggleExpanded={() => toggleSection("els-theoretical")}
      >
        <div>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-2"><strong>Time Complexity</strong>: O(dn · 3^(d/3)), optimal for graphs with n - d = Ω(n).</li>
            <li className="mb-2"><strong>Maximal Clique Bound</strong>: At most (n - d) · 3^(d/3) cliques in a d-degenerate graph.</li>
            <li className="mb-2"><strong>Fixed-Parameter Tractability</strong>: Efficient for constant d (e.g., social networks, planar graphs).</li>
          </ol>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Execution Flow"
        id="els-execution"
        isExpanded={expandedSections["els-execution"] !== false}
        toggleExpanded={() => toggleSection("els-execution")}
      >
        <div>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-2"><strong>Initialization</strong>: Load graph → convert to indexed adjacency list.</li>
            <li className="mb-2"><strong>Degeneracy Ordering</strong>: Compute vertex order via DO.</li>
            <li className="mb-2">
              <strong>Clique Expansion</strong>: For each vertex v in degeneracy order:
              <ul className="list-disc pl-6 mt-2">
                <li>Initialize P (later neighbors of v), X (earlier neighbors).</li>
                <li>Call BronKerboschRecursionInPlace(P, R={"{v}"}, X).</li>
              </ul>
            </li>
            <li className="mb-2"><strong>Output</strong>: Print clique size distribution and runtime.</li>
          </ol>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Observations from Implementation"
        id="els-observations"
        isExpanded={expandedSections["els-observations"] !== false}
        toggleExpanded={() => toggleSection("els-observations")}
      >
        <div>
          <h3 className="text-lg font-medium mb-2">1. Efficiency on Sparse Graphs</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Speed</strong>: Processes 1M+ cliques/sec on real-world graphs (e.g., protein networks).</li>
            <li className="mb-2"><strong>Scalability</strong>: Linear time for fixed d; handles graphs with n &gt; 10^5 vertices.</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">2. Memory vs. Speed Tradeoffs</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Adjacency Lists</strong>: Use O(m) space vs. O(n^2) for matrices (critical for large graphs).</li>
            <li className="mb-2"><strong>Binary Search</strong>: Enables O(log k) neighbor checks but adds pre-sorting overhead.</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">3. Degeneracy Impact</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Low d</strong>: Runtime scales as O(n), ideal for social/media graphs (d ≈ 10-100).</li>
            <li className="mb-2"><strong>High d</strong>: Still outperforms Tomita/Chiba-Nishizeki but loses fixed-parameter benefits.</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">4. Practical Optimizations</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Early Termination</strong>: Skips non-maximal cliques via X set checks.</li>
            <li className="mb-2"><strong>Parallelization Potential</strong>: Outer loop over degeneracy order is trivially parallelizable.</li>
          </ul>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Comparison with Tomita's Algorithm"
        id="els-comparison"
        isExpanded={expandedSections["els-comparison"] !== false}
        toggleExpanded={() => toggleSection("els-comparison")}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
                <th className="border border-gray-300 px-4 py-2 text-left">ELS Algorithm</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Tomita's Algorithm</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Pivot Strategy</td>
                <td className="border border-gray-300 px-4 py-2">First vertex in P ∪ X</td>
                <td className="border border-gray-300 px-4 py-2">Vertex maximizing P ∩ Γ(u)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Time Complexity</td>
                <td className="border border-gray-300 px-4 py-2">O(dn · 3^(d/3))</td>
                <td className="border border-gray-300 px-4 py-2">O(3^(n/3))</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Memory</td>
                <td className="border border-gray-300 px-4 py-2">O(m) (adjacency lists)</td>
                <td className="border border-gray-300 px-4 py-2">O(n^2) (adjacency matrices)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Sparsity Handling</td>
                <td className="border border-gray-300 px-4 py-2">Excels on d ≪ n</td>
                <td className="border border-gray-300 px-4 py-2">Better for dense small graphs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Conclusion"
        id="els-conclusion"
        isExpanded={expandedSections["els-conclusion"] !== false}
        toggleExpanded={() => toggleSection("els-conclusion")}
      >
        <p className="mb-4">
          The ELS algorithm provides a theoretically grounded and practically efficient solution for maximal clique enumeration 
          in sparse graphs. Its degeneracy-driven pruning and linear-memory design make it ideal for real-world networks, 
          outperforming classical methods by orders of magnitude when d is small. Future work could explore hybrid pivot 
          strategies or GPU acceleration for further speedups.
        </p>
      </CollapsibleSection>
    </div>
  );
};
