import { KVU, KV } from '../types';
import { hasOwnProperty } from './global';

export type ArrayGroupData<T> = KVU<{ alone: T[] }, T[]>;

export namespace arrutils {

    export function tail<T>(array: ArrayLike<T>, n: number = 0): T {
        return array[array.length - (1 + n)];
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

    export function groupByField<T>(list: T[], field: string, nullKey: string = 'notField') {
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

}
