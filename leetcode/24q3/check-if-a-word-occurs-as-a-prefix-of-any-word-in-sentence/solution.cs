public class Solution {
    public int IsPrefixOfWord(string sentence, string searchWord) {
        var words = sentence.Split(" ");
        for (int i = 0; i < words.Length; i++) {
            var word = words[i];
            if (word.Length < searchWord.Length) continue;
            if (word.Substring(0, searchWord.Length) == searchWord) {
                return i + 1;
            }
        }        
        return -1;
    }
}