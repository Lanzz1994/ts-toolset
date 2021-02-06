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
    list.forEach(typeof key === 'function'
        ? (v: any) => map.set(key(v), v)
        : (v: any) => hasOwnProperty.call(v, targetKey) && map.set(v[targetKey], v)
    );
}
