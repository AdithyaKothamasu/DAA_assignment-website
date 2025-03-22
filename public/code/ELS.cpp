#include <bits/stdc++.h>
#include <chrono>
using namespace std;
using namespace std::chrono;

// Global graph data structures
map<int, unordered_set<int>> adj;
vector<vector<int>> adj_list;
vector<int> order;
int totalMaximalCliques = 0;


// Global output stream for cliques
ofstream cliqueOut;

// Global variables for Bron–Kerbosch recursion candidate sets
vector<int> globalP, globalR, globalX;
map<int, int> cliqueSizeFrequency;


void writeCliqueToFile(const vector<int>& clique) {
    int size = clique.size();
    cliqueSizeFrequency[size]++;
    totalMaximalCliques++;   // Increment the count for this clique size
}
// Function to load the graph into the global 'adj' map
void loadGraph(const string& filename) {
    ifstream file(filename);
    if (!file) {
        cerr << "Error: Unable to open file " << filename << "\n";
        exit(1);
    }
    string line;
    int edge_count = 0;
    cout << "Reading file: " << filename << "...\n";
    while(getline(file, line)) {
        stringstream ss(line);
        int u;
        if (!(ss >> u)) continue; // First number is the main node
        int v;
        while(ss >> v) {  // All following numbers are neighbors
            if(u != v) { // Avoid self-loops
                adj[u].insert(v);
                adj[v].insert(u); // Undirected graph
                edge_count++;
            }
        }
    }
    file.close();
    cout << "Edges: " << edge_count / 2 << " | Nodes: " << adj.size() << "\n";
}

// Convert the global 'adj' map to the global vector<vector<int>> 'adj_list'
void convertToAdjList() {
    unordered_map<int,int> node_index;
    int index = 0;
    for (const auto &pair : adj)
        node_index[pair.first] = index++;
    adj_list.resize(adj.size());
    for (const auto &pair : adj) {
        int mapped_u = node_index[pair.first];
        for (int v : pair.second) {
            int mapped_v = node_index[v];
            adj_list[mapped_u].push_back(mapped_v);
        }
    }
    // Sort each neighbor list (they remain sorted)
    for (auto &neighbors : adj_list)
        sort(neighbors.begin(), neighbors.end());
    cout << "Adjacency list conversion completed.\n";
}

// Compute a degeneracy ordering using bucket sort.
// Uses the global 'adj_list' and stores the ordering in the global 'order'.
void DO(int &degeneracy) {
    int n = adj_list.size();
    vector<int> d(n, 0);
    vector<bool> removed(n, false);
    order.clear();
    
    int maxDegree = 0;
    for (int v = 0; v < n; v++) {
        d[v] = adj_list[v].size();
        maxDegree = max(maxDegree, d[v]);
    }
    
    vector<list<int>> buckets(maxDegree + 1);
    vector<list<int>::iterator> pos(n);
    for (int v = 0; v < n; v++) {
        buckets[d[v]].push_back(v);
        pos[v] = --buckets[d[v]].end();
    }
    
    degeneracy = 0;
    for (int iter = 0; iter < n; iter++) {
        int i = 0;
        while(i < buckets.size() && buckets[i].empty())
            i++;
        if (i >= buckets.size())
            break;
        int v = buckets[i].front();
        buckets[i].pop_front();
        removed[v] = true;
        order.push_back(v);
        degeneracy = max(degeneracy, i);
        // Update neighbors
        for (int u : adj_list[v]) {
            if (!removed[u]) {
                int oldDeg = d[u];
                buckets[oldDeg].erase(pos[u]);
                d[u]--;
                int newDeg = d[u];
                buckets[newDeg].push_back(u);
                pos[u] = --buckets[newDeg].end();
            }
        }
    }
    cout << "Degeneracy ordering computed.\n";
}

/*
   In-place Bron–Kerbosch recursion using inline two-pointer intersection.
   This version assumes that globalP and globalX are maintained in sorted order.
   Instead of storing cliques in memory, we write each clique to disk.
*/
void BronKerboschRecursionInPlace() {
    if (globalP.empty() && globalX.empty()) {
        writeCliqueToFile(globalR);
        return;
    }
    // Simple pivot: choose first element from globalP (or globalX if empty)
    int pivot = (!globalP.empty()) ? globalP[0] : globalX[0];
    
    // Build list of vertices in globalP not adjacent to pivot using two-pointer merge.
    vector<int> P_not;
    {
        size_t i = 0, j = 0;
        while(i < globalP.size() && j < adj_list[pivot].size()){
            if(globalP[i] < adj_list[pivot][j])
                P_not.push_back(globalP[i++]);
            else if(globalP[i] > adj_list[pivot][j])
                j++;
            else {
                i++;
                j++;
            }
        }
        while(i < globalP.size()){
            P_not.push_back(globalP[i++]);
        }
    }
    
    // Backup candidate sets.
    vector<int> backupP = globalP, backupX = globalX;
    
    for (int v : P_not) {
        // Remove v from globalP (in-place removal)
        auto it = find(globalP.begin(), globalP.end(), v);
        if (it != globalP.end())
            globalP.erase(it);
        
        globalR.push_back(v);
        
        // Compute newP = globalP ∩ N(v) using two-pointer merge.
        vector<int> newP;
        {
            size_t i = 0, j = 0;
            while(i < globalP.size() && j < adj_list[v].size()){
                if(globalP[i] < adj_list[v][j])
                    i++;
                else if(globalP[i] > adj_list[v][j])
                    j++;
                else {
                    newP.push_back(globalP[i]);
                    i++;
                    j++;
                }
            }
        }
        
        // Compute newX = globalX ∩ N(v) using two-pointer merge.
        vector<int> newX;
        {
            size_t i = 0, j = 0;
            while(i < globalX.size() && j < adj_list[v].size()){
                if(globalX[i] < adj_list[v][j])
                    i++;
                else if(globalX[i] > adj_list[v][j])
                    j++;
                else {
                    newX.push_back(globalX[i]);
                    i++;
                    j++;
                }
            }
        }
        
        // Backup current candidate sets before recursion.
        vector<int> savedP = globalP, savedX = globalX;
        globalP = newP;
        globalX = newX;
        
        BronKerboschRecursionInPlace();
        
        // Backtracking: restore candidate sets and remove v from globalR.
        globalR.pop_back();
        globalP = backupP;
        globalX = backupX;
        
        // Move v from globalP to globalX.
        it = find(globalP.begin(), globalP.end(), v);
        if (it != globalP.end())
            globalP.erase(it);
        globalX.push_back(v);
        sort(globalX.begin(), globalX.end()); // ensure globalX remains sorted
        
        // Update backups for next iteration.
        backupP = globalP;
        backupX = globalX;
    }
}

// Bron–Kerbosch algorithm using degeneracy ordering.
// It sets up candidate sets and calls the in-place recursion.
void BronKerboschDegeneracyGlobal() {
    int degeneracy;
    DO(degeneracy);
    cout << "Graph degeneracy: " << degeneracy << "\n";
    int n = order.size();
    // Instead of storing cliques in memory, we stream them out.
    for (int i = 0; i < n; i++) {
        int v = order[i];
        if (i % 1000 == 0)
            cout << i/1000<< " ";
        // Build globalP as vertices later in order that are adjacent to v.
        globalP.clear();
        for (int j = i + 1; j < n; j++) {
            int u = order[j];
            if (binary_search(adj_list[v].begin(), adj_list[v].end(), u))
                globalP.push_back(u);
        }
        sort(globalP.begin(), globalP.end());
        
        // Build globalX as vertices earlier in order that are adjacent to v.
        globalX.clear();
        for (int j = 0; j < i; j++) {
            int u = order[j];
            if (binary_search(adj_list[v].begin(), adj_list[v].end(), u))
                globalX.push_back(u);
        }
        sort(globalX.begin(), globalX.end());
        
        globalR.clear();
        globalR.push_back(v);
        BronKerboschRecursionInPlace();
    }
}

int main() {
    // Change the filename to your large dataset (e.g., as-skitter.txt)
    string filename = "as-skitter.txt";
    cout << "Starting program execution...\n";
    loadGraph(filename);
    convertToAdjList();
    cout << "Graph Loaded! Nodes: " << adj.size() << "\n";
    
    // Open output file for cliques.
    cliqueOut.open("maximal_cliques.txt");
    if (!cliqueOut.is_open()) {
        cerr << "Error: Could not open output file for cliques.\n";
        return 1;
    }
    
    int numRuns = 1;
    vector<double> runTimes;
    
    for (int run = 0; run < numRuns; run++) {
        cout << "Starting Run " << run + 1 << "...\n";
        auto start = steady_clock::now();
        BronKerboschDegeneracyGlobal();
        auto end = steady_clock::now();
        double duration = duration_cast<milliseconds>(end - start).count();
        runTimes.push_back(duration);
        cout << "Run " << run + 1 << " execution time: " << duration << " ms\n";
    }
    
    cliqueOut.close();
    
    // Build and print summary tables.
    // (Since cliques are streamed to disk, we don't have them in memory.)
    double avgTime = accumulate(runTimes.begin(), runTimes.end(), 0.0) / numRuns;
    
    cout << "\n--- Execution Time Table ---\n";
    cout << "---------------------------------\n";
    cout << "| Run # | Execution Time (ms)    |\n";
    cout << "---------------------------------\n";
    for (int i = 0; i < numRuns; i++) {
        cout << "|  " << setw(4) << i+1 << "  |  " << setw(10) << runTimes[i] << " ms   |\n";
    }
    cout << "---------------------------------\n";
    cout << "| Avg   |  " << setw(10) << avgTime << " ms   |\n";
    cout << "---------------------------------\n";

    cout << "| Clique Size | Number of Cliques       |\n";
    cout << "----------------------------------------\n";
    for (const auto &pair : cliqueSizeFrequency)
        cout << "| " << setw(11) << pair.first << " | " << setw(20) << pair.second << " |\n";
    cout << "----------------------------------------\n";
    cout << "\nTotal Number of Maximal Cliques: " << totalMaximalCliques << endl;
    cout << "\nProgram execution finished.\n";
    return 0;
}