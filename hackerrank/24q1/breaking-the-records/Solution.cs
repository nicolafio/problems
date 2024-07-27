using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Collections;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;
using System.Text;
using System;

class Result
{

    /*
     * Complete the 'breakingRecords' function below.
     *
     * The function is expected to return an INTEGER_ARRAY.
     * The function accepts INTEGER_ARRAY scores as parameter.
     */

    public static List<int> breakingRecords(List<int> scores)
    {
        var minRecord = scores[0];
        var maxRecord = scores[0];
        var minRecordBreaks = 0;
        var maxRecordBreaks = 0;
        var n = scores.Count;

        for (var i = 1; i < n; i++) {
            var score = scores[i];
            if (score > maxRecord) {
                maxRecordBreaks++;
                maxRecord = score;
            }
            if (score < minRecord) {
                minRecordBreaks++;
                minRecord = score;
            }
        }
 
        return new List<int>{
            maxRecordBreaks,
            minRecordBreaks
        };
    }

}

class Solution
{
    public static void Main(string[] args)
    {
        TextWriter textWriter = new StreamWriter(@System.Environment.GetEnvironmentVariable("OUTPUT_PATH"), true);

        int n = Convert.ToInt32(Console.ReadLine().Trim());

        List<int> scores = Console.ReadLine().TrimEnd().Split(' ').ToList().Select(scoresTemp => Convert.ToInt32(scoresTemp)).ToList();

        List<int> result = Result.breakingRecords(scores);

        textWriter.WriteLine(String.Join(" ", result));

        textWriter.Flush();
        textWriter.Close();
    }
}
