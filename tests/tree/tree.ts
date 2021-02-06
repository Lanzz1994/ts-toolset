import { $tree } from '../../src/tree/tree';

describe('tree/utils', function () {
    test('buildTreeByJoinNode', function () {

        let source: any = [
            { "key": "0", "name": "0", "_node": { "parent": null, "left": null, "right": null } },
            { "key": "00", "name": "00", "_node": { "parent": "0", "left": null, "right": "01" } },
            { "key": "04", "name": "04", "_node": { "parent": "0", "left": "03", "right": "05" } },
            { "key": "01", "name": "01", "_node": { "parent": "0", "left": "00", "right": "02" } },
            { "key": "03", "name": "03", "_node": { "parent": "0", "left": "02", "right": "04" } },
            { "key": "02", "name": "02", "_node": { "parent": "0", "left": "01", "right": "03" } },
            { "key": "05", "name": "05", "_node": { "parent": "0", "left": "04", "right": null } },

            { "key": "1", "name": "1", "_node": { "parent": null, "left": null, "right": null } },
            { "key": "10", "name": "10", "_node": { "parent": "1", "left": null, "right": "11" } },
            { "key": "14", "name": "14", "_node": { "parent": "1", "left": "13", "right": "15" } },
            { "key": "11", "name": "11", "_node": { "parent": "1", "left": "10", "right": "12" } },
            { "key": "13", "name": "13", "_node": { "parent": "1", "left": "12", "right": "14" } },
            { "key": "12", "name": "12", "_node": { "parent": "1", "left": "11", "right": "13" } },
            { "key": "15", "name": "15", "_node": { "parent": "1", "left": "14", "right": null } },

            { "key": "24", "name": "24", "_node": { "parent": "2", "left": "23", "right": "25" } },
            { "key": "2", "name": "2", "_node": { "parent": null, "left": null, "right": null } },
            { "key": "20", "name": "20", "_node": { "parent": "2", "left": null, "right": "21" } },
            { "key": "21", "name": "21", "_node": { "parent": "2", "left": "20", "right": "22" } },
            { "key": "23", "name": "23", "_node": { "parent": "2", "left": "22", "right": "24" } },
            { "key": "22", "name": "22", "_node": { "parent": "2", "left": "21", "right": "23" } },
            { "key": "25", "name": "25", "_node": { "parent": "2", "left": "24", "right": null } },
        ];

        let treeData = $tree.buildTreeByJoinNode(source, { key: 'key', joinNodeKey: '_node', clearJoinNode: false });

        console.log(JSON.stringify(treeData));
    });
});