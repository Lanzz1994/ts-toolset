import { KV } from '../../types';
import { JoinNode } from './types';
import { isString } from '../../common/types';
import { wrapObj } from '../../common/object';
import { mergeListToMap } from '../../common/map';
import { tail } from '../../common/array';

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

export function loopBFS(tree: KV | KV[], callback: (tree: KV) => any): void;
export function loopBFS(tree: KV | KV[], childFiled: string, callback: (tree: KV) => any): void;
export function loopBFS(tree: KV | KV[], childFiledOrCallback?: any, callback?: any) {
    let loops: KV[] = Array.isArray(tree) ? [...tree] : [tree];
    let childFiled = 'children', handle = childFiledOrCallback;
    if (isString(childFiledOrCallback)) {
        childFiled = childFiledOrCallback;
        handle = callback;
    }

    while (loops.length) {
        let current = loops.shift() as KV;
        if (handle(current) !== false)
            current[childFiled] && loops.push(...current[childFiled]);
    }
}

export type BuildTreeDataOptions = {
    key: string;
    joinNodeKey: string;
    wrapField?: string;
    childrenField?: string;
    clearJoinNode?: boolean;
}

export function buildTreeByJoinNode<T>(source: T[], { childrenField = 'children', clearJoinNode = true, ...options }: BuildTreeDataOptions) {
    const sourceMap = new Map(), treeData: any[] = [];
    mergeListToMap(sourceMap, source, options.key);
    sourceMap.forEach((n: any) => {
        if (n[options.joinNodeKey]) {
            const { right, parent }: JoinNode = n[options.joinNodeKey];
            const parentNode = parent && sourceMap.get(parent), rightNode = right && sourceMap.get(right);

            // 预设 子节点集合对象
            let children: any[] = treeData; // 没有父节点时，做为根处理
            if (parentNode) {
                // 线性数据是无序的，有可能先遍历到子节点再到父节点
                !Array.isArray(parentNode[childrenField]) && (parentNode[childrenField] = []);
                children = parentNode[childrenField];
            }
            // 上一段代码可能已经处理过空对象到情况，如果数组已经存在则不赋值
            !Array.isArray(n[childrenField]) && (n[childrenField] = []);

            // 处理 右边节点
            let index = rightNode ? children.findIndex(v => v[options.key] === rightNode[options.key]) : -1;
            index > -1 ? children.splice(index, 1, n, children[index]) : children.push(n);

            // 清除 连接节点
            clearJoinNode && options.joinNodeKey && Reflect.deleteProperty(n, options.joinNodeKey);

            // 包裹 指定属性
            options.wrapField && wrapObj(n, options.wrapField, [childrenField]);
        }
    });

    // 处理 lastChild,firstChild
    if (!clearJoinNode) {
        loopDFSTail({ [childrenField]: treeData }, childrenField, (current) => {
            if (current._node && Array.isArray(current[childrenField]) && current[childrenField].length) {
                let first = current[childrenField][0], last = tail<any>(current[childrenField]);
                current._node.firstChild = first[options.key];
                current._node.lastChild = last[options.key];
            }
        });
    }

    return treeData;
}
