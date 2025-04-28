#include <iostream>
#include <fstream>
#include <vector>
#include <queue>
#include <algorithm>
#include <unordered_map>
#include <unordered_set>
#include <set>
#include <chrono>
#include <limits>
#include <cmath>

using namespace std;

// --------- Flow Network (Dinic's Algorithm) ---------
struct FlowEdge {
    int to, rev;
    double capacity;
    FlowEdge(int destination, int reverseIndex, double cap)
        : to(destination), rev(reverseIndex), capacity(cap) {}
};

class FlowNetwork {
public:
    explicit FlowNetwork(int nodes) : N(nodes), adj(nodes), level(nodes), ptr(nodes) {}

    void add(int u, int v, double c) {
        adj[u].emplace_back(v, adj[v].size(), c);
        adj[v].emplace_back(u, adj[u].size() - 1, 0.0);
    }

    double computeMaxFlow(int src, int tgt, vector<int>& reachable) {
        double totalFlow = 0;
        while (buildLevelGraph(src, tgt)) {
            fill(ptr.begin(), ptr.end(), 0);
            double pushed;
            while ((pushed = sendFlow(src, tgt, 1e18)) > 1e-9) {
                totalFlow += pushed;
            }
        }
        identifyMinCut(src, reachable);
        return totalFlow;
    }

private:
    int N;
    vector<vector<FlowEdge>> adj;
    vector<int> level, ptr;

    bool buildLevelGraph(int src, int tgt) {
        fill(level.begin(), level.end(), -1);
        queue<int> q;
        q.push(src);
        level[src] = 0;

        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (const auto& edge : adj[u]) {
                if (edge.capacity > 1e-9 && level[edge.to] == -1) {
                    level[edge.to] = level[u] + 1;
                    q.push(edge.to);
                }
            }
        }
        return level[tgt] != -1;
    }

    double sendFlow(int u, int tgt, double pushed) {
        if (u == tgt || pushed == 0.0) return pushed;
        for (int& cid = ptr[u]; cid < adj[u].size(); ++cid) {
            FlowEdge& e = adj[u][cid];
            if (e.capacity > 1e-9 && level[e.to] == level[u] + 1) {
                double flow = sendFlow(e.to, tgt, min(pushed, e.capacity));
                if (flow > 1e-9) {
                    e.capacity -= flow;
                    adj[e.to][e.rev].capacity += flow;
                    return flow;
                }
            }
        }
        return 0;
    }

    void identifyMinCut(int src, vector<int>& reachable) {
        vector<bool> visited(N, false);
        queue<int> q;
        q.push(src);
        visited[src] = true;

        while (!q.empty()) {
            int u = q.front(); q.pop();
            reachable.push_back(u);
            for (const auto& edge : adj[u]) {
                if (edge.capacity > 1e-9 && !visited[edge.to]) {
                    visited[edge.to] = true;
                    q.push(edge.to);
                }
            }
        }
    }
};

// --------- Graph and Clique Handling ---------
vector<vector<int>> graph;
vector<vector<int>> almostCliques;
vector<vector<int>> cliqueCandidates;
unordered_map<string, int> cliqueID;
unordered_map<int, int> labelToID;
vector<int> idToLabel;
vector<int> vertexDegree;
int vertexCount, edgeCount, h;

// --------- Helper Functions ---------
string serializeClique(const vector<int>& clique) {
    string s;
    for (int v : clique) {
        s += to_string(v) + "_";
    }
    return s;
}

bool isValidExtension(int v, const vector<int>& curr) {
    for (int u : curr) {
        if (!binary_search(graph[v].begin(), graph[v].end(), u))
            return false;
    }
    return true;
}

void expandCliques(vector<int>& temp, int remaining, int nextVertex) {
    if (remaining == 0) {
        string key = serializeClique(temp);
        if (cliqueID.find(key) == cliqueID.end()) {
            cliqueID[key] = almostCliques.size();
            almostCliques.push_back(temp);
            vector<int> extensions;
            for (int v = 0; v < vertexCount; ++v) {
                if (find(temp.begin(), temp.end(), v) == temp.end() && isValidExtension(v, temp)) {
                    extensions.push_back(v);
                }
            }
            cliqueCandidates.push_back(extensions);
        }
        return;
    }

    for (int i = nextVertex; i < vertexCount; ++i) {
        if (isValidExtension(i, temp)) {
            temp.push_back(i);
            expandCliques(temp, remaining - 1, i + 1);
            temp.pop_back();
        }
    }
}

void findHMinus1Cliques() {
    almostCliques.clear();
    cliqueCandidates.clear();
    cliqueID.clear();
    vector<int> temp;
    expandCliques(temp, h - 1, 0);
}

void calculateVertexDegrees() {
    vertexDegree.assign(vertexCount, 0);
    for (size_t i = 0; i < almostCliques.size(); ++i) {
        for (int v : cliqueCandidates[i]) {
            vertexDegree[v]++;
            for (int u : almostCliques[i]) {
                vertexDegree[u]++;
            }
        }
    }
}

// --------- I/O and Graph Setup ---------
void readGraph(const string& filename) {
    ifstream in(filename);
    if (!in) {
        cerr << "Failed to open " << filename << endl;
        exit(1);
    }

    in >> vertexCount >> edgeCount >> h;
    unordered_set<int> labels;
    vector<pair<int, int>> edges;

    while (!in.eof()) {
        int u, v;
        in >> u >> v;
        edges.emplace_back(u, v);
        labels.insert(u);
        labels.insert(v);
    }
    in.close();

    int id = 0;
    for (int label : labels) {
        labelToID[label] = id++;
        idToLabel.push_back(label);
    }
    vertexCount = labels.size();
    graph.assign(vertexCount, {});

    for (auto& e : edges) {
        int u = labelToID[e.first];
        int v = labelToID[e.second];
        graph[u].push_back(v);
        graph[v].push_back(u);
    }

    for (auto& neighbors : graph) {
        sort(neighbors.begin(), neighbors.end());
    }

    cout << "Graph loaded with " << vertexCount << " vertices, " << edgeCount << " edges, h = " << h << "\n";
}

// --------- Core Algorithm ---------
double evaluateDensity(const vector<int>& nodes) {
    if (nodes.empty()) return 0.0;

    set<vector<int>> cliques;
    unordered_set<int> subgraph(nodes.begin(), nodes.end());

    for (size_t i = 0; i < almostCliques.size(); ++i) {
        bool contained = true;
        for (int u : almostCliques[i]) {
            if (!subgraph.count(u)) {
                contained = false;
                break;
            }
        }
        if (contained) {
            for (int v : cliqueCandidates[i]) {
                if (subgraph.count(v)) {
                    vector<int> fullClique = almostCliques[i];
                    fullClique.push_back(v);
                    sort(fullClique.begin(), fullClique.end());
                    cliques.insert(fullClique);
                }
            }
        }
    }
    return static_cast<double>(cliques.size()) / nodes.size();
}

vector<int> densestSubgraph() {
    double low = 0.0, high = *max_element(vertexDegree.begin(), vertexDegree.end());
    vector<int> best;

    cout << "Searching density between [" << low << ", " << high << "]\n";

    while (high - low >= 1.0 / (vertexCount * (h - 1))) {
        double alpha = (low + high) / 2;
        int totalVertices = 2 + vertexCount + almostCliques.size();
        int src = 0, sink = 1;

        FlowNetwork net(totalVertices);

        for (int v = 0; v < vertexCount; ++v) {
            net.add(src, 2 + v, vertexDegree[v]);
            net.add(2 + v, sink, alpha * h);
        }

        for (size_t i = 0; i < almostCliques.size(); ++i) {
            int cliqueNode = 2 + vertexCount + i;
            for (int v : almostCliques[i]) {
                net.add(cliqueNode, 2 + v, numeric_limits<double>::max());
            }
            for (int v : cliqueCandidates[i]) {
                net.add(2 + v, cliqueNode, 1.0);
            }
        }

        vector<int> reachable;
        net.computeMaxFlow(src, sink, reachable);

        vector<bool> inS(totalVertices, false);
        for (int v : reachable) {
            inS[v] = true;
        }

        vector<int> subgraph;
        for (int v = 0; v < vertexCount; ++v) {
            if (inS[2 + v]) {
                subgraph.push_back(v);
            }
        }

        if (subgraph.empty()) {
            high = alpha;
        } else {
            low = alpha;
            if (subgraph.size() > best.size()) {
                best = subgraph;
            }
        }
    }

    return best;
}

// --------- Main Driver ---------
int main(int argc, char* argv[]) {
    if (argc != 2) {
        cerr << "Usage: " << argv[0] << " <input_graph_file>\n";
        return 1;
    }

    auto start = chrono::high_resolution_clock::now();

    readGraph(argv[1]);
    findHMinus1Cliques();
    calculateVertexDegrees();

    vector<int> bestNodes = densestSubgraph();
    double finalDensity = evaluateDensity(bestNodes);

    auto end = chrono::high_resolution_clock::now();
    double totalTime = chrono::duration<double>(end - start).count();

    cout << "Time elapsed: " << totalTime << " seconds\n";
    cout << "Subgraph size: " << bestNodes.size() << "\n";
    cout << "Subgraph density: " << finalDensity << "\n";
    cout << "Selected nodes:";
    for (int v : bestNodes) {
        cout << " " << idToLabel[v];
    }
    cout << "\n";

    return 0;
}