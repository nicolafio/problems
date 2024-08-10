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
public class Solution
{
    public int DiameterOfBinaryTree(TreeNode root)
    {
        Dictionary<TreeNode, TreeNode> parent = new();
        Dictionary<TreeNode, List<TreeNode>> children = new();
        HashSet<TreeNode> leafs = new();
        HashSet<TreeNode> trees = new();

        forEachNode(root, (node) => {
            children[node] = new();

            if (node.left == null && node.right == null) {
                leafs.Add(node);
            }
            else {
                trees.Add(node);
            }
            
            if (node.left != null) {
                children[node].Add(node.left);
                parent[node.left] = node;
            }
            if (node.right != null) {
                children[node].Add(node.right);
                parent[node.right] = node;
            }
        });

        Dictionary<TreeNode, int> depth = new();
        Dictionary<TreeNode, int> height = new();

        depth[root] = 0;

        forEachNode(root, (node) => {
            if (node == root) return;
            
            depth[node] = 1 + depth[parent[node]];
        });

        for (HashSet<TreeNode> front = leafs, next = new(); front.Count > 0; front = next, next = new()) {
            foreach (var node in front) {
                height[node] = 0;
                foreach (var sub in children[node]) {
                    height[node] = Math.Max(height[node], height[sub] + 1);
                }
                if (node != root) {
                    next.Add(parent[node]);
                }
            }
        }

        int maxDiameter = height[root];
        
        foreach (var node in trees) {
            if (node.left != null && node.right != null) {
                maxDiameter = Math.Max(maxDiameter, height[node.left] + height[node.right] + 2);
            }
        }

        return maxDiameter;
    }

    private void forEachNode(TreeNode node, Action<TreeNode> callback) {
        callback(node);

        if (node.left != null) {
            forEachNode(node.left, callback);
        }
        
        if (node.right != null) {
            forEachNode(node.right, callback);
        }
    }
}