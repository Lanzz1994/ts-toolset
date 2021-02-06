import { LinkedTree, LinkedTreeNode } from '../../src/tree/linkedTree';

describe('tree/linkedTree', function () {
    test('linkedTree_linkedTreeNode', function () {
        let node1 = new LinkedTreeNode({ name: 'node1' });
        let node2 = new LinkedTreeNode({ name: 'node2' });
        let node3 = new LinkedTreeNode({ name: 'node3' });
        let node4 = new LinkedTreeNode({ name: 'node4' });

        let node1_1 = new LinkedTreeNode({ name: 'node1_1' });
        let node1_2 = new LinkedTreeNode({ name: 'node1_2' });

        let node2_1 = new LinkedTreeNode({ name: 'node2_1' });
        let node2_2 = new LinkedTreeNode({ name: 'node2_2' });

        let node3_1 = new LinkedTreeNode({ name: 'node3_1' });
        let node3_2 = new LinkedTreeNode({ name: 'node3_2' });

        let node4_1 = new LinkedTreeNode({ name: 'node4_1' });
        let node4_2 = new LinkedTreeNode({ name: 'node4_2' });

        let tree = new LinkedTree();
        tree.addToChildrenFirst(node1, tree.root);
        tree.addToChildrenLast(node2, tree.root);
        tree.addToChildrenLast(node3, tree.root);
        tree.addToChildrenFirst(node4, tree.root);

        tree.addToChildrenFirst(node1_1, node1);
        tree.addToChildrenLast(node2_1, node2);
        tree.addToChildrenLast(node3_1, node3);
        tree.addToChildrenFirst(node4_1, node4);
debugger
        tree.moveToChildrenLast(node2, node1_1);

        let json = tree.export();
        let tree2 = new LinkedTree().import(json);

        // tree.moveToAfter(node1_1, node1);
        // tree.moveToAfter(node1_2, node2);



        //let json1 = tree.export();

        //tree.dispose();

        //tree.addToChildrenLast(node1_2, node1_1);

        // let height = node1.getNodeHeight(node1);

        debugger;

    });
});
