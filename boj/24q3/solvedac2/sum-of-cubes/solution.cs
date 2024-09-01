namespace Baekjoon {
    class Program {
        static void Main() {
            int N = int.Parse(Console.ReadLine());

            int sum = 0;
            int sumOfCubes = 0;

            for (int i = 1; i <= N; i++) {
                sum += i;
                sumOfCubes += i * i * i;
            }

            Console.WriteLine(sum);
            Console.WriteLine(sum * sum);
            Console.WriteLine(sumOfCubes);
        }
    }
}