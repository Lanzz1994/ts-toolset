import { digitToUpperCase } from '../../src/common/money';

describe('common/money', function () {
    test('digitToUpperCase', function () {
        let money = digitToUpperCase(100001312.1223);
        let money1 = digitToUpperCase(100001312);
        let money2 = digitToUpperCase(100001312, true);
        console.log(money, money1, money2);
    });
});
