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
     * Complete the 'gridChallenge' function below.
     *
     * The function is expected to return a STRING.
     * The function accepts STRING_ARRAY grid as parameter.
     */

    public static string gridChallenge(List<string> grid)
    {
        List<List<char>> rows = new List<List<char>>();
        int n = grid.Count;
        int m = grid[0].Count();

        for (int i = 0; i < n; i++) {
            rows.Add(new List<char>());
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                rows[i].Add(grid[i][j]);
            }
        }

        for (int i = 0; i < n; i++) {
            rows[i].Sort();
        }

        List<List<char>> cols = new List<List<char>>();

        for (int i = 0; i < m; i++) {
            cols.Add(new List<char>());
        }

        for (int r = 0; r < n; r++)
            for (int c = 0; c < m; c++) {
                cols[c].Add(rows[r][c]);
            }

        for (int i = 0; i < m; i++)
            cols[i].Sort();

        for (int r = 0; r < n; r++)
            for (int c = 0; c < m; c++)
                if (rows[r][c] != cols[c][r])
                    return "NO";

        return "YES";
    }

}

class Solution
{
    public static void Main(string[] args)
    {
        TextWriter textWriter = new StreamWriter(@System.Environment.GetEnvironmentVariable("OUTPUT_PATH"), true);

        int t = Convert.ToInt32(Console.ReadLine().Trim());

        for (int tItr = 0; tItr < t; tItr++)
        {
            int n = Convert.ToInt32(Console.ReadLine().Trim());

            List<string> grid = new List<string>();

            for (int i = 0; i < n; i++)
            {
                string gridItem = Console.ReadLine();
                grid.Add(gridItem);
            }

            string result = Result.gridChallenge(grid);

            textWriter.WriteLine(result);
        }

        textWriter.Flush();
        textWriter.Close();
    }
}
