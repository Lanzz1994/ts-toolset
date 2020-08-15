import omit from 'lodash/omit';
import { KV } from '../../types';
import { deepClone } from '../../common/object';
import { isFunction } from '../../common/types';
import { loopDFSTail as treeLoopDFSTail } from '../tree/utils';
import { insert, remove, setBefore, setAfter, setFirst, setLast, destroy, bubble, loopDFSTail } from './utils';

type FormatOptions<T> = {
    format?: (data: T) => KV,
    childrenField?: string,
    useTreeForamt?: boolean,
    sourceNode?: LinkedTreeNode<T>
}

type ImportOptions<T> = {
    coverRoot?: boolean
} & FormatOptions<T>;


export interface ILinkedTreeRaw<T> {
    data: T;
    children: ILinkedTreeRaw<T>[];
}

export class LinkedTreeNode<T> {

    _parent?: LinkedTreeNode<T>;
    _prev?: LinkedTreeNode<T>;
    _next?: LinkedTreeNode<T>;
    _firstChild?: LinkedTreeNode<T>;
    _lastChild?: LinkedTreeNode<T>;
    _children: LinkedTreeNode<T>[] = [];
    data: T;

    get parent() { return this._parent }
    get prev() { return this._prev; }
    get next() { return this._next; }
    get firstChild() { return this._firstChild; }
    get lastChild() { return this._lastChild; }
    get children() { return this._children; }
    get isLeaf() { return this._children.length === 0; }
    get isRoot() { return this._parent === undefined; }

    constructor(data: T, clone: boolean = false) {
        this.data = clone ? deepClone(data) : data;
    }
}

export class LinkedTree<T> {

    private _root: LinkedTreeNode<T>;

    get root() { return this._root; }

    constructor(data: T = {} as any) {
        this._root = new LinkedTreeNode<T>(data);
    }

    setRoot(node: LinkedTreeNode<T>) {
        this._root = node;
    }

    //#region add node 
    addToBefore(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
        if (!target.isRoot) {
            insert(source, target.parent!);
            setBefore(source, target);
        }
        return this;
    }

    addToAfter(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
        if (!target.isRoot) {
            insert(source, target.parent!);
            setAfter(source, target);
        }
        return this;
    }

    addToChildrenFirst(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
        insert(source, target);
        setFirst(source, target);
        return this;
    }

    addToChildrenLast(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
        insert(source, target);
        setLast(source, target);
        return this;
    }
    //#endregion

    //#region move node 
    private _canMoveRemove(source: LinkedTreeNode<T>) {
        if (source.isRoot) {
            return false;
        } else {
            remove(source);
            return true;
        }
    }

    private _canMoveToSibling(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
        if (target.isRoot) {
            return false;
        } else {
            remove(source);
            insert(source, target._parent!);
            return true;
        }
    }

    moveToBefore(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
        this._canMoveToSibling(source, target) && setBefore(source, target);
        return this;
    }

    moveToAfter(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
        this._canMoveToSibling(source, target) && setAfter(source, target);
        return this;
    }

    moveToChildrenFirst(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
        this._canMoveRemove(source) && this.addToChildrenFirst(source, target)
        return this;
    }

    moveToChildrenLast(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
        this._canMoveRemove(source) && this.addToChildrenLast(source, target)
        return this;
    }

    moveToReplace(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
        if (this._canMoveRemove(source)) {
            setAfter(source, target);
            remove(target);
        }
        return this;
    }
    //#endregion

    //#region delete node 
    separate(target: LinkedTreeNode<T>) {
        remove(target);
    }

    remove(target: LinkedTreeNode<T>) {
        destroy(target);
    }
    //#endregion

    //#region utils 
    isAncestor(source: LinkedTreeNode<T>, ancestor: LinkedTreeNode<T>) {
        let has = false;
        bubble(source, (current) => {
            has = current === ancestor;
            return !has;
        });
        return has;
    }

    map(callback: (current: LinkedTreeNode<T>, children: any[]) => any): LinkedTree<T>;
    map(source: LinkedTreeNode<T>, callback: (current: LinkedTreeNode<T>, children: any[]) => any): LinkedTree<T>;
    map(source: any, callback?: any): LinkedTree<T> {
        let mapNode = source;
        if (isFunction(source))
            mapNode = this._root;
        loopDFSTail(mapNode, (current, childrenResults) => callback(current, childrenResults));
        return this;
    }

    bubble(source: LinkedTreeNode<T>, fn: (parent: LinkedTreeNode<T>) => boolean | void) {
        bubble(source, fn);
        return this;
    }

    import(source: KV | KV[], { sourceNode = this._root, format, childrenField = 'children', useTreeForamt = true, coverRoot }: ImportOptions<T> = {}) {

        const sourceIsArray = Array.isArray(source);

        let result = treeLoopDFSTail(sourceIsArray ? { [childrenField]: source } : source, childrenField, (current, childrenResults) => {
            let tree: LinkedTreeNode<T> = new LinkedTreeNode(
                useTreeForamt
                    ? current.data
                    : format
                        ? format(current.data)
                        : omit(current, childrenField)
            );

            childrenResults.forEach(res => this.addToChildrenLast(res.tree, tree));

            return { tree };
        }) as { tree: LinkedTreeNode<T> };

        result.tree.children.forEach((v) => this.addToChildrenLast(v, sourceNode));

        !sourceIsArray && coverRoot && (sourceNode.data = result.tree.data);

        return this;
    }

    export({ sourceNode = this._root, format, childrenField = 'children', useTreeForamt = true }: FormatOptions<T> = {}) {

        let result = loopDFSTail(sourceNode, (current, childrenResults) => {
            let fmt = format
                ? format(current.data)
                : current.data;

            let children = childrenResults.map(res => res.fmtValue);

            let fmtValue = useTreeForamt
                ? { data: fmt, children }
                : { ...fmt, [childrenField]: children };

            return { fmtValue };
        });

        return result.fmtValue;
    }
    //#endregion

}
