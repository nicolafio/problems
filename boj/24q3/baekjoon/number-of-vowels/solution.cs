namespace Baekjoon {
    class Program {
        private static readonly HashSet<char> vowels =
            new HashSet<char>{'a', 'e', 'i', 'o', 'u'};

        static void Main() {
            string line = Console.ReadLine();
            int count = 0;

            foreach (char c in line) {
                if (vowels.Contains(c)) {
                    count++;
                }
            }

            Console.WriteLine(count);
        }
    }
}