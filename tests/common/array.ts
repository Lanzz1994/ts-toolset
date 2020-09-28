import { mergeNestArray, groupByField, split } from '../../src/common/array';

describe('common/array', function () {
    test('groupByField', function () {

        let group = groupByField([{
            value: 1,
            group: 'group1'
        }, {
            value: 2,
            group: 'group2'
        }, {
            value: 3,
            group: 'group3'
        }, {
            value: 4,
            group: 'group4'
        }], 'group');

        console.log(group);
    });

    test('split', function () {

        let splits = split([{
            value: 1,
            group: 'group1'
        }, {
            value: 2,
            group: 'group2'
        }, {
            value: 3,
            group: 'group3'
        }, {
            value: 4,
            group: 'group4'
        }, {
            value: 5,
            group: 'group5'
        }], 2);

        console.log(splits);
    });

    test('mergeNestArray', function () {
        let arr1 = [{ arr: [1, 2, 3] }, { arr: [4, 5, 6] }];
        let merge = mergeNestArray(arr1, ['arr']);
        console.log(merge);
    });
});
