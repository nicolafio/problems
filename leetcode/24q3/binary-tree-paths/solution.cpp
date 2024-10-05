struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

// -----------

#include <vector>
#include <string>
#include <unordered_map>
#include <functional>
#include <type_traits>
#include <algorithm>

using namespace std;

class Solution {
public:
    vector<string> binaryTreePaths(TreeNode* root) {
        vector<TreeNode*> leafs = this->findLeafs(root);
        unordered_map<TreeNode*, TreeNode*> parent = this->findParents(root);

        vector<string> paths;

        for (TreeNode* leaf : leafs) {
            vector<TreeNode*> path;
            string str = "";

            for (TreeNode* node = leaf; node != nullptr; node = parent[node]) {
                path.push_back(node);
            }

            reverse(path.begin(), path.end());

            bool first = true;

            for (TreeNode* node : path) {
                if (!first) {
                    str += "->";
                }

                str += to_string(node->val);
                first = false;
            }

            paths.push_back(str);
        }

        return paths;
    }

private:
    unordered_map<TreeNode*, TreeNode*> findParents(TreeNode* root) {
        unordered_map<TreeNode*, TreeNode*> parent;

        parent[root] = nullptr;

        this->forEachNode(root, [&](TreeNode* node) {
            if (node->left) {
                parent[node->left] = node;
            }

            if (node->right) {
                parent[node->right] = node;
            }
        });

        return parent;
    }

    vector<TreeNode*> findLeafs(TreeNode* root) {
        vector<TreeNode*> leafs;

        this->forEachNode(root, [&](TreeNode* node) {
            if (!(node->left) && !(node->right)) {
                leafs.push_back(node);
            }
        });

        return leafs;
    }

    void forEachNode(TreeNode* root, function<void(TreeNode*)> callback) {
        callback(root);

        if (root->left) {
            forEachNode(root->left, callback);
        }

        if (root->right) {
            forEachNode(root->right, callback);
        }
    }

};