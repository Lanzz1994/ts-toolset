import update from '../../src/common/immutability';

describe('common/immutability', function () {
    test('extend command', function () {
        let data = { a: { b: 'c' } };
        update(data, { a: { $update: ['b', 'd'] } } as any);
        console.log(data);
    });
});
