# Chiba-1985-arboricity Algorithm

This algorithm was introduced by Chiba and Nishizeki in their 1985 paper "ARBORICITY AND SUBGRAPH LISTING ALGORITHMS."

## Algorithm Description

The Chiba-Nishizeki algorithm leverages the concept of arboricity to efficiently list all maximal cliques in a graph. Arboricity is the minimum number of forests needed to cover all edges of a graph.

The algorithm works by:
1. Ordering vertices based on degree
2. Processing vertices in this order
3. Finding cliques using a recursive approach

```cpp
void findCliques(const vector<vector<int>>& graph) {
  // Process vertices in order of increasing degree
  for (int v : orderedVertices) {
    // Find cliques containing v
    // ...
  }
}
```

## Time Complexity Analysis

The time complexity is O(a(G) · m), where:
- a(G) is the arboricity of the graph
- m is the number of edges

For sparse graphs, this is often much better than the worst-case exponential time.

## Experimental Observations

### Performance on Sparse Graphs

The algorithm performs extremely well on sparse graphs with low arboricity. Test results show consistent performance across multiple runs.

### Performance on Dense Graphs

For dense graphs, the performance degrades as expected due to higher arboricity values. However, it still outperforms naive approaches.

## Comparison with Other Algorithms

When compared with other maximal clique enumeration algorithms, Chiba-Nishizeki shows:
- Better performance than the basic Bron-Kerbosch algorithm for sparse graphs
- Competitive performance with Tomita's algorithm for medium-density graphs
- Less effective than ELS for very large sparse graphs
