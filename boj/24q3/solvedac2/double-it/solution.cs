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

            printA(A);

            while (true) {
                int next = delta;

                for (int i = 0; i < N; i++) {
                    A[0] = A[0] * 2;
                    A.Sort();
                    printA(A);

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

        private static void printA(List<int> A) {
            int N = A.Count;

            for (int i = 0; i < N; i++) {
                Console.Write(A[i]);
                Console.Write(' ');
            }
            Console.Write('\n');


            int delta = A[N - 1] - A[0];

            Console.WriteLine($"𝚫 = {delta}");
        }
    }
}