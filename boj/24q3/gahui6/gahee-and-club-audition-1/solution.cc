#include <iostream>
#include <string>

using namespace std;

int main() {
    int lv;
    string judgment;

    cin >> lv >> judgment;

    int score = 0;

    if (judgment == "miss")
        score = 0; 
    
    if (judgment == "bad")
        score = 200 * lv; 
    
    if (judgment == "cool")
        score = 400 * lv; 
    
    if (judgment == "great")
        score = 600 * lv; 
    
    if (judgment == "perfect")
        score = 1000 * lv; 

    cout << score << endl;
}
