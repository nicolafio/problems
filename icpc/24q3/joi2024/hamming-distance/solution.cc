#include <iostream>
#include <string>

using namespace std;

int main() {
    uint N;
    string S, T;
    int c = 0;

    cin >> N >> S >> T;

    for (uint i = 0; i < N; i++) {
        if (S[i] != T[i]) {
            c++;
        }
    }

    cout << c << endl;
}
