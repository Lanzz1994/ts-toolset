import { toDecimal, toUpperCase } from '../../src/common/number';

describe('common/number', function () {
    test('toDecimal', function () {
        console.log(toDecimal(1, 2));
        console.log(toDecimal(1.123, 2));
        console.log(toDecimal(1.178, 2));
        console.log(toDecimal(1.163, 2));
        console.log(toDecimal(1.0453, 3));
    });
    test('toUpperCase', function () {
        console.log(toUpperCase(1));
        console.log(toUpperCase(2));
        console.log(toUpperCase(3));
        console.log(toUpperCase(4));
    });
});
