#include <iostream>
#include <string>
#include <vector>

using namespace std;

void runCase() {
    int n;

    cin >> n;

    int x[n];
    int y[n];
    bool dead[n];

    for (int i = 0; i < n; i++) {
        cin >> x[i] >> y[i];
        dead[i] = false;
    }

    int m;

    cin >> m;

    int hits = 0;

    for (int j = 0; j < m; j++) {
        int ax, ay;
        cin >> ax >> ay;
        for (int i = 0; i < n; i++) {
            if (dead[i]) continue;
            if (x[i] >= ax - 50 && x[i] <= ax + 50 &&
                y[i] >= ay - 50 && y[i] <= ay + 50) {
                hits++;
                dead[i] = true;
            }
        }
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
