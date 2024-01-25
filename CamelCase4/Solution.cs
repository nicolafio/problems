using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;

class Solution {

    static void Main(String[] args) {
        for (var line = Console.ReadLine(); line != null; line = Console.ReadLine()) {
            var elements = line.TrimEnd().Split(';');
            var operation = elements[0];
            var type = elements[1];
            var words = parseWords(elements[2]);
            string name = null;

            if (operation == "S") name = string.Join(" ", words);
            if (operation == "C") {
                if (type == "M") name = wordsToMethodName(words);
                if (type == "C") name = wordsToClassName(words);
                if (type == "V") name = wordsToVariableName(words);
            }

            if (name == null) throw new Exception("Unexpected input");
            
            Console.WriteLine(name);
        }
    }

    static string wordsToMethodName(string[] words) {
        return wordsToVariableName(words) + "()";
    }

    static string wordsToClassName(string[] words) {
        return string.Join("", words.Select(capitalize));
    }

    static string wordsToVariableName(string[] words) {
        return words.First() + wordsToClassName(words.Skip(1).ToArray());
    }

    static string[] parseWords(string input) {
        var words = new List<string>();
        var word = "";
        
        foreach (var letter in input) {
            if (letter == '(') break; 
            if (letter == ' ' || (IsUpperCase(letter) && word.Length > 0)) {
                words.Add(word.ToLower());
                word = "";
            }
            if (letter != ' ') word += letter;
        }

        if (word.Length > 0) words.Add(word.ToLower());

        return words.ToArray();
    }

    static string capitalize(string word) {
        return word.First().ToString().ToUpper() + word.Substring(1);
    } 

    static bool IsUpperCase(char character) {
        string pattern = "[A-Z]";
        return Regex.IsMatch(character.ToString(), pattern);
    }

}