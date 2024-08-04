/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     public int val;
 *     public TreeNode left;
 *     public TreeNode right;
 *     public TreeNode(int val=0, TreeNode left=null, TreeNode right=null) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
public class Solution {
    public int DiameterOfBinaryTree(TreeNode root) {
        var parentMemo = new Dictionary<TreeNode, TreeNode?>();
        parentMemo[root] = null;
        recordParents(root, parentMemo);

        var nodes = parentMemo.Keys;
        var distance = new Dictionary<(TreeNode, TreeNode), int>();

        foreach (var node in nodes) {
            var candidates = new List<TreeNode?>() {
                node.left,
                node.right,
                parentMemo[node]
            };
            foreach (var candidate in candidates) {
                if (candidate != null) {
                    distance[(node, candidate)] = 1;
                    distance[(candidate, node)] = 1;
                }
            }
        }

        bool settled = false;

        int n = 0;

        while (!settled) {
            settled = true;
            foreach (var a in nodes) {
                foreach (var b in nodes) {
                    if (a == b) continue;
                    foreach (var c in nodes) {
                        if (a == c) continue;
                        if (b == c) continue;
                        if (distance.ContainsKey((a, b)) && distance.ContainsKey((b, c))) {
                            n++;
                            var ab = distance[(a, b)];
                            var bc = distance[(b, c)];
                            var ac = -1;
                            if (distance.ContainsKey((a, c))) ac = distance[(a, c)];
                            if (ab + bc > ac) {
                                settled = false;
                                distance[(a, c)] = distance[(c, a)] = ab + bc;
                            }
                        }
                    }
                }
            }
        }

        Console.WriteLine(n);

        return distance.Values.Max();
    }

    private void recordParents(
        TreeNode node,
        Dictionary<TreeNode, TreeNode?> parentMemo
    ) {
        foreach (var n in new List<TreeNode?>{node.left, node.right}) {
            if (n != null) {
                parentMemo[n] = node;
                recordParents(n, parentMemo);
            }
        }
    }
}