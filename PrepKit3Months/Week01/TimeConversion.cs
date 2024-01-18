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
     * Complete the 'timeConversion' function below.
     *
     * The function is expected to return a STRING.
     * The function accepts STRING s as parameter.
     */
    private static Dictionary<string, string> pmHHform12to24 =
        new Dictionary<string, string>{
            ["01"] = "13",
            ["02"] = "14",
            ["03"] = "15",
            ["04"] = "16",
            ["05"] = "17",
            ["06"] = "18",
            ["07"] = "19",
            ["08"] = "20",
            ["09"] = "21",
            ["10"] = "22",
            ["11"] = "23",
            ["12"] = "12",
        };

    public static string timeConversion(string s)
    {
        var n = s.Length;
        var hh = s.Substring(0, 2);
        if (s[n - 2] == 'P') hh = pmHHform12to24[hh];
        return hh + s.Substring(2, 6);
    }

}

class Solution
{
    public static void Main(string[] args)
    {
        TextWriter textWriter = new StreamWriter(@System.Environment.GetEnvironmentVariable("OUTPUT_PATH"), true);

        string s = Console.ReadLine();

        string result = Result.timeConversion(s);

        textWriter.WriteLine(result);

        textWriter.Flush();
        textWriter.Close();
    }
}
