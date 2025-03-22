import React from 'react';
import { CollapsibleSection } from './CollapsibleSection.tsx';

interface TomitaContentProps {
  expandedSections: {[key: string]: boolean};
  toggleSection: (sectionKey: string) => void;
}

export const TomitaContent: React.FC<TomitaContentProps> = ({ expandedSections, toggleSection }) => {
  return (
    <div className="prose max-w-none">
      <h1 className="text-2xl font-bold mb-4">
        The worst-case time complexity for generating all maximal cliques and computational experiments
      </h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Algorithm Overview</h2>
        <p className="mb-4">
          The Tomita algorithm, proposed by Etsuji Tomita et al. in 2006, is an efficient method for enumerating all maximal cliques in an undirected graph. 
          It is a depth-first search algorithm that employs pruning techniques to improve performance over earlier approaches like the Bron-Kerbosch algorithm.
        </p>
      </div>

      <CollapsibleSection 
        title="Key Components"
        id="tomita-key-components"
        isExpanded={expandedSections["tomita-key-components"] !== false}
        toggleExpanded={() => toggleSection("tomita-key-components")}
      >
        <div>
          <h3 className="text-lg font-medium mb-2">1. Pivot Selection</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Chooses a pivot vertex u from P ∪ X that maximizes |P ∩ Γ(u)|</li>
            <li className="mb-2">This minimizes the number of recursive calls by excluding neighbors of u</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">2. Recursive Procedure</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              Maintains three sets:
              <ul className="list-disc pl-6 mt-2">
                <li>R: Current clique being built</li>
                <li>P: Candidate vertices that can extend R</li>
                <li>X: Excluded vertices</li>
              </ul>
            </li>
            <li className="mb-2">Recursively explores cliques containing v ∈ P \ Γ(u)</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">3. Pruning Techniques</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Uses degeneracy ordering to process vertices</li>
            <li className="mb-2">Employs pivot selection to reduce search space</li>
          </ul>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Implementation Details"
        id="tomita-implementation"
        isExpanded={expandedSections["tomita-implementation"] !== false}
        toggleExpanded={() => toggleSection("tomita-implementation")}
      >
        <div>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-2"><strong>Graph Representation</strong>: Uses an adjacency matrix for efficient neighbor checks</li>
            <li className="mb-2"><strong>Output Format</strong>: Prints cliques in a tree-like structure to save space</li>
            <li className="mb-2">
              <strong>Main Function</strong>: <code>listAllMaximalCliquesMatrix</code>
              <ul className="list-disc pl-6 mt-2">
                <li>Initializes data structures</li>
                <li>Calls recursive function</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Recursive Function</strong>: <code>listAllMaximalCliquesMatrixRecursive</code>
              <ul className="list-disc pl-6 mt-2">
                <li>Implements the core Tomita algorithm logic</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Pivot Selection</strong>: <code>findBestPivotNonNeighborsMatrix</code>
              <ul className="list-disc pl-6 mt-2">
                <li>Determines the best pivot to minimize recursive calls</li>
              </ul>
            </li>
          </ol>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Theoretical Guarantees"
        id="tomita-theoretical"
        isExpanded={expandedSections["tomita-theoretical"] !== false}
        toggleExpanded={() => toggleSection("tomita-theoretical")}
      >
        <div>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Time Complexity</strong>: O(3^(n/3)) for an n-vertex graph</li>
            <li className="mb-2"><strong>Space Complexity</strong>: O(n^2) due to adjacency matrix storage</li>
          </ul>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Observations"
        id="tomita-observations"
        isExpanded={expandedSections["tomita-observations"] !== false}
        toggleExpanded={() => toggleSection("tomita-observations")}
      >
        <div>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-2">
              <strong>Efficiency</strong>: Significantly faster than earlier algorithms like Bron-Kerbosch for most graph types
            </li>
            <li className="mb-2">
              <strong>Memory Usage</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li>Requires O(n^2) space for adjacency matrix</li>
                <li>May be prohibitive for very large graphs</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Output Handling</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li>Tree-like output format reduces space requirements</li>
                <li>Allows processing of cliques without storing all in memory</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Graph Density Impact</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li>Performs exceptionally well on sparse graphs</li>
                <li>Efficiency decreases as graph density increases</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Pivot Selection</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li>Critical for performance</li>
                <li>Choosing pivot that maximizes |P ∩ Γ(u)| is key to minimizing recursive calls</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Degeneracy Ordering</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li>Helps in processing vertices efficiently</li>
                <li>Particularly effective for sparse graphs</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Scalability</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li>Handles moderate-sized graphs well</li>
                <li>May struggle with very large graphs due to memory requirements</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Implementation Considerations</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li>Adjacency matrix representation offers fast neighbor checks but high memory usage</li>
                <li>Alternative representations (e.g., adjacency lists) may be considered for very large sparse graphs</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Comparison to Other Algorithms</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li>Generally outperforms Bron-Kerbosch algorithm</li>
                <li>More memory-efficient than some output-sensitive algorithms for sparse graphs</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Practical Applications</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li>Effective for various graph analysis tasks in social networks, bioinformatics, etc.</li>
                <li>Particularly useful when all maximal cliques are needed, not just the maximum clique</li>
              </ul>
            </li>
          </ol>
        </div>
      </CollapsibleSection>
    </div>
  );
};
