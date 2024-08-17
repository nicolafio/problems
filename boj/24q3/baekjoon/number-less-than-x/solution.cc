#include <iostream>

using namespace std;

int main() {
    int N, X;
    bool first = true;    

    cin >> N >> X;


    for (int i = 0; i < N; i++) {
        int a;

        cin >> a;

        if (a < X) {
            if (!first) {
                cout << " ";
            }

            cout << a;

            first = false;
        }
    }

    cout << endl;

    return 0;
}
