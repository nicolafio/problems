#include <string>

using namespace std;

class Solution {
public:
    int minimumRecolors(string blocks, int k) {
        int minimum = k;
        for (int i = 0; (i + k) <= blocks.length(); i++) {
            int recolors = 0;
            for (int j = 0; j < k; j++) {
                if (blocks[i + j] == 'W') {
                    recolors++;
                }
            }
            if (recolors < minimum) {
                minimum = recolors;
            }
        }
        return minimum;
    }
};