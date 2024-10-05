#include <iostream>
#include <cmath>

using namespace std;

int main() {
    int n;

    cin >> n;

    int u = n / 4;
    int d = (n * 100) / 4 - (u * 100);

    cout << u << "." << d << "\n";

    return 0;
}