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
     * Complete the 'maximumPerimeterTriangle' function below.
     *
     * The function is expected to return an INTEGER_ARRAY.
     * The function accepts INTEGER_ARRAY sticks as parameter.
     */

    public static List<int> maximumPerimeterTriangle(List<int> sticks)
    {
        sticks.Sort();

        var n = sticks.Count;
        long maxPerimeter = -1;
        var bestTriangle = new List<int>{-1};

        for (int i = n - 1; i >= 0; i--) {
            for (int j = 0; j < i; j++) {
                for (int k = j + 1; k < i; k++) {
                    long maximumSide = sticks[i];
                    long minimumSide = sticks[j];
                    long medianSide = sticks[k];

                    var isNonDegenerate = medianSide + minimumSide > maximumSide;
                    
                    if (isNonDegenerate) {
                        long perimeter = maximumSide + medianSide + minimumSide;
                    
                        if (perimeter > maxPerimeter) {
                            maxPerimeter = perimeter;
                            bestTriangle = new List<int>{
                                (int)minimumSide,
                                (int)medianSide,
                                (int)maximumSide
                            };
                        }
                    }
                }
            }
        }

        return bestTriangle;
    }

}

class Solution
{
    public static void Main(string[] args)
    {
        TextWriter textWriter = new StreamWriter(@System.Environment.GetEnvironmentVariable("OUTPUT_PATH"), true);

        int n = Convert.ToInt32(Console.ReadLine().Trim());

        List<int> sticks = Console.ReadLine().TrimEnd().Split(' ').ToList().Select(sticksTemp => Convert.ToInt32(sticksTemp)).ToList();

        List<int> result = Result.maximumPerimeterTriangle(sticks);

        textWriter.WriteLine(String.Join(" ", result));

        textWriter.Flush();
        textWriter.Close();
    }
}
