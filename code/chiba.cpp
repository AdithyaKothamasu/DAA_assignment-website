#include <algorithm>
#include <iostream>
#include <fstream>
#include <ctime>
#include <vector>
#include <unordered_set>
#include <unordered_map>
#include <iomanip>

using namespace std;

unordered_map<int, int> origVertexMap;

string dataFile = "email-enron.txt";

int maxCliqueSize = 0;
int totalCliqueCount = 0;
int numVertices;  

vector<int> vecA, vecB, currentClique; 
vector<unordered_set<int>> neighborList;  
unordered_map<int, int> cliqueSizeDist;

void exploreClique(int currIndex) {
    
    if (currIndex == numVertices) {  
        totalCliqueCount++;
        cout << "." << totalCliqueCount << endl;
        int cliqueSize = count(currentClique.begin(), currentClique.end(), 1);
        maxCliqueSize = max(maxCliqueSize, cliqueSize);
        if(cliqueSizeDist.find(cliqueSize) == cliqueSizeDist.end()){
            cliqueSizeDist[cliqueSize] = 1;
        }
        else{
            cliqueSizeDist[cliqueSize]++;
        }
        return;
    }
    
    vector<int> nonAdjInClique, adjInClique;
    for (int j = 0; j < numVertices; j++) {
        if (currentClique[j] == 1 && neighborList[currIndex].find(j) == neighborList[currIndex].end()) {
            nonAdjInClique.push_back(j);
        }
    }
    for (int j : neighborList[currIndex]) {
        if (currentClique[j] == 1) {
            adjInClique.push_back(j);
        }
    }
    
    if (!nonAdjInClique.empty()) {
        exploreClique(currIndex + 1);
    }
    
    
    for (int x : adjInClique) {
        for (int y : neighborList[x]) {
            if (currentClique[y] == 0 && y != currIndex) {
                vecB[y]++;
            }
        }
    }


    for (int x : nonAdjInClique) {
        for (int y : neighborList[x]) {
            if (currentClique[y] == 0) {
                vecA[y]++;
            }
        }
    }
    

    int validFlag = 1;
    

    for (int y : neighborList[currIndex]) {
        if (currentClique[y] == 0 && y < currIndex && vecB[y] == adjInClique.size()) {
            validFlag = 0;
            break;
        }
    }
    

    long long nonAdjCount = nonAdjInClique.size();
    sort(nonAdjInClique.begin(), nonAdjInClique.end());
    

    for (int k = 0; k < nonAdjCount; k++) {
        for (int y : neighborList[nonAdjInClique[k]]) {
            if (currentClique[y] == 0 && y < currIndex && vecB[y] == adjInClique.size()) {
                if (y >= nonAdjInClique[k]) {
                    vecA[y]--;
                } else {
                    if (k == 0 || y >= nonAdjInClique[k - 1]) {
                        if (vecA[y] + k == nonAdjCount) {
                            if (k > 0 && y >= nonAdjInClique[k - 1]) {
                                validFlag = 0;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    

    if (!adjInClique.empty() && nonAdjCount != 0) {
        for (int y = 0; y < numVertices; y++) {
            if (currentClique[y] == 0 && y < currIndex && vecB[y] == adjInClique.size() && vecA[y] == 0) {
                if (nonAdjInClique[nonAdjCount - 1] < y) {
                    validFlag = 0;
                    break;
                }
            }
        }
    } else if (nonAdjCount != 0 && nonAdjInClique[nonAdjCount - 1] < currIndex - 1) {
        validFlag = 0;
    }
    

    for (int x : adjInClique) {
        for (int y : neighborList[x]) {
            if (currentClique[y] == 0 && y != currIndex) {
                vecB[y] = 0;
            }
        }
    }

    for (int x : nonAdjInClique) {
        for (int y : neighborList[x]) {
            if (currentClique[y] == 0) {
                vecA[y] = 0;
            }
        }
    }
    

    if (validFlag) {
        for (int x : adjInClique) {
            currentClique[x] = 2;
        }
        currentClique[currIndex] = 2;
        for (int j = 0; j < numVertices; j++) {
            if (currentClique[j] == 1) currentClique[j] = 0;
            if (currentClique[j] == 2) currentClique[j] = 1;
        }
        exploreClique(currIndex + 1);
        currentClique[currIndex] = 0;
        for (int x : nonAdjInClique) {
            currentClique[x] = 1;
        }
    }
}

int main() {
    clock_t startTime = clock();
    
    ifstream inFile(dataFile);
    inFile >> numVertices;
    int numEdges;
    inFile >> numEdges;
    

    unordered_map<int, unordered_set<int>> tempNeighbors;
    for (int i = 0; i < numEdges; i++) {
        int a, b;
        inFile >> a >> b;
        tempNeighbors[a].insert(b);
        tempNeighbors[b].insert(a);
    }
    inFile.close();
    
    // Sort vertices by degree
    vector<pair<int, unordered_set<int>>> vertexVec(tempNeighbors.begin(), tempNeighbors.end());
    sort(vertexVec.begin(), vertexVec.end(), [](const auto& p1, const auto& p2) {
        return p1.second.size() < p2.second.size();
    });
    
    tempNeighbors.clear();
    numVertices = vertexVec.size();  
    
    unordered_map<int, int> newIndex;
    long long counter = 0;
    for (int i = 0; i < vertexVec.size(); i++) {
        newIndex[vertexVec[i].first] = counter++;
    }
    
    for (auto pair : newIndex) {
        origVertexMap[pair.second] = pair.first;
    }
    
    // Create the adjacency list using the new vertex numbering
    neighborList.assign(numVertices, unordered_set<int>());
    for (int i = 0; i < vertexVec.size(); i++) {
        for (int neighbor : vertexVec[i].second) {
            neighborList[newIndex[vertexVec[i].first]].insert(newIndex[neighbor]);
        }
    }
    
    vertexVec.clear();
    
    // Initialize helper vectors
    vecA.assign(numVertices, 0);
    vecB.assign(numVertices, 0);
    currentClique.assign(numVertices, 0);
    currentClique[0] = 1;
    
    printf("Initialization complete, starting clique exploration\n");
    exploreClique(1);
    
    clock_t endTime = clock();
    double elapsedTime = double(endTime - startTime) / CLOCKS_PER_SEC;
    
    // Print summary table
    cout << "+--------------------------+---------------------------+" << endl;
    cout << "|         Metric           |          Value            |" << endl;
    cout << "+--------------------------+---------------------------+" << endl;
    cout << "| Maximum clique size      | " << setw(25) << maxCliqueSize << " |" << endl;
    cout << "| Total maximal cliques    | " << setw(25) << totalCliqueCount << " |" << endl;
    cout << "| Execution Time (seconds) | " << setw(25) << elapsedTime << " |" << endl;
    cout << "+--------------------------+---------------------------+" << endl << endl;

    // Print clique size distribution table
    cout << "+---------------+---------+" << endl;
    cout << "| Clique Size   | Count   |" << endl;
    cout << "+---------------+---------+" << endl;
    for (auto entry : cliqueSizeDist) {
        cout << "| " << setw(13) << entry.first << " | " << setw(7) << entry.second << " |" << endl;
    }
    cout << "+---------------+---------+" << endl;

    return 0;
}