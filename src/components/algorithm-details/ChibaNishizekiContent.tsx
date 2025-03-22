import React from 'react';
import { CollapsibleSection } from './CollapsibleSection.tsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChibaNishizekiContentProps {
  expandedSections: {[key: string]: boolean};
  toggleSection: (sectionKey: string) => void;
}

export const ChibaNishizekiContent: React.FC<ChibaNishizekiContentProps> = ({ expandedSections, toggleSection }) => {
  return (
    <div className="prose max-w-none">
      <h1 className="text-2xl font-bold mb-4">
        Chiba-1985-arboricity Algorithm
      </h1>
      
      <div className="mb-6">
        <p className="mb-4">
          This algorithm was introduced by Chiba and Nishizeki in their 1985 paper "ARBORICITY AND SUBGRAPH LISTING ALGORITHMS."
        </p>
      </div>

      <CollapsibleSection 
        title="Algorithm Description"
        id="chiba-algorithm"
        isExpanded={expandedSections["chiba-algorithm"] !== false}
        toggleExpanded={() => toggleSection("chiba-algorithm")}
      >
        <div>
          <p className="mb-4">
            The Chiba-Nishizeki algorithm leverages the concept of arboricity to efficiently list all maximal cliques in a graph. 
            Arboricity is the minimum number of forests needed to cover all edges of a graph.
          </p>
          <p className="mb-4">
            The algorithm works by:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-2">Ordering vertices based on degree</li>
            <li className="mb-2">Processing vertices in this order</li>
            <li className="mb-2">Finding cliques using a recursive approach</li>
          </ol>

          <div className="mb-4">
            <SyntaxHighlighter language="cpp" style={tomorrow} customStyle={{ borderRadius: '0.375rem' }}>
              {`void findCliques(const vector<vector<int>>& graph) {
  // Process vertices in order of increasing degree
  for (int v : orderedVertices) {
    // Find cliques containing v
    // ...
  }
}`}
            </SyntaxHighlighter>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Time Complexity Analysis"
        id="chiba-complexity"
        isExpanded={expandedSections["chiba-complexity"] !== false}
        toggleExpanded={() => toggleSection("chiba-complexity")}
      >
        <div>
          <p className="mb-4">
            The time complexity is O(a(G) · m), where:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">a(G) is the arboricity of the graph</li>
            <li className="mb-2">m is the number of edges</li>
          </ul>
          <p className="mb-4">
            For sparse graphs, this is often much better than the worst-case exponential time.
          </p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Experimental Observations"
        id="chiba-observations"
        isExpanded={expandedSections["chiba-observations"] !== false}
        toggleExpanded={() => toggleSection("chiba-observations")}
      >
        <div>
          <h3 className="text-lg font-medium mb-2">Performance on Sparse Graphs</h3>
          <p className="mb-4">
            The algorithm performs extremely well on sparse graphs with low arboricity. 
            Test results show consistent performance across multiple runs.
          </p>

          <h3 className="text-lg font-medium mb-2">Performance on Dense Graphs</h3>
          <p className="mb-4">
            For dense graphs, the performance degrades as expected due to higher arboricity values. 
            However, it still outperforms naive approaches.
          </p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Comparison with Other Algorithms"
        id="chiba-comparison"
        isExpanded={expandedSections["chiba-comparison"] !== false}
        toggleExpanded={() => toggleSection("chiba-comparison")}
      >
        <div>
          <p className="mb-4">
            When compared with other maximal clique enumeration algorithms, Chiba-Nishizeki shows:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Better performance than the basic Bron-Kerbosch algorithm for sparse graphs</li>
            <li className="mb-2">Competitive performance with Tomita's algorithm for medium-density graphs</li>
            <li className="mb-2">Less effective than ELS for very large sparse graphs</li>
          </ul>
        </div>
      </CollapsibleSection>
    </div>
  );
};
