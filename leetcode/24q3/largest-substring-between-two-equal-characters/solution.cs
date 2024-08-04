public class Solution {
    public int MaxLengthBetweenEqualCharacters(string s) {
        int maxLength = -1;
        for (int i = 0; i < s.Length; i++) {
            for (int j = i + 1; j < s.Length; j++) {
                if (s[i] == s[j]) {
                    var l = j - i - 1;
                    if (l > maxLength) maxLength = l;
                }
            }
        }
        return maxLength;
    }
}