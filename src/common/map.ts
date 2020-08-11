import { hasOwnProperty } from './global';

export interface IKeyIterator<K> {
    reset(key: K): this;
    next(): this;

    hasNext(): boolean;
    cmp(a: string): number;
    value(): string;
}


export function mergeList<T>(map: Map<string, T>, list: T[], key: string | Function) {
    let targetKey: any = key;
    if (typeof key === 'function') {
        list.forEach(v => {
            targetKey = key(v);
            hasOwnProperty.call(v, targetKey) && map.set(targetKey, v);
        });
    } else {
        list.forEach(v => hasOwnProperty.call(v, targetKey) && map.set(targetKey, v));
    }
}

