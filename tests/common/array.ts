import { arrutils } from '../../src/common/array';

describe('common/array', function () {
    test('arrutils.groupByField', function () {

        let group = arrutils.groupByField([{
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
});
