#include <iostream>

using namespace std;

bool sumCheckCombinations(int A, int B, int C);
bool sumCheck(int A, int B, int C);

int main() {
    uint A, B, C;

    cin >> A >> B >> C;

    if (sumCheckCombinations(A, B, C)) cout << 1 << endl;
    else cout << 0 << endl;
}

bool sumCheckCombinations(int A, int B, int C) {
    if (sumCheck(A, B, C)) return true;
    if (sumCheck(A, C, B)) return true;
    if (sumCheck(B, A, C)) return true;
    if (sumCheck(B, C, A)) return true;
    if (sumCheck(C, A, B)) return true;
    if (sumCheck(C, B, A)) return true;
    return false;
}

bool sumCheck(int A, int B, int C) {
    return (A + B) == C;
}
