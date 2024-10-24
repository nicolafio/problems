#include <iostream>
#include <string>
#include <vector>
#include <unordered_set>

using namespace std;

int runCase() {
    int n, k, m;

    cin >> n >> k >> m;

    if (m == 0) {
        cout << 0 << endl;
        return 0;
    }

    vector<unordered_set<int>> contradictions(n);

    for (int k = 0; k < m; k++) {
        int i, j;
        cin >> i >> j;

        i--;
        j--;

        contradictions[i].insert(j);
        contradictions[j].insert(i);
    }

    for (int discarded = 1; discarded <= k; discarded++) {
        int max = 0, worstTheory = -1;
        for (int i = 0; i < n; i++) {
            if (contradictions[i].size() > max) {
                max = contradictions[i].size();
                worstTheory = i;
            }
        }

        if (worstTheory == -1) {
            cerr << "Unexpected state" << endl;
            return 1;
        }

        for (int j : contradictions[worstTheory]) {
            contradictions[j].erase(worstTheory);
        }

        contradictions[worstTheory].clear();

        bool valid = true;

        for (int i = 0; i < n; i++) {
            if (contradictions[i].size() > 0) {
                valid = false;
            }
        }

        if (valid) {
            cout << discarded << endl;
            return 0;
        }
    }

    cout << "IMPOSSIBLE" << endl;
    return 0;
}

int main() {
    int testCasesCount;

    cin >> testCasesCount;

    for (int i = 0; i < testCasesCount; i++) {
        runCase();
    }
}
