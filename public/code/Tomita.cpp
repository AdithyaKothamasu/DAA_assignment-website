#include <iostream>
#include <vector>
#include <unordered_map>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <iomanip>
#include <chrono>

using namespace std;
using namespace chrono;

vector<int> currentClique;
unordered_map<int, int> size_to_count;
int totalCliques = 0;
int largestCliqueSize = 0;

template <typename T>
void printTableRow(T a, T b) {
    cout << "| " << setw(10) << a << " | " << setw(15) << b << " |\n";
}

void expand(const vector<int>& subgraph, vector<int> candidates,
            const unordered_map<int, vector<int>>& adjacencyList, int maxVertex) {
    
    if (subgraph.empty()) {
        int size = currentClique.size();
        size_to_count[size]++;
        totalCliques++;
        largestCliqueSize = max(largestCliqueSize, size);
        return;
    } else {
        vector<bool> isCandidate(maxVertex + 1, false);
        for (int cand : candidates)
            isCandidate[cand] = true;

        int pivot = -1;
        int maxDegree = -1;
        for (int cand : candidates) {
            int deg = 0;
            if (adjacencyList.find(cand) != adjacencyList.end()) {
                for (int neigh : adjacencyList.at(cand)) {
                    if (neigh <= maxVertex && isCandidate[neigh])
                        deg++;
                }
            }
            if (deg > maxDegree) {
                maxDegree = deg;
                pivot = cand;
            }
        }
        if (pivot == -1 && !candidates.empty())
            pivot = candidates.front();

        vector<int> extendU;
        vector<bool> pivotNeighbor(maxVertex + 1, false);
        if (adjacencyList.find(pivot) != adjacencyList.end()) {
            for (int neigh : adjacencyList.at(pivot)) {
                if (neigh <= maxVertex)
                    pivotNeighbor[neigh] = true;
            }
        }
        for (int cand : candidates) {
            if (!pivotNeighbor[cand])
                extendU.push_back(cand);
        }

        for (int q : extendU) {
            currentClique.push_back(q);

            vector<int> newSubgraph;
            if (adjacencyList.find(q) != adjacencyList.end()) {
                vector<bool> isNeighbor(maxVertex + 1, false);
                for (int neigh : adjacencyList.at(q))
                    if (neigh <= maxVertex)
                        isNeighbor[neigh] = true;
                for (int vertex : subgraph) {
                    if (isNeighbor[vertex])
                        newSubgraph.push_back(vertex);
                }
            }

            vector<int> newCandidates;
            if (adjacencyList.find(q) != adjacencyList.end()) {
                vector<bool> isNeighbor(maxVertex + 1, false);
                for (int neigh : adjacencyList.at(q))
                    if (neigh <= maxVertex)
                        isNeighbor[neigh] = true;
                for (int vertex : candidates) {
                    if (isNeighbor[vertex])
                        newCandidates.push_back(vertex);
                }
            }

            expand(newSubgraph, newCandidates, adjacencyList, maxVertex);

            currentClique.pop_back();
            candidates.erase(remove(candidates.begin(), candidates.end(), q), candidates.end());
        }
    }
}

void CLIQUES(const string& filename) {
    ifstream file(filename);
    if (!file) {
        cerr << "Error: Unable to open file " << filename << "\n";
        exit(1);
    }

    unordered_map<int, vector<int>> adjacencyList;
    vector<int> vertices;
    int maxVertex = 0;

    string line;
    while (getline(file, line)) {
        if (line.empty() || line[0] == '#') continue;
        stringstream ss(line);
        int u, v;
        if (!(ss >> u >> v)) continue;
        if (u == v) continue;

        adjacencyList[u].push_back(v);
        adjacencyList[v].push_back(u);
        vertices.push_back(u);
        vertices.push_back(v);
        maxVertex = max(maxVertex, max(u, v));
    }

    file.close();

    sort(vertices.begin(), vertices.end());
    vertices.erase(unique(vertices.begin(), vertices.end()), vertices.end());

    for (auto& entry : adjacencyList) {
        sort(entry.second.begin(), entry.second.end());
        entry.second.erase(unique(entry.second.begin(), entry.second.end()), entry.second.end());
    }

    expand(vertices, vertices, adjacencyList, maxVertex);
}

int main() {
    auto start = high_resolution_clock::now();

    string filename = "Email-Enron.txt";
    CLIQUES(filename);

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