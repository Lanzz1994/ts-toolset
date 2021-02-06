import { isNumber, isString } from './types';

/** 数字汉字大写集合 */
export const upperCaseFonts = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾', '佰', '仟', '万', '亿'];

/** 获取整形数字的汉字大写 */
export function toUpperCase(value: number | string) {
    const number = isString(value) ? parseFloat(value) : value;
    return isNumber(number) ? upperCaseFonts[number] : '';
}

/** 数字保留小数位
 * @param length 保留的长度 */
export function toDecimal(value: string | number, length: number) {
    let result = value as string, keepLength = length + 1;
    isNumber(value) && (result = toFixed(value, keepLength));
    isString(value) && (result = toFixed(parseFloat(value), keepLength));
    return result === 'NaN'
        ? NaN
        : result.replace(new RegExp(`(\\.\\d{${length}})\\d+/`), '$1');
}

/** 原生 toFixed 有精度问题 */
export function toFixed(number: number, n: number) {
    if (n > 20 || n < 0) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }
    if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString();
    }
    if (typeof (n) == 'undefined' || n == 0) {
        return (Math.round(number)).toString();
    }

    let result: any = number.toString();
    const arr = result.split('.');

    // 整数的情况
    if (arr.length < 2) {
        result += '.';
        for (let i = 0; i < n; i += 1) {
            result += '0';
        }
        return result;
    }

    const integer = arr[0];
    const decimal = arr[1];
    if (decimal.length == n) {
        return result;
    }
    if (decimal.length < n) {
        for (let i = 0; i < n - decimal.length; i += 1) {
            result += '0';
        }
        return result;
    }
    result = integer + '.' + decimal.substr(0, n);
    const last = decimal.substr(n, 1);

    // 四舍五入，转换为整数再处理，避免浮点数精度的损失
    if (parseInt(last, 10) >= 5) {
        const x = Math.pow(10, n);
        result = (Math.round((parseFloat(result) * x)) + 1) / x;
        result = result.toFixed(n);
    }

    return result;
};