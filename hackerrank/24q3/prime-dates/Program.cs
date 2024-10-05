using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
class Solution {
    private static CultureInfo culture = new CultureInfo("en-GB");

    static void Main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution */
        int lucky = 0;

        var dates = Console.ReadLine().Split(' ');

        var format = "dd-MM-yyyy";

        var firstDate = DateTime.ParseExact(dates[0], format, culture);
        var lastDate = DateTime.ParseExact(dates[1], format, culture);

        for (var d = firstDate; d.CompareTo(lastDate) <= 0; d = d.AddDays(1)) {
            if (IsLucky(d)) {
                lucky++;
            }
        }

        Console.WriteLine(lucky);
    }

    static bool IsLucky(DateTime date) {
        var str = date.ToString("ddMMyyyy", culture);
        var num = int.Parse(str);
        if (num % 4 == 0) return true;
        if (num % 7 == 0) return true;
        return false;
    }
}