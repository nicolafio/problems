#include <iostream>

using namespace std;

int main() {
    int T, N;

    cin >> T;

    for (int i = 0; i < T; i++) {
        cin >> N;

        for (int j = 0; j < N; j++) {
            int a, b;

            cin >> a >> b;

            cout << (a + b) << " " << (a * b) << endl;
        }
    }
}
