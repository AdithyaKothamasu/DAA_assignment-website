#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <algorithm>
#include <chrono>
#include <cmath>
#include <set>
#include <fstream>
using namespace std;

// --- StreamLink + NetworkFlow with altered capacity type ---
struct StreamLink {
    int dest, mirror;
    double limit;
    StreamLink(int _dest, int _mirror, double _limit)
        : dest(_dest), mirror(_mirror), limit(_limit) {}
};

class NetworkFlow {
public:
    vector<vector<StreamLink>> connections;
    vector<int> depth, currentLink;
    NetworkFlow(int capacity)
        : connections(capacity), depth(capacity), currentLink(capacity) {}

    void attachLink(int src, int tgt, double vol) {
        connections[src].emplace_back(tgt, (int)connections[tgt].size(), vol);
        connections[tgt].emplace_back(src, (int)connections[src].size() - 1, 0.0);
    }

    bool constructLayers(int origin, int endpoint) {
        fill(depth.begin(), depth.end(), -1);
        queue<int> pending;
        depth[origin] = 0;
        pending.push(origin);
        while (!pending.empty()) {
            int curr = pending.front(); pending.pop();
            for (auto &lnk : connections[curr]) {
                if (lnk.limit > 1e-9 && depth[lnk.dest] < 0) {
                    depth[lnk.dest] = depth[curr] + 1;
                    pending.push(lnk.dest);
                }
            }
        }
        return depth[endpoint] >= 0;
    }

    double pushVolume(int curr, int endpoint, double volume) {
        if (curr == endpoint || volume < 1e-9) return volume;
        for (int &idx = currentLink[curr]; idx < (int)connections[curr].size(); ++idx) {
            StreamLink &lnk = connections[curr][idx];
            if (lnk.limit > 1e-9 && depth[lnk.dest] == depth[curr] + 1) {
                double transferred = pushVolume(lnk.dest, endpoint, min(volume, lnk.limit));
                if (transferred > 1e-9) {
                    lnk.limit -= transferred;
                    connections[lnk.dest][lnk.mirror].limit += transferred;
                    return transferred;
                }
            }
        }
        return 0.0;
    }

    double calculateMaxFlow(int origin, int endpoint) {
        double aggregate = 0;
        while (constructLayers(origin, endpoint)) {
            fill(currentLink.begin(), currentLink.end(), 0);
            while (double transferred = pushVolume(origin, endpoint, 1e18))
                aggregate += transferred;
        }
        return aggregate;
    }
};

// --- Global storage for network and (h-1)-groupings ---
int totalPoints, totalLinks, groupSize;
vector<vector<int>> networkMap;
vector<vector<int>> partialGroups, groupExpansions;
unordered_map<string, int> groupIdentifier;
vector<int> pointGroupTally;
unordered_map<int, int> rawToMapped;
vector<int> mappedToRaw;

// Generate a unique identifier for a sorted group
string createTag(const vector<int>& grp) {
    string tag;
    tag.reserve(grp.size() * 4);
    for (int pt : grp) {
        tag += to_string(pt);
        tag.push_back(';');
    }
    return tag;
}

// Check if point connects to all in group
bool connectsToEntire(int pt, const vector<int>& grp) {
    for (int mem : grp) {
        if (!binary_search(networkMap[pt].begin(), networkMap[pt].end(), mem))
            return false;
    }
    return true;
}

// Recursive search to list all (h-1)-groups and their expansions
void exploreGroups(vector<int>& active, int rem, int begin) {
    if (rem == 0) {
        string tag = createTag(active);
        if (!groupIdentifier.count(tag)) {
            int seq = (int)partialGroups.size();
            groupIdentifier[tag] = seq;
            partialGroups.push_back(active);
            vector<int> expands;
            for (int pt = 0; pt < totalPoints; ++pt) {
                if (!binary_search(active.begin(), active.end(), pt)
                    && connectsToEntire(pt, active)) {
                    expands.push_back(pt);
                }
            }
            groupExpansions.push_back(move(expands));
        }
        return;
    }
    for (int idx = begin; idx < totalPoints; ++idx) {
        if (connectsToEntire(idx, active)) {
            active.push_back(idx);
            exploreGroups(active, rem - 1, idx + 1);
            active.pop_back();
        }
    }
}

// Construct all (h-1)-groups and their expansions
void gatherPartialGroups() {
    partialGroups.clear();
    groupExpansions.clear();
    groupIdentifier.clear();
    if (groupSize == 2) {
        for (int pt = 0; pt < totalPoints; ++pt) {
            partialGroups.push_back({pt});
            groupExpansions.push_back(networkMap[pt]);
        }
    } else {
        vector<int> temp;
        exploreGroups(temp, groupSize - 1, 0);
    }
}

// Tally each point's participation in h-groups
void tallyPointGroups() {
    pointGroupTally.assign(totalPoints, 0);
    for (int idx = 0; idx < (int)partialGroups.size(); ++idx) {
        for (int mem : partialGroups[idx]) {
            pointGroupTally[mem] += (int)groupExpansions[idx].size();
        }
        for (int ext : groupExpansions[idx]) {
            pointGroupTally[ext]++;
        }
    }
}

// Layer decomposition based on pointGroupTally
vector<int> determineLayerSequence() {
    vector<int> layerValue = pointGroupTally;
    vector<char> excluded(totalPoints, 0);
    vector<int> sequence(totalPoints, 0);

    for (int cycle = 0; cycle < totalPoints; ++cycle) {
        int target = -1;
        for (int idx = 0; idx < totalPoints; ++idx) {
            if (!excluded[idx] && (target < 0 || layerValue[idx] < layerValue[target]))
                target = idx;
        }
        excluded[target] = 1;
        sequence[target] = layerValue[target];

        for (int idx = 0; idx < (int)partialGroups.size(); ++idx) {
            auto &grp = partialGroups[idx];
            if (binary_search(grp.begin(), grp.end(), target)) {
                for (int mem : grp) {
                    if (!excluded[mem]) --layerValue[mem];
                }
                for (int ext : groupExpansions[idx]) {
                    if (!excluded[ext]) --layerValue[ext];
                }
            }
        }
    }
    return sequence;
}

// --- Primary: CoreExact search via binary range + flow ---
int main(int argc, char* argv[]) {
    if (argc != 2) {
        cerr << "Usage: " << argv[0] << " <data_file>\n";
        return 1;
    }
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    ifstream inputFile(argv[1]);
    inputFile >> totalPoints >> totalLinks >> groupSize;
    vector<pair<int, int>> connections(totalLinks);
    set<int> identifiers;
    for (int idx = 0; idx < totalLinks; ++idx) {
        int src, dst;
        inputFile >> src >> dst;
        connections[idx] = {src, dst};
        identifiers.insert(src);
        identifiers.insert(dst);
    }
    inputFile.close();

    mappedToRaw.reserve(identifiers.size());
    for (int val : identifiers) {
        rawToMapped[val] = (int)mappedToRaw.size();
        mappedToRaw.push_back(val);
    }
    totalPoints = (int)mappedToRaw.size();
    networkMap.assign(totalPoints, {});
    for (auto &lnk : connections) {
        int src = rawToMapped[lnk.first], dst = rawToMapped[lnk.second];
        networkMap[src].push_back(dst);
        networkMap[dst].push_back(src);
    }
    for (int idx = 0; idx < totalPoints; ++idx) {
        sort(networkMap[idx].begin(), networkMap[idx].end());
    }
    cerr << "Processed " << totalPoints
         << " points, " << totalLinks
         << " connections, h=" << groupSize << "\n";

    gatherPartialGroups();
    tallyPointGroups();
    vector<int> layerSequence = determineLayerSequence();
    int maxLayer = *max_element(layerSequence.begin(), layerSequence.end());

    double lowerLimit = double(maxLayer) / groupSize;
    double upperLimit = maxLayer;
    vector<int> optimalSubset;
    double precision = 1.0 / (totalPoints * (groupSize - 1));

    auto startTime = chrono::high_resolution_clock::now();

    while (upperLimit - lowerLimit > precision) {
        double threshold = (lowerLimit + upperLimit) / 2;

        int origin = 0;
        int basePt = 1;
        int groupBase = basePt + totalPoints;
        int terminal = groupBase + (int)partialGroups.size();
        NetworkFlow NF(terminal + 1);

        for (int pt = 0; pt < totalPoints; ++pt) {
            NF.attachLink(origin, basePt + pt, pointGroupTally[pt]);
            NF.attachLink(basePt + pt, terminal, threshold * groupSize);
        }
        for (int idx = 0; idx < (int)partialGroups.size(); ++idx) {
            int grpNode = groupBase + idx;
            for (int mem : partialGroups[idx]) {
                NF.attachLink(grpNode, basePt + mem, 1e9);
            }
            for (int ext : groupExpansions[idx]) {
                NF.attachLink(basePt + ext, grpNode, 1.0);
            }
        }

        NF.calculateMaxFlow(origin, terminal);

        vector<char> accessible(terminal + 1, 0);
        queue<int> pending;
        accessible[origin] = 1;
        pending.push(origin);
        while (!pending.empty()) {
            int curr = pending.front(); pending.pop();
            for (auto &lnk : NF.connections[curr]) {
                if (lnk.limit > 1e-9 && !accessible[lnk.dest]) {
                    accessible[lnk.dest] = 1;
                    pending.push(lnk.dest);
                }
            }
        }

        vector<int> activeSet;
        for (int pt = 0; pt < totalPoints; ++pt) {
            if (accessible[basePt + pt]) activeSet.push_back(pt);
        }

        if (activeSet.empty()) {
            upperLimit = threshold;
        } else {
            lowerLimit = threshold;
            if (activeSet.size() > optimalSubset.size()) {
                optimalSubset.swap(activeSet);
            }
        }
    }

    set<vector<int>> distinctGroups;
    set<int> inOptimal(optimalSubset.begin(), optimalSubset.end());
    for (int idx = 0; idx < (int)partialGroups.size(); ++idx) {
        auto &grp = partialGroups[idx];
        if (!all_of(grp.begin(), grp.end(),
                    [&](int pt){ return inOptimal.count(pt); }))
            continue;
        for (int ext : groupExpansions[idx]) {
            if (inOptimal.count(ext)) {
                vector<int> complete = grp;
                complete.push_back(ext);
                sort(complete.begin(), complete.end());
                distinctGroups.insert(complete);
            }
        }
    }
    double compactness = optimalSubset.empty()
                        ? 0.0
                        : double(distinctGroups.size()) / optimalSubset.size();

    auto endTime = chrono::high_resolution_clock::now();
    double elapsed = chrono::duration<double>(endTime - startTime).count();

    cout << "Largest dense subset size: " << optimalSubset.size() << "\n"
         << "Compactness: " << compactness << "\n"
         << "Time taken: " << elapsed << " s\n"
         << "Points:";
    for (int pt : optimalSubset) {
        cout << " " << mappedToRaw[pt];
    }
    cout << "\n";
    return 0;
}
