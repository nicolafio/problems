#include <iostream>
#include <string>

using namespace std;

bool isInteger(string str) {
    try {
        stoul(str);
    }
    catch (invalid_argument& _) {
        return false;
    }

    return true;
}

int main() {
    string line1;
    string line2;
    string line3;

    cin >> line1 >> line2 >> line3;

    unsigned long i;

    if (isInteger(line1)) {
        i = stoul(line1) + 3;
    }
    else if (isInteger(line2)) {
        i = stoul(line2) + 2;
    }
    else {
        i = stoul(line3) + 1;
    }

    bool multipleOf5 = i % 5 == 0;
    bool multipleOf3 = i % 3 == 0;
    
    if (multipleOf3 && multipleOf5)
        cout << "FizzBuzz";
    
    if (multipleOf3 && !multipleOf5)
        cout << "Fizz";
    
    if (!multipleOf3 && multipleOf5)
        cout << "Buzz";
    
    if (!multipleOf3 && !multipleOf5)
        cout << to_string(i);

    cout << endl;
}
