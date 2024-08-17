namespace Baekjoon {
    class Program {
        static void Main() {
            uint[] input =
                Console.ReadLine()
                    .Split(' ')
                    .Select(s => uint.Parse(s))
                    .ToArray();

            uint x0 = input[0];
            uint N = input[1];
            uint xn = x0;

            for (uint n = 1; n <= N; n++) {
                if (xn % 2 == 0) {
                    xn = (xn / 2) ^ 6;
                }
                else {
                    xn = (xn * 2) ^ 6;
                }
            }

            Console.WriteLine(xn);
        }
    }
}