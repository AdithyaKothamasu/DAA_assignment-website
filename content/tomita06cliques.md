# The worst-case time complexity for generating all maximal cliques and computational experiments

## Algorithm Overview

The Tomita algorithm, proposed by Etsuji Tomita et al. in 2006, is an efficient method for enumerating all maximal cliques in an undirected graph. It is a depth-first search algorithm that employs pruning techniques to improve performance over earlier approaches like the Bron-Kerbosch algorithm.

## Key Components

### 1. Pivot Selection
- Chooses a pivot vertex u from P ∪ X that maximizes |P ∩ Γ(u)|
- This minimizes the number of recursive calls by excluding neighbors of u

### 2. Recursive Procedure
- Maintains three sets:
  - R: Current clique being built
  - P: Candidate vertices that can extend R
  - X: Excluded vertices
- Recursively explores cliques containing v ∈ P \ Γ(u)

### 3. Pruning Techniques
- Uses degeneracy ordering to process vertices
- Employs pivot selection to reduce search space

## Implementation Details

1. **Graph Representation**: Uses an adjacency matrix for efficient neighbor checks

2. **Output Format**: Prints cliques in a tree-like structure to save space

3. **Main Function**: `listAllMaximalCliquesMatrix`
   - Initializes data structures
   - Calls recursive function

4. **Recursive Function**: `listAllMaximalCliquesMatrixRecursive`
   - Implements the core Tomita algorithm logic

5. **Pivot Selection**: `findBestPivotNonNeighborsMatrix`
   - Determines the best pivot to minimize recursive calls

## Theoretical Guarantees

- **Time Complexity**: O(3^(n/3)) for an n-vertex graph
- **Space Complexity**: O(n^2) due to adjacency matrix storage

## Observations

1. **Efficiency**: Significantly faster than earlier algorithms like Bron-Kerbosch for most graph types

2. **Memory Usage**: 
   - Requires O(n^2) space for adjacency matrix
   - May be prohibitive for very large graphs

3. **Output Handling**: 
   - Tree-like output format reduces space requirements
   - Allows processing of cliques without storing all in memory

4. **Graph Density Impact**:
   - Performs exceptionally well on sparse graphs
   - Efficiency decreases as graph density increases

5. **Pivot Selection**: 
   - Critical for performance
   - Choosing pivot that maximizes |P ∩ Γ(u)| is key to minimizing recursive calls

6. **Degeneracy Ordering**: 
   - Helps in processing vertices efficiently
   - Particularly effective for sparse graphs

7. **Scalability**: 
   - Handles moderate-sized graphs well
   - May struggle with very large graphs due to memory requirements

8. **Implementation Considerations**:
   - Adjacency matrix representation offers fast neighbor checks but high memory usage
   - Alternative representations (e.g., adjacency lists) may be considered for very large sparse graphs

9. **Comparison to Other Algorithms**:
   - Generally outperforms Bron-Kerbosch algorithm
   - More memory-efficient than some output-sensitive algorithms for sparse graphs

10. **Practical Applications**:
    - Effective for various graph analysis tasks in social networks, bioinformatics, etc.
    - Particularly useful when all maximal cliques are needed, not just the maximum clique
