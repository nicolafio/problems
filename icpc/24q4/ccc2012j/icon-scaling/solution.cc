#include <iostream>

using namespace std;

char icon[3][3] = {
    {'*', 'x', '*'},
    {' ', 'x', 'x'},
    {'*', ' ', '*'}
};

int main() {
    int k;
    cin >> k;
    for (int i = 0; i < 3; i++) {
        for (int ii = 0; ii < k; ii ++) {
            for (int j = 0; j < 3; j++) {
                for (int jj = 0; jj < k; jj++) {
                    cout << icon[i][j];
                }
            }
            cout << endl;
        }
    }
}
