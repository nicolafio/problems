#include <bits/stdc++.h>
#include <fstream>
#include <iostream>

using namespace std;

/*
 * Complete the 'marsExploration' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts STRING s as parameter.
 */

int marsExploration(string s) {
    string pattern = "SOS";
    int errors = 0;
    int n = s.length();

    for (int i = 0; i < n; i++) {
        if (s[i] != pattern[i % 3]) {
            errors++;
        }
    }

    return errors;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string s;
    getline(cin, s);

    int result = marsExploration(s);

    fout << result << "\n";

    fout.close();

    return 0;
}
