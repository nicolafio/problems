#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <limits.h>

struct Node {
    struct Node* left;
    struct Node* right;
    bool hasBall;
};

void getTree(struct Node*);
bool isTwig(struct Node*);
int countBalls(struct Node*);
int countTwigs(struct Node*);
int getTwigs(struct Node**, struct Node*);
bool checkBalance(struct Node*, int*);
void deallocateTree(struct Node*);

int findMinimumSwapsToBalance(struct Node* tree)
{
    int minimumSwapsToBalance = INT_MAX;
    int ballsCount = countBalls(tree);
    int twigsCount = countTwigs(tree);
    struct Node* twigs[twigsCount];
    bool initialPermutation[twigsCount];
    int ballsAvailable = ballsCount;
    int states[twigsCount];

    getTwigs(twigs, tree);

    for (int i = 0; i < twigsCount; i++)
    {
        initialPermutation[i] = twigs[i]->hasBall;
        states[i] = 0;
    }

    // I only know how to make permutations recursively, so I'm making a
    // recursive computation in a iterative form, keeping state.
    // The level of recursion is described by `level`. What resembles a
    // recursive call is incrementing `level` and followed with the `continue`
    // keyword. Decrementing `level` followed with the `continue` keyword means
    // that the function at `level` finished computation and gives back control
    // to the "calling" function.

    for (int level = 0; level >= 0;)
    {
        if (level == twigsCount)
        {
            // We have a new permutation.

            // Is the tree not balanced?
            if (!checkBalance(tree, NULL))
            {
                // Return.
                level--;
                continue;
            }

            // The tree is balanced with this permutation.

            int differences = 0;

            for (int i = 0; i < twigsCount; i++)
                if (twigs[i]->hasBall != initialPermutation[i])
                    differences++;

            int swapsToBalance = differences / 2;

            if (minimumSwapsToBalance > swapsToBalance)
                minimumSwapsToBalance = swapsToBalance;

            // Return.
            level--;
            continue;
        }

        if (states[level] == 0)
        {
            if (ballsAvailable > 0)
            {
                // Put in a ball.
                twigs[level]->hasBall = true;
                ballsAvailable--;

                // Call recursively.
                states[level]++;
                level++;
                continue;
            }
            else {
                twigs[level]->hasBall = false;

                // Call recursively.
                states[level]++;
                level++;
                continue;
            }
        }

        if (states[level] == 1)
        {
            // Did we try already without putting a ball?
            if (!twigs[level]->hasBall)
            {
                // Return.
                states[level] = 0;
                level--;
                continue;
            }

            // Take out a ball.
            twigs[level]->hasBall = false;
            ballsAvailable++;

            // Are we forced to put in a ball?
            int twigsLeft = twigsCount - level;
            if (twigsLeft == ballsAvailable)
            {
                // Return.
                states[level] = 0;
                level--;
                continue;
            }

            // We can try without putting a ball in the current twig.

            // Call recursively.
            states[level]++;
            level++;
            continue;
        }

        if (states[level] == 2)
        {
            // Return.
            states[level] = 0;
            level--;
            continue;
        }

        fprintf(stderr, "Unexpected state");
        exit(1);
    }

    return minimumSwapsToBalance;
}

int main() {
    while (getchar() != EOF)
    {
        struct Node* tree = malloc(sizeof(struct Node));

        getTree(tree);

        int swaps = findMinimumSwapsToBalance(tree);

        if (swaps == INT_MAX) printf("impossible\n");
        if (swaps != INT_MAX) printf("%d\n", swaps);

        char c = getchar();

        if (c != '\n')
        {
            fprintf(stderr, "Unexpected character '%c', expecting new line", c);
            exit(1);
        }

        deallocateTree(tree);
    }
    return 0;
}

void deallocateTree(struct Node* tree)
{
    if (!isTwig(tree))
    {
        deallocateTree(tree->left);
        deallocateTree(tree->right);
    }

    free(tree);
}

bool checkBalance(struct Node* tree, int* ballsFound)
{
    if (ballsFound != NULL) *ballsFound = 0;

    if (isTwig(tree))
    {
        if (ballsFound != NULL && tree->hasBall) *ballsFound = 1;

        return true;
    }

    int ballsFoundLeft;
    int ballsFoundRight;

    if (!checkBalance(tree->left, &ballsFoundLeft)) return false;
    if (!checkBalance(tree->right, &ballsFoundRight)) return false;
    if (abs(ballsFoundLeft - ballsFoundRight) > 1) return false;

    if (ballsFound != NULL) *ballsFound = ballsFoundLeft + ballsFoundRight;

    return true;
}

bool isTwig(struct Node* tree) {
    return tree->left == NULL;
}

int countTwigs(struct Node* tree)
{
    if (isTwig(tree))
    {
        return 1;
    }
    return countTwigs(tree->left) + countTwigs(tree->right);
}

int countBalls(struct Node* tree)
{
    if (isTwig(tree))
    {
        if (tree->hasBall) return 1;
        return 0;
    }

    return countBalls(tree->left) + countBalls(tree->right);
}

int getTwigs(struct Node** twigs, struct Node* tree)
{
    if (isTwig(tree))
    {
        *twigs = tree;
        return 1;
    }

    int leftCount = getTwigs(twigs, tree->left);
    int rightCount = getTwigs(twigs + leftCount, tree->right);

    return leftCount + rightCount;
}

void getTree(struct Node* root) {
    root->left = NULL;
    root->right = NULL;
    root->hasBall = false;

    char c = getchar();

    if (c == ')') return;

    if (c == '(')
    {
        root->left = malloc(sizeof(struct Node));
        getTree(root->left);
    }

    if (c == 'B') root->hasBall = true;

    if (c != '(' && c != 'B')
    {
        fprintf(stderr, "Unexpected character '%c', expecting '(', ')', or 'B'\n", c);
        exit(1);
    }

    c = getchar();

    if (c == ')') return;

    if (c == '(')
    {
        if (root->hasBall)
        {
            fprintf(stderr, "Unexpected character '(', expecting ')'\n");
            exit(1);
        }

        root->right = malloc(sizeof(struct Node));
        getTree(root->right);
    }

    if (c != '(' && c != ')')
    {
        fprintf(stderr, "Unexpected character '%c', expecting ')' or '('\n", c);
        exit(1);
    }

    c = getchar();

    if (c == ')') return;

    fprintf(stderr, "Unexpected character '%c', expecting ')'\n", c);
    exit(1);
}