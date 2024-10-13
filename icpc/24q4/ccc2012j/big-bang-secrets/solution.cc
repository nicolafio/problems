#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>

using namespace std;

vector<char> chars({
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
});

int main() {
    int K;
    string word;

    cin >> K >> word;

    unordered_map<char, int> charIndex;

    for (int i = 0; i < chars.size(); i++) {
        charIndex.emplace(chars[i], i);
    }

    for (int i = 0; i < word.size(); i++) {
        char encoded = word[i];
        char P = i + 1;
        char S = 3 * P + K;

        int j = charIndex[encoded];
        int k = (j + chars.size() - S) % chars.size();
        char decoded = chars[k];

        cout << decoded;
    }

    cout << endl;

    return 0;
}
