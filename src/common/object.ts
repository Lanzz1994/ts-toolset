import { isEmpty, isObject } from './types';

type ObjectKey = number | string;

/** 根据 嵌套属性路径 获取嵌套对象的值 */
export function getObjectNest<T>(obj: any, path: ObjectKey[]): T | undefined {
    if (path.length > 0 && isObject(obj)) {
        let current = obj;
        for (let key of path) {
            current = current[key];
            if (current === undefined)
                return current;
        }
        return current;
    }
    return obj;
}

/** 合并有效数据，删除值为 undefined, null, NaN, 空字符串  */
export function assignValids(...params: any[]) {
    let target = Object.assign({}, ...params);
    Object.keys(target).forEach(key =>
        isEmpty(target[key]) && (delete target[key])
    );
    return target;
}

export function deepClone(target: any) {
    return JSON.parse(JSON.stringify(target));
}

function _flatObject(obj: any, flatKey: ObjectKey, clear: boolean) {
    Object.isExtensible(obj)
        && typeof obj[flatKey] === 'object'
        && Object.keys(obj[flatKey]).forEach(key => obj[key] = obj[flatKey][key]);
    clear && delete obj[flatKey];
}

/** 浅层扁平化对象 */
export function flatObject(obj: any, keys: ObjectKey | ObjectKey[], clear: boolean = true) {
    Array.isArray(keys)
        ? keys.forEach(key => _flatObject(obj, key, clear))
        : _flatObject(obj, keys, clear);
}

/** 指定属性值 组成新的对象返回，clone 表示返回的是全新的对象 */
export function getPartialProperty<T>(obj: any, keys: ObjectKey[], clone: boolean = false): T {
    let result: any = {};
    keys.forEach(key => result[key] = obj[key]);
    return clone ? deepClone(result) : result;
}
