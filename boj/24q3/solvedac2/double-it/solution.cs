namespace Baekjoon {
    class Program {
        static void Main() {
            int N = int.Parse(Console.ReadLine());

            List<int> A = Console.ReadLine()
                .Split(' ')
                .Select(s => int.Parse(s))
                .ToList();
            
            A.Sort();

            int delta = A[N - 1] - A[0];

            while (true) {
                int next = delta;

                for (int i = 0; i < N; i++) {
                    A[0] = A[0] * 2;
                    A.Sort();

                    next = A[N - 1] - A[0];

                    if (next < delta) {
                        break;
                    }
                }

                if (next >= delta) {
                    break;
                }

                delta = next;
            }


            Console.WriteLine(delta);
        }
    }
}