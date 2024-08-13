#include <iostream>
#include <string>

using namespace std;

int main() {
    int score;
    string grade;

    cin >> score;

    if (score >= 90 && score <= 100)
        grade = "A";
    else if (score >= 80)
        grade = "B";
    else if (score >= 70)
        grade = "C";
    else if (score >= 60)
        grade = "D";
    else
        grade = "F";

    cout << grade << endl;
}
