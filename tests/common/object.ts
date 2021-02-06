import { assignValids, getObjectNest, flatObject, getPartialProperty, assignDeep, extendObjs } from '../../src/common/object';

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

    test('assignDeep', function () {
        let target = { a: { b: { c: 0 } } };
        let targetF = { a: { b: { c: 0 } } };
        assignDeep(['a', 'b', 'c'], target, 1);
        assignDeep(['a', 'b', 'c'], targetF, 2, true);
        console.log(target);
        console.log(targetF);

        let targetS = { a: {} };
        let targetSF = { a: {} };
        assignDeep(['a', 'b', 'c'], targetS, 1);
        assignDeep(['a', 'b', 'c'], targetSF, 1, true);
        console.log(targetS);
        console.log(targetSF);

        assignDeep([], targetS, 1);
        console.log(targetS);
    });

    test('extendObjs', function () {
        let objs = [{ key: '1', name: '1' }, { key: '2', name: '2' }, { key: '3', name: '3' }];
        extendObjs(objs, ['name', 'label']);
        console.log(objs);

        let objs1 = [{ key: '1', name: '1' }, { key: '2', name: '2' }, { key: '3', name: '3' }];
        extendObjs(objs1, [['name', 'label'], ['key', 'key']], 'wrap');
        console.log(objs1);
    });
});
