#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <limits.h>
#include <stdint.h>

struct Link
{
    int x;
    int y;
    int timeBlips;
};

void readDimensions(int*, int*);

void readStreets(
    int columns,
    int rows,
    int linkCounts[columns + 1][rows + 1],
    struct Link* links[columns + 1][rows + 1]
);

int STREET_LENGTH_RELS = 2520;
char H_DIRECTIONS[] = {'<', '>'};
char V_DIRECTIONS[] = {'^', 'v'};

int64_t findBestRouteTimeBlips(
    int rows,
    int columns,
    int linkCounts[columns + 1][rows + 1],
    struct Link* links[columns + 1][rows + 1]
) {
    int64_t costs[columns + 1][rows + 1];

    for (int x = 0; x < columns + 1; x++)
        for (int y = 0; y < rows + 1; y++)
            costs[x][y] = INT64_MAX;

    int frontMaxSize = (columns + 1) * (rows + 1);
    int* frontX = malloc(frontMaxSize * sizeof(int));
    int* frontY = malloc(frontMaxSize * sizeof(int));
    int* nextFrontX = malloc(frontMaxSize * sizeof(int));
    int* nextFrontY = malloc(frontMaxSize * sizeof(int));

    int originX = 0;
    int originY = 0;
    int destinationX = columns;
    int destinationY = rows;

    costs[originX][originY] = 0;
    frontX[0] = originX;
    frontY[0] = originY;

    int frontSize = 1;
    int nextFrontSize;

    while (frontSize > 0)
    {
        nextFrontSize = 0;

        for (int i = 0; i < frontSize; i++)
        {
            int x = frontX[i];
            int y = frontY[i];

            for (int j = 0; j < linkCounts[x][y]; j++)
            {
                int linkX = links[x][y][j].x;
                int linkY = links[x][y][j].y;
                int64_t linkTimeBlips = links[x][y][j].timeBlips;

                int64_t oldCost = costs[linkX][linkY];
                int64_t newCost = costs[x][y] + linkTimeBlips;

                if (newCost < oldCost) {
                    costs[linkX][linkY] = newCost;
                    nextFrontX[nextFrontSize] = linkX;
                    nextFrontY[nextFrontSize] = linkY;
                    nextFrontSize++;
                }
            }
        }

        frontSize = nextFrontSize;

        int* tmpX = frontX;
        int* tmpY = frontY;

        frontX = nextFrontX;
        frontY = nextFrontY;

        nextFrontX = tmpX;
        nextFrontY = tmpY;
    }

    return costs[destinationX][destinationY];
}

int main()
{
    while (true) {
        int columns, rows;

        readDimensions(&columns, &rows);

        if (columns == 0 && rows == 0) return 0;

        int linkCounts[columns + 1][rows + 1];
        struct Link* links[columns + 1][rows + 1];

        readStreets(columns, rows, linkCounts, links);

        int64_t blips = findBestRouteTimeBlips(rows, columns, linkCounts, links);

        if (blips == INT64_MAX) printf("Holiday\n");
        if (blips != INT64_MAX) printf("%lld blips\n", blips);
    }

    return 0;
}

void readDimensions(int* x_ptr, int* y_ptr)
{
    scanf("%d %d", x_ptr, y_ptr);
}

void readStreets(
    int columns,
    int rows,
    int linkCounts[columns + 1][rows + 1],
    struct Link* links[columns + 1][rows + 1]
) {
    for (int y = 0; y < rows + 1; y++)
        for (int x = 0; x < columns + 1; x++)
            linkCounts[x][y] = 0;

    for (int i = 0; i < rows * 2 + 1; i++)
    {
        int y = i / 2;

        bool readingHorizontalStreets = i % 2 == 0;
        int streetsToRead = readingHorizontalStreets ? columns : columns + 1;

        for (int x = 0; x < streetsToRead; x++)
        {
            int streetSpeedRelsPerBlip;
            char streetDirection;

            scanf("%d %c", &streetSpeedRelsPerBlip, &streetDirection);

            if (streetSpeedRelsPerBlip == 0) continue;

            char* directions =
                readingHorizontalStreets ? H_DIRECTIONS : V_DIRECTIONS;

            for (int j = 0; j < 2; j++)
            {
                char direction = directions[j];

                if (streetDirection != direction && streetDirection != '*')
                    continue;

                int originX;
                int originY;
                int destinationX;
                int destinationY;

                if (direction == '^')
                {
                    originX = x;
                    originY = y + 1;
                    destinationX = x;
                    destinationY = y;
                }

                if (direction == 'v')
                {
                    originX = x;
                    originY = y;
                    destinationX = x;
                    destinationY = y + 1;
                }

                if (direction == '<')
                {
                    originX = x + 1;
                    originY = y;
                    destinationX = x;
                    destinationY = y;
                }

                if (direction == '>')
                {
                    originX = x;
                    originY = y;
                    destinationX = x + 1;
                    destinationY = y;
                }

                int originLinksCount = linkCounts[originX][originY];

                if (originLinksCount == 0)
                    links[originX][originY] = malloc(4 * sizeof(struct Link));

                struct Link* link = &links[originX][originY][originLinksCount];

                link->x = destinationX;
                link->y = destinationY;
                link->timeBlips = STREET_LENGTH_RELS / streetSpeedRelsPerBlip;

                linkCounts[originX][originY]++;
            }
        }
    }
}