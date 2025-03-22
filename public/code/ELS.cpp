#include <bits/stdc++.h>
#include <chrono>
using namespace std;
using namespace std::chrono;

map<int, unordered_set<int>> adj;
vector<vector<int>> adj_list;
vector<int> order;

unordered_map<int, int> cliqueCount; // Stores count of maximal cliques of each size

void loadGraph(const string& filename) {
    ifstream file(filename);
    if (!file) {
        cerr << "Error: Unable to open file " << filename << "\n";
        exit(1);
    }
    string line;
    while (getline(file, line)) {
        stringstream ss(line);
        int u, v;
        if (!(ss >> u)) continue;
        while (ss >> v) {
            if (u != v) {
                adj[u].insert(v);
                adj[v].insert(u);
            }
        }
    }
    file.close();
}

void convertToAdjList() {
    unordered_map<int, int> node_index;
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
    
    for (auto &neighbors : adj_list)
        sort(neighbors.begin(), neighbors.end());
}

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
        while (i < buckets.size() && buckets[i].empty()) i++;
        if (i >= buckets.size()) break;

        int v = buckets[i].front();
        buckets[i].pop_front();
        removed[v] = true;
        order.push_back(v);
        degeneracy = max(degeneracy, i);

        for (int u : adj_list[v]) {
            if (!removed[u]) {
                int oldDeg = d[u];
                buckets[oldDeg].erase(pos[u]);
                d[u]--;
                buckets[d[u]].push_back(u);
                pos[u] = --buckets[d[u]].end();
            }
        }
    }
}

void BronKerboschRecursionInPlace(vector<int> &P, vector<int> &R, vector<int> &X) {
    if (P.empty() && X.empty()) {
        cliqueCount[R.size()]++;
        return;
    }

    int pivot = (!P.empty()) ? P[0] : X[0];

    vector<int> P_not;
    size_t i = 0, j = 0;
    while (i < P.size() && j < adj_list[pivot].size()) {
        if (P[i] < adj_list[pivot][j])
            P_not.push_back(P[i++]);
        else if (P[i] > adj_list[pivot][j])
            j++;
        else {
            i++;
            j++;
        }
    }
    while (i < P.size()) P_not.push_back(P[i++]);

    for (int v : P_not) {
        auto it = find(P.begin(), P.end(), v);
        if (it != P.end())
            P.erase(it);

        R.push_back(v);

        vector<int> newP, newX;
        i = 0, j = 0;
        while (i < P.size() && j < adj_list[v].size()) {
            if (P[i] < adj_list[v][j]) i++;
            else if (P[i] > adj_list[v][j]) j++;
            else {
                newP.push_back(P[i]);
                i++;
                j++;
            }
        }
        i = 0, j = 0;
        while (i < X.size() && j < adj_list[v].size()) {
            if (X[i] < adj_list[v][j]) i++;
            else if (X[i] > adj_list[v][j]) j++;
            else {
                newX.push_back(X[i]);
                i++;
                j++;
            }
        }

        BronKerboschRecursionInPlace(newP, R, newX);

        R.pop_back();
        X.push_back(v);
        sort(X.begin(), X.end());
    }
}

void BronKerboschDegeneracyGlobal() {
    int degeneracy;
    DO(degeneracy);
    int n = order.size();
    
    for (int i = 0; i < n; i++) {
        if (i % 1000 == 0) // Print progress every 1000 vertices processed
            cout << "Processing vertex " << i + 1 << " of " << n << "..." << endl;

        int v = order[i];

        vector<int> P, X, R = {v};
        for (int j = i + 1; j < n; j++) {
            if (binary_search(adj_list[v].begin(), adj_list[v].end(), order[j]))
                P.push_back(order[j]);
        }

        for (int j = 0; j < i; j++) {
            if (binary_search(adj_list[v].begin(), adj_list[v].end(), order[j]))
                X.push_back(order[j]);
        }

        BronKerboschRecursionInPlace(P, R, X);
    }
}

int main() {
    cout << "Program started..." << endl;
    
    //give a dataset file name
    string filename = "Wiki-Vote.txt";
    cout << "Loading graph from " << filename << "...\n";
    loadGraph(filename);
    convertToAdjList();
    cout << "Graph loaded successfully. Starting Bron-Kerbosch algorithm...\n";

    auto start = steady_clock::now();
    BronKerboschDegeneracyGlobal();
    auto end = steady_clock::now();
    double duration = duration_cast<milliseconds>(end - start).count();

    cout << "\n--- Maximal Clique Size Distribution ---\n";
    cout << "----------------------------------------\n";
    cout << "| Clique Size | Number of Cliques       |\n";
    cout << "----------------------------------------\n";
    for (const auto &pair : cliqueCount)
        cout << "| " << setw(11) << pair.first << " | " << setw(20) << pair.second << " |\n";
    cout << "----------------------------------------\n";

    cout << "\nExecution Time: " << duration << " ms\n";
    cout << "Program finished execution." << endl;

    return 0;
}
