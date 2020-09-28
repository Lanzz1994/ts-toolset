import { isEmpty } from './types';

export function fullAssign(keys: string[], callback: (param: any) => void): any;
export function fullAssign(source: any, callback: (param: any) => void): any;
export function fullAssign(source: any, callback: (param: any) => void): any {

    let objKeys = Array.isArray(source) ? source : Object.keys(source);

    const proxy = new Proxy({} as any, {
        set(target, prop, value) {
            target[prop] = value;
            let resolve = true;
            for (let key of objKeys) {
                if (isEmpty(target[key])) {
                    resolve = false;
                    break;
                }
            }
            if (resolve) {
                callback(target);
                objKeys.forEach(key => Reflect.deleteProperty(target, key));
            }
            return true;
        }
    });
    return proxy;
}

export function fullCount(end: number, callback: () => void) {

    const proxy = new Proxy({ count: 0 } as any, {
        set(target, prop, value) {
            target[prop] = value;
            if (target.count >= end) {
                callback();
                target.count = 0;
            }
            return true;
        }
    });

    return () => proxy.count += 1;
} 
