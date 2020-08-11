import { assignValids, getObjectNest, flatObject, getPartialProperty } from '../../src/common/object';

describe('common/object', function () {
    test('assignValids', function () {
        let obj = assignValids({ 1: undefined, 2: null, 3: NaN, 4: '', 5: false, 6: ' ' }, { 1: 1 });
        console.log(obj);
    });

    test('getObjectNest', function () {
        let obj = getObjectNest({ 1: { 2: { 3: 4 } } }, [1, 2, 3]);
        console.log(obj);
    });

    test('flatObject', function () {
        let obj = { 1: { 3: 3 }, 2: { 4: { 5: 5 } } };
        flatObject(obj, [1, 2]);
        console.log(obj);
    });

    test('getPartialProperty', function () {
        let obj = getPartialProperty({ 1: { 2: { 3: 4 } }, 2: { 2: 2 } }, [2]);
        console.log(obj);
    });
});
