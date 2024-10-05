#include <iostream>

using namespace std;

int getFineDollars(int speed, int limit) {
    int over = speed - limit;
    if (over <= 20) return 100;
    if (over <= 30) return 270;
    return 500;
}

int main() {
    int speed, limit;

    cin >> limit >> speed;

    if (speed > limit) {
        int dollars = getFineDollars(speed, limit);
        cout << "You are speeding and your fine is $" << dollars << "." << endl;
    }
    else {
        cout << "Congratulations, you are within the speed limit!" << endl;
    }

    return 0;
}
