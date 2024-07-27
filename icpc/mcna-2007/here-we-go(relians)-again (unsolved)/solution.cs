using System;
using System.Collections.Generic;
using System.Linq;

struct Link {
    public Tuple<int, int> destination;
    public int timeBlips;
}

class Program {
    private static int findBestRouteTimeBlips(
        Dictionary<Tuple<int, int>, List<Link>> links,
        Tuple<int, int> origin,
        Tuple<int, int> destination
    ) {
        var costs = new Dictionary<Tuple<int, int>, int>();
        var front = new HashSet<Tuple<int, int>>(); 
        
        costs.Add(origin, 0);
        front.Add(origin);

        while (front.Count > 0) {
            var nextFront = new HashSet<Tuple<int, int>>();

            foreach (var intersection in front) {
                foreach (var link in links.GetValueOrDefault(intersection, new List<Link>())) {
                    var oldCost = costs.GetValueOrDefault(link.destination, int.MaxValue);
                    var newCost = costs[intersection] + link.timeBlips;

                    if (newCost < oldCost) {
                        costs[link.destination] = newCost;
                        
                        nextFront.Add(link.destination);
                    }
                }
            }

            front = nextFront;
        }

        return costs.GetValueOrDefault(destination, -1);
    }

    public static void Main() {
        while (true) {
            var dimensions = readDimensions();

            if (dimensions.Equals(Tuple.Create(0, 0))) return;

            var rows = dimensions.Item2;

            var links = readRoads(rows);

            var origin = Tuple.Create(0, 0);
            var destination = dimensions;

            var bestRouteTimeBlips =
                findBestRouteTimeBlips(links, origin, destination);
 
            if (bestRouteTimeBlips == -1)
                Console.WriteLine("Holiday");

            if (bestRouteTimeBlips != -1)  
                Console.WriteLine($"{bestRouteTimeBlips} blips");
        }
    }

    private static readonly int STREET_LENGTH_RELS = 2520;

    private static readonly HashSet<char> H_DIRECTIONS =
        new HashSet<char>{'<', '>'};

    private static readonly HashSet<char> V_DIRECTIONS =
        new HashSet<char>{'^', 'v'};

    private static Tuple<int, int> readDimensions() {
        var dimensions = Console.ReadLine().Split(' ').Select(v => Convert.ToInt32(v));
        return Tuple.Create(dimensions.First(), dimensions.Last());
    }

    private static Dictionary<Tuple<int, int>, List<Link>> readRoads(int rows) {        
        var links = new Dictionary<Tuple<int, int>, List<Link>>();

        for (var i = 0; i < rows * 2 + 1; i++) {
            var y = i / 2;

            var values = Console.ReadLine().Split(' ');
            
            var readingHorizontalStreets = i % 2 == 0;
            var readingVerticalStreets = !readingHorizontalStreets;

            for (var j = 0; j < values.Length; j += 2) {
                var x = j / 2;
 
                var speed_rels_per_blip = Convert.ToInt32(values[j]);

                if (speed_rels_per_blip == 0) continue;

                var streetDirection = Convert.ToChar(values[j + 1]);

                IEnumerable<char> directions = default(HashSet<char>);

                if (readingHorizontalStreets) directions = H_DIRECTIONS;
                if (readingVerticalStreets) directions = V_DIRECTIONS;

                foreach (var direction in directions) {
                    if (streetDirection != direction && streetDirection != '*')
                        continue;

                    Tuple<int, int> origin = null;
                    Tuple<int, int> destination = null;

                    if (direction == '^') {
                        origin = Tuple.Create(x, y + 1);
                        destination = Tuple.Create(x, y);
                    }

                    if (direction == 'v') {
                        origin = Tuple.Create(x, y);
                        destination = Tuple.Create(x, y + 1);
                    }

                    if (direction == '<') {
                        origin = Tuple.Create(x + 1, y);
                        destination = Tuple.Create(x, y);
                    }

                    if (direction == '>') {
                        origin = Tuple.Create(x, y);
                        destination = Tuple.Create(x + 1, y);
                    }

                    if (origin == null || destination == null)
                        throw new Exception("Should never happen");

                    if (!links.ContainsKey(origin))
                        links[origin] = new List<Link>();

                    Link link;

                    link.destination = destination;
                    link.timeBlips = STREET_LENGTH_RELS / speed_rels_per_blip;

                    links[origin].Add(link);
                }
            }
        }

        return links;
    }
}
