import { KV } from '../../types';

export type LoopHandleResult<T = any> = {
    parent?: T,
    prev?: T,
    break?: boolean,
    [key: string]: any
}

export function loopDFS(
    tree: KV,
    childFiled: string,
    handle: (current: KV, parentResult?: LoopHandleResult) => any,
    handleResult?: LoopHandleResult
) {
    const children = (tree[childFiled] || []) as [];
    handleResult = (handle(tree, handleResult) || {}) as LoopHandleResult;

    if (children.length && !handleResult.break) {
        children.forEach(node => loopDFS(node, childFiled, handle, handleResult));
    }
}

export function loopDFSTail(
    tree: KV,
    childFiled: string,
    handle: (current: KV, childrenResults: LoopHandleResult[]) => any
) {

    const children = (tree[childFiled] || []) as [],
        currentResults: LoopHandleResult[] = [];

    for (let i = 0; i < children.length; i++) {
        const prevResult = loopDFSTail(children[i], childFiled, handle);
        if (prevResult) {
            currentResults.push(prevResult);
            if (prevResult.break) break;
        }
    }

    return handle(tree, currentResults);
}
