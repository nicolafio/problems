#include <bits/stdc++.h>
#include <fstream>
#include <iostream>

using namespace std;

string ltrim(const string &);
string rtrim(const string &);
vector<string> split(const string &);

bool isMagicSquare(vector<int> t) {
    int magicNumber = t[0] + t[1] + t[2];

    // Check diagonals.
    if ((t[0] + t[4] + t[8]) != magicNumber) return false;
    if ((t[2] + t[4] + t[6]) != magicNumber) return false;

    // Check rows and columns.
    for (int i = 0; i < 3; i++) {
        if ((t[3 * i] + t[3 * i + 1] + t[3 * i + 2]) != magicNumber) return false;
        if ((t[i] + t[3 + i] + t[6 + i]) != magicNumber) return false;  
    }

    return true;
}

int findCost(vector<int> q, vector<int> t) {
    int cost = 0;
    for (int i = 0; i < 9; i++) {
        cost += abs(q[i] - t[i]);
    }
    return cost;
}

/*
 * Complete the 'formingMagicSquare' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts 2D_INTEGER_ARRAY s as parameter.
 */
int formingMagicSquare(vector<vector<int>> s) {
    // Brute force solution.

    int minimumCost = INFINITY;

    vector<int> t{
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
    };

    vector<int> q{
        s[0][0], s[0][1], s[0][2],
        s[1][0], s[1][1], s[1][2],
        s[2][0], s[2][1], s[2][2]
    };

    while (next_permutation(t.begin(), t.end())) {
        if (isMagicSquare(t)) {
            int cost = findCost(q, t);
            if (cost < minimumCost) minimumCost = cost;
        }
    }

    return minimumCost;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    vector<vector<int>> s(3);

    for (int i = 0; i < 3; i++) {
        s[i].resize(3);

        string s_row_temp_temp;
        getline(cin, s_row_temp_temp);

        vector<string> s_row_temp = split(rtrim(s_row_temp_temp));

        for (int j = 0; j < 3; j++) {
            int s_row_item = stoi(s_row_temp[j]);

            s[i][j] = s_row_item;
        }
    }

    int result = formingMagicSquare(s);

    fout << result << "\n";

    fout.close();

    return 0;
}

string ltrim(const string &str) {
    string s(str);

    s.erase(
        s.begin(),
        find_if(s.begin(), s.end(), [](int c) {return !isspace(c);})
    );

    return s;
}

string rtrim(const string &str) {
    string s(str);

    s.erase(
        find_if(s.rbegin(), s.rend(), [](int c) {return !isspace(c);}).base(),
        s.end()
    );

    return s;
}

vector<string> split(const string &str) {
    vector<string> tokens;

    string::size_type start = 0;
    string::size_type end = 0;

    while ((end = str.find(" ", start)) != string::npos) {
        tokens.push_back(str.substr(start, end - start));

        start = end + 1;
    }

    tokens.push_back(str.substr(start));

    return tokens;
}
