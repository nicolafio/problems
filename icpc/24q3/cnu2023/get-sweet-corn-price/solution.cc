#include <iostream>
#include <cmath>

using namespace std;

int main() {
    int B;

    cin >> B;

    float ratio = 1 / 1.1;
    float A = ratio * B;

    cout << round(A) << endl;
}
