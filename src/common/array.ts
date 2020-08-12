import { KV } from '../types';
import { hasOwnProperty } from './global';

export function tail<T>(array: ArrayLike<T>, n: number = 0): T | undefined {
    return array.length > n
        ? array[array.length - (1 + n)]
        : undefined;
}

export function headTail<T>(arr: ArrayLike<T>): [T, T] {
    return [arr[0], arr[arr.length - 1]];
}

export function splitTail<T>(arr: T[]): [T[], T] {
    return [arr.slice(0, arr.length - 1), arr[arr.length - 1]];
}

export function distinct<T>(arr: ReadonlyArray<T>): T[] {
    const target = new Set();
    return arr.filter(v => target.has(v) ? false : !!target.add(v));
}

export function toArray<T>(target: T | T[]): T[] {
    return Array.isArray(target) ? target : [target];
}

export function groupByField<T>(list: T[], field: string, nullKey: string = 'notField'): KV<T[]> {
    let result: KV<T[]> = { [nullKey]: [] };
    list.forEach((v: any) => {
        let targetKey = v[field];
        hasOwnProperty.call(v, field)
            ? hasOwnProperty.call(result, targetKey)
                ? result[targetKey].push(v)
                : result[targetKey] = [v]
            : result[nullKey].push(v);
    });
    return result;
}

export function split<T>(arr: T[], size: number): T[][] {
    let target: T[][] = [];
    if (arr.length > 0) {
        for (let i = 0; i < arr.length; i += size) {
            target.push(arr.slice(i, i + size));
        }
    }
    return target;
}
