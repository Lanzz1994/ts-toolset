import update, { extend } from 'immutability-helper';
import { isObject } from './types';
export * from 'immutability-helper';
export default update;

extend('$moia', function ([indexKey, indexValue, targetKey, targetValue], object) {
    if (Array.isArray(object)) {
        const target = object.find(v => v[indexKey] === indexValue);
        typeof target === 'object' && (target[targetKey] = targetValue);
    }
});

extend('$update', function ([key, value], object) {
    isObject(object) && Reflect.set(object, key, value);
});
