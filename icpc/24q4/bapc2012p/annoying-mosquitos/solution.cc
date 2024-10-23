#include <iostream>
#include <string>
#include <vector>

using namespace std;

void runCase() {
    int n;

    cin >> n;

    int x[n];
    int y[n];

    for (int i = 0; i < n; i++) {
        cin >> x[i] >> y[i];
    }

    int m;

    cin >> m;

    int minCoord = -1000;
    int maxCoord = 1000;
    int coordinatesCount = abs(minCoord) + maxCoord + 1;

    bool hit[coordinatesCount][coordinatesCount];

    for (int i = 0; i < coordinatesCount; i++)
        for (int j = 0; j < coordinatesCount; j++)
            hit[i][j] = false;

    for (int j = 0; j < m; j++) {
        int ax, ay;
        cin >> ax >> ay;

        for (int i = 0; i <= 50; i++) {
            for (int ii = 0; ii <= 50; ii++) {
                for (int k = -1; k <= 1; k += 2) {
                    for (int kk = -1; kk <= 1; kk += 2) {
                        int hitX = ax + (i * k);
                        int hitY = ay + (ii * kk);
                        if (hitX < -1000 || hitX > 1000) continue;
                        if (hitY < -1000 || hitY > 1000) continue;
                        hit[hitX + abs(minCoord)][hitY + abs(minCoord)] = true;
                    }
                }
            }
        }
    }

    int hits = 0;

    for (int i = 0; i < n; i++) {
        if (hit[x[i] + abs(minCoord)][y[i] + abs(minCoord)])
            hits++;
    }

    cout << hits << endl;
}

int main() {
    int casesCount;

    cin >> casesCount;

    for (int i = 0; i < casesCount; i++) {
        runCase();
    }
}
