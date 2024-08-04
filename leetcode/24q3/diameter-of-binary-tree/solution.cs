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
        var rightDepthMemo = new Dictionary<TreeNode, int>();
        var leftDepthMemo = new Dictionary<TreeNode, int>();
        var downDepthMemo = new Dictionary<TreeNode, int>();

        parentMemo[root] = null;

        recordParents(root, parentMemo);
        recordDepth(root, downDepthMemo, (n) => new(){n.left, n.right});
        recordDepth(root, rightDepthMemo, (n) => new(){n.right, parentMemo[n]});
        recordDepth(root, leftDepthMemo, (n) => new(){n.left, parentMemo[n]});

        var depthMemos = new List<Dictionary<TreeNode, int>>() {
            rightDepthMemo,
            leftDepthMemo,
            downDepthMemo
        };

        int diameter = 0;

        foreach (var depthMemo in depthMemos) {
            foreach (var depth in depthMemo.Values) {
                if (depth > diameter) {
                    diameter = depth;
                }
            }
        }

        return diameter;
    }

    private void recordParents(
        TreeNode node,
        Dictionary<TreeNode, TreeNode?> parentMemo
    ) {
        foreach (var n in new List<TreeNode>{node.left, node.right}) {
            if (n != null) {
                parentMemo[n] = node;
                recordParents(n, parentMemo);
            }
        }
    }
    
    private void recordDepth(
        TreeNode node,
        Dictionary<TreeNode, int> depthMemo,
        Func<TreeNode, List<TreeNode?>> getNext
    ) {
        if (depthMemo.ContainsKey(node)) return;

        int depth = 0;

        foreach (var next in getNext(node)) {
            if (next != null) {
                recordDepth(next, depthMemo, getNext);
                depth += 1 + depthMemo[next];
            }
        }

        depthMemo[node] = depth;
    }
}