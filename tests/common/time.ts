import { secondsFormat, dateFormat } from '../../src/common/time';

describe('common/time', function () {
    test('secondsFormat', function () {
        const time = secondsFormat(86499, 'HH时mm分ss秒');
        console.log(time);
    });
    test('dateFormat', function () {
        const time = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss QQ季度');
        console.log(time);
    });
});
