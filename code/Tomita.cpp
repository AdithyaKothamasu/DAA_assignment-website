#include <iostream>
#include <vector>
#include <unordered_set>
#include <unordered_map>
#include <fstream>
#include <sstream>
#include <set>
#include <algorithm>
#include <iomanip>
#include <chrono>

using namespace std;
using namespace chrono;

unordered_set<int> currentClique;
unordered_map<int, int> size_to_count;
unordered_set<string> uniqueCliques; // Stores cliques in sorted order
int totalCliques = 0;
int largestCliqueSize = 0;

template <typename T>
void printTableRow(T a, T b) {
    cout << "| " << setw(10) << a << " | " << setw(15) << b << " |\n";
}

void expand(const unordered_set<int>& subgraph, unordered_set<int> candidates,
            const unordered_map<int, unordered_set<int>>& adjacencyList) {
    
    if (subgraph.empty()) {
        vector<int> clique(currentClique.begin(), currentClique.end());
        sort(clique.begin(), clique.end());

        string cliqueString;
        for (int v : clique) cliqueString += to_string(v) + " ";
        
        if (uniqueCliques.find(cliqueString) == uniqueCliques.end()) {
            uniqueCliques.insert(cliqueString);
            
            int size = clique.size();
            size_to_count[size]++;
            totalCliques++;
            largestCliqueSize = max(largestCliqueSize, size);
            
            cout << "Maximal Clique (Size " << size << "): ";
            for (int v : clique) cout << v << " ";
            cout << endl;
        }
    } else {
        int u = *subgraph.begin();
        unordered_set<int> extendU = candidates;

        if (adjacencyList.find(u) != adjacencyList.end()) {
            for (int vertex : adjacencyList.at(u)) {
                extendU.erase(vertex);
            }
        }

        while (!extendU.empty()) {
            int q = *extendU.begin();
            extendU.erase(q);

            currentClique.insert(q);

            unordered_set<int> subgraphQ, candidatesQ;
            for (int vertex : subgraph) {
                if (adjacencyList.count(q) && adjacencyList.at(q).count(vertex)) {
                    subgraphQ.insert(vertex);
                }
            }
            for (int vertex : candidates) {
                if (adjacencyList.count(q) && adjacencyList.at(q).count(vertex)) {
                    candidatesQ.insert(vertex);
                }
            }

            expand(subgraphQ, candidatesQ, adjacencyList);

            candidates.erase(q);
            currentClique.erase(q);
        }
    }
}


void CLIQUES(unordered_set<int>& vertices, vector<pair<int, int>>& edges, const string& filename) {
    ifstream file(filename);
    if (!file) {
        cerr << "Error: Unable to open file " << filename << "\n";
        exit(1);
    }

    string line;
    cout << "Reading file...\n";

    unordered_map<int, unordered_set<int>> adjacencyList;
    while (getline(file, line)) {
        if (line[0] == '#') continue; // Ignore comment lines

        stringstream ss(line);
        int u, v;
        if (!(ss >> u >> v)) continue;

        if (u != v) { // Avoid self-loops
            adjacencyList[u].insert(v);
            adjacencyList[v].insert(u);
            vertices.insert(u);
            vertices.insert(v);
        }
    }

    file.close();
    expand(vertices, vertices, adjacencyList);
}


int main() {
    auto start = high_resolution_clock::now();

    unordered_set<int> vertices;
    vector<pair<int, int>> edges;
    string filename = "Wiki-Vote.txt";
    CLIQUES(vertices, edges, filename);

    auto stop = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(stop - start);

    cout << "\n===== Clique Size Distribution =====\n";
    cout << "+------------+-----------------+\n";
    cout << "| Clique Size | Number of Cliques |\n";
    cout << "+------------+-----------------+\n";
    for (const auto& pair : size_to_count) {
        printTableRow(pair.first, pair.second);
    }
    cout << "+------------+-----------------+\n";

    cout << "\nTotal Number of Cliques: " << totalCliques << endl;
    cout << "Largest Clique Size: " << largestCliqueSize << endl;
    cout << "Execution Time: " << duration.count() << " ms\n";

    return 0;
}
