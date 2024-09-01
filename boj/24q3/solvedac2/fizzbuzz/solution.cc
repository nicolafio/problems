#include <iostream>
#include <string>

using namespace std;

int main() {
    string line1;
    string line2;
    string line3;
    string last = "";
    string secondLast = "";
    string thirdLast = "";

    cin >> line1 >> line2 >> line3;

    for (unsigned long int i = 1; i <= 100000000; i++) {
        string current = "";

        bool multipleOf5 = i % 5 == 0;
        bool multipleOf3 = i % 3 == 0;
        
        if (multipleOf3 && multipleOf5)
            current = "FizzBuzz";
        
        if (multipleOf3 && !multipleOf5)
            current = "Fizz";
        
        if (!multipleOf3 && multipleOf5)
            current = "Buzz";
        
        if (!multipleOf3 && !multipleOf5)
            current = to_string(i);

        if (thirdLast == line1 &&
            secondLast == line2 &&
            last == line3) {
                cout << current << endl;
            }

        thirdLast = secondLast;
        secondLast = last;
        last = current;
    }
}
