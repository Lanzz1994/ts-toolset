import { fullAssign, fullCount } from '../../src/common/callback';

describe('common/callback', function () {
    test('fullAssign', function (done) {

        const assigner = fullAssign(['a', 'b', 'c'], function (obj) {
            console.log(obj);
            console.log('obj is fully assigned value.');
        });

        setTimeout(() => assigner.a = 1, 100);
        setTimeout(() => assigner.b = 2, 200);
        setTimeout(() => assigner.c = 3, 300);

        setTimeout(() => assigner.a = 1, 400);
        setTimeout(() => assigner.b = 2, 500);
        setTimeout(() => assigner.c = 3, 600);

        setTimeout(done, 1000);

    });

    test('fullCount', function (done) {
        const count = fullCount(3, function () {
            console.log('counter achieved special point');
        });

        setTimeout(count, 100);
        setTimeout(count, 200);
        setTimeout(count, 300);

        setTimeout(count, 400);
        setTimeout(count, 500);
        setTimeout(count, 600);

        setTimeout(done, 1000);

    });
});
