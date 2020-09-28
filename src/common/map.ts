import { hasOwnProperty } from './global';

export interface IKeyIterator<K> {
    reset(key: K): this;
    next(): this;

    hasNext(): boolean;
    cmp(a: string): number;
    value(): string;
}


export function mergeListToMap<T>(map: Map<string, T>, list: T[], key: string | Function) {
    let targetKey: any = key;
    if (typeof key === 'function') {
        list.forEach((v: any) => map.set(key(v), v));
    } else {
        list.forEach((v: any) => hasOwnProperty.call(v, targetKey) && map.set(v[targetKey], v));
    }
}
