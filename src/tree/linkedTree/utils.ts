import { LinkedTreeNode } from './linkedTree';

export function insert<T>(tree: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
    tree._parent = target;
    target._children.push(tree);
}

export function setFirst<T>(tree: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
    if (target._firstChild && target.children.length > 1) {
        tree._next = target._firstChild;
        target._firstChild._prev = tree;
        target._firstChild = tree;
    } else {
        target._firstChild = tree;
        target._lastChild = tree;
    }
    if (tree._prev) tree._prev = undefined;
}

export function setLast<T>(tree: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
    if (target._lastChild && target.children.length > 1) {
        target._lastChild._next = tree;
        tree._prev = target._lastChild;
        target._lastChild = tree;
    } else {
        target._firstChild = tree;
        target._lastChild = tree;
    }
    if (tree._next) tree._next = undefined;
}

export function setBefore<T>(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
    if (target._parent) {
        let prev = target._prev;
        source._next = target;
        if (prev) {
            source._prev = prev;
            prev._next = source;
            target._prev = source;
        } else {
            target._prev = source;
            target._parent._firstChild = source;
        }
    }
}

export function setAfter<T>(tree: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
    if (target._parent) {
        let next = target._next;
        tree._prev = target;
        if (next) {
            tree._next = next;
            next._prev = tree;
            target._next = tree;
        } else {
            target._next = tree;
            target._parent._lastChild = tree;
        }
    }
}

function cutPrev<T>(tree: LinkedTreeNode<T>) {
    //处理第一个节点
    if (tree._prev) {
        tree._prev._next = tree._next;
    } else {
        tree._parent!._firstChild = tree._next;
        if (tree._next) { tree._next._prev = undefined }
    }
}

function cutNext<T>(tree: LinkedTreeNode<T>) {
    if (tree._next) {
        tree._next._prev = tree._prev;
    } else {
        tree._parent!._lastChild = tree._prev;
        if (tree._prev) { tree._prev._next = undefined }
    }
}

function cutJoin<T>(tree: LinkedTreeNode<T>) {
    tree._prev = undefined;
    tree._next = undefined;
}

export function cutLinked<T>(tree: LinkedTreeNode<T>, afterSibling?: LinkedTreeNode<T>) {
    let cuts: LinkedTreeNode<T>[] = [tree];
    if (tree._parent) {

        let hasAfter = afterSibling && tree._parent._children.indexOf(afterSibling) > -1;

        cutPrev(tree);
        cutNext(hasAfter ? afterSibling! : tree);
        cutJoin(hasAfter ? afterSibling! : tree);

        let temp = tree;
        if (hasAfter) {
            while (temp !== afterSibling) {
                temp._parent = undefined;
                cuts.push(temp);
                temp = temp._next!;
            }
            temp._parent = undefined;
            cuts.push(temp);
        } else tree._parent = undefined;
    }
    return cuts;
}

export function remove<T>(tree: LinkedTreeNode<T>) {
    if (tree._parent) {
        let index = tree._parent._children.indexOf(tree);
        if (index > -1) {
            tree._parent._children.splice(index, 1);
            cutLinked(tree);
            return tree;
        }
    }
}

export function destroy<T>(tree: LinkedTreeNode<T>) {
    remove(tree);
    tree.data = undefined as any;
    tree._firstChild = undefined;
    tree._lastChild = undefined;
    tree._children = [];
}

export type LoopHandleResult<T = any> = {
    parent?: T,
    prev?: T,
    break?: boolean,
    [key: string]: any
}

export function loopDFS<T>(
    tree: LinkedTreeNode<T>,
    handle: (current: LinkedTreeNode<T>, parentResult?: LoopHandleResult) => any,
    handleResult?: LoopHandleResult
) {

    let subTree = tree._firstChild;
    handleResult = (handle(tree, handleResult) || {}) as LoopHandleResult;

    while (subTree && !handleResult.break) {
        loopDFS<T>(subTree, handle, handleResult);
        subTree = subTree._next;
    }
}

export function loopDFSTail<T>(
    tree: LinkedTreeNode<T>,
    handle: (current: LinkedTreeNode<T>, childrenResults: LoopHandleResult[]) => any
) {
    let subTree = tree._firstChild,
        currentResults: LoopHandleResult[] = [];

    while (subTree) {
        let prevResult = loopDFSTail<T>(subTree, handle);
        if (prevResult) {
            currentResults.push(prevResult);
            if (prevResult.break) break;
        }
        subTree = subTree._next;
    }
    return handle(tree, currentResults);
}

export function bubble<T>(tree: LinkedTreeNode<T>, handle: (current: LinkedTreeNode<T>) => boolean | void) {
    let top: LinkedTreeNode<T> = tree,
        complete: boolean = true;
    while (top._parent) {
        if (handle(top) === false) {
            complete = false;
            break;
        }
        top = top._parent;
    }
    return complete;
}

