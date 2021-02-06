import { isNegateEmpty, isObject, isUndefined } from './types';

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
        isNegateEmpty(target[key]) && (delete target[key])
    );
    return target;
}

/** 根据路径设置 深层嵌套 的属性 */
export function assignDeep(path: string[], target: any, value: any, forceAssign?: boolean) {

    if (path.length === 0) return;

    let setTarget = target;
    path = path.concat();
    while (path.length > 1) {
        let key = path.shift()!;
        if (isUndefined(setTarget[key])) {
            if (forceAssign) {
                setTarget[key] = {};
            } else {
                return;
            }
        }
        setTarget = setTarget[key];
    }
    setTarget[path[0]] = value;
}

/** 深度拷贝，仅支持属性 */
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

/** 包裹 对象的属性 到指定到嵌套对象属性里 */
export function wrapObj(obj: any, wrapField: string, excludes: string[]) {
    const wrap: any = {};
    Object.keys(obj).forEach(key => {
        wrap[key] = obj[key];
        excludes.includes(key) || Reflect.deleteProperty(obj, key);
    });
    obj[wrapField] = wrap;
    return obj;
}

/** 扩展数组里的对象字段 */
export function extendObjs(objs: any[], key: [string, string], wrapField?: string): void;
export function extendObjs(objs: any[], keys: [string, string][], wrapField?: string): void;
export function extendObjs(objs: any[], source: any, wrapField?: string) {

    let keys: [string, string][] = Array.isArray(source[0]) ? source : [source];
    let excludes = keys.map(v => v[1]);

    objs.forEach(obj => {
        wrapField && wrapObj(obj, wrapField, excludes);
        keys.forEach(key =>
            obj[key[1]] = wrapField
                ? obj[wrapField][key[0]]
                : obj[key[0]]
        );
    });
    return objs;
}