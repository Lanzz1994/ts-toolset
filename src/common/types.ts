import { hasOwnProperty } from './global';

export function isArray(array: any): array is any[] {
    return Array.isArray(array);
}

export function isString(str: any): str is string {
    return (typeof str === 'string');
}

export function isObject(obj: any): obj is Object {
    return typeof obj === 'object'
        && obj !== null
        && !Array.isArray(obj)
        && !(obj instanceof RegExp)
        && !(obj instanceof Date);
}

export function isNumber(obj: any): obj is number {
    return (typeof obj === 'number' && !isNaN(obj));
}

export function isBoolean(obj: any): obj is boolean {
    return (obj === true || obj === false);
}

export function isUndefined(obj: any): obj is undefined {
    return (typeof obj === 'undefined');
}

export function isUndefinedOrNull(obj: any): obj is undefined | null {
    return (isUndefined(obj) || obj === null);
}

export function isEmptyObject(obj: any): obj is any {
    if (!isObject(obj)) {
        return false;
    }

    for (let key in obj) {
        if (hasOwnProperty.call(obj, key)) {
            return false;
        }
    }

    return true;
}

export function isFunction(obj: any): obj is Function {
    return (typeof obj === 'function');
}

export function isNegateEmpty(obj: any) {
    return !obj && obj !== 0 && obj !== false;
}
