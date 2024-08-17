namespace Baekjoon {
    class Program {
        private static readonly Dictionary<string, string> fullName =
            new Dictionary<string, string>(){
                {"NLCS",  "North London Collegiate School"},
                {"BHA", "Branksome Hall Asia"},
                {"KIS", "Korea International School"},
                {"SJA", "St. Johnsbury Academy"}
            };
        static void Main() {
            string acronym = Console.ReadLine();
            Console.WriteLine(fullName[acronym]);
        }
    }
}