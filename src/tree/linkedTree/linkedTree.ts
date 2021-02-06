import omit from 'lodash/omit';
import { KV } from '../../types';
import { IDisposable } from '../../common';
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
    get hasParent() { return this._parent !== undefined; }

    constructor(data: T, clone: boolean = false) {
        this.data = clone ? deepClone(data) : data;
    }

    hasAncestor(ancestor: LinkedTreeNode<T>) {
        let has = false;
        bubble(this, (current) => {
            has = current === ancestor;
            return !has;
        });
        return has;
    }

    getNodeHeight(root?: LinkedTreeNode<T>) {

        let distance: number = 0;
        if (!this.hasParent) return distance;
        if (root && this === root) return distance;

        let complete = bubble(this, (current) => {
            distance++;
            if (root) {
                return current !== root;
            }
        });
        return root && complete ? -1 : distance;
    }

}

export class LinkedTree<T> implements IDisposable {

    private _root: LinkedTreeNode<T>;

    get root() { return this._root; }

    constructor(data: T = {} as any) {
        this._root = new LinkedTreeNode<T>(data);
    }

    isRoot(target: LinkedTreeNode<T>) {
        this._root === target;
    }

    setRoot(data: T): LinkedTree<T>;
    setRoot(node: LinkedTreeNode<T> | T): LinkedTree<T>;
    setRoot(node: LinkedTreeNode<T> | T): any {
        this._root = node instanceof LinkedTreeNode
            ? node
            : new LinkedTreeNode(node);
        return this;
    }

    //#region add node 
    addToBefore(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
        if (!target.hasParent) {
            insert(source, target.parent!);
            setBefore(source, target);
        }
        return this;
    }

    addToAfter(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
        if (!target.hasParent) {
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
        if (source.hasParent) {
            remove(source);
            return true;
        }
        return false;
    }

    private _canMoveToSibling(source: LinkedTreeNode<T>, target: LinkedTreeNode<T>) {
        if (target.hasParent) {
            remove(source);
            insert(source, target._parent!);
            return true;
        }
        return false;
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
        this._canMoveRemove(source) && this.addToChildrenFirst(source, target);
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
        return this;
    }

    remove(target: LinkedTreeNode<T>) {
        destroy(target);
        return this;
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

    map(callback: (current: LinkedTreeNode<T>, children: any) => any): any;
    map(source: LinkedTreeNode<T>, callback: (current: LinkedTreeNode<T>, children: any) => any): any;
    map(source: any, callback?: any): any {
        let mapNode = source;
        if (isFunction(source))
            mapNode = this._root;
        return loopDFSTail(mapNode, (current, childrenResults) => callback(current, childrenResults));
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

    dispose() {
        loopDFSTail(this._root, destroy);
        return this;
    }
    //#endregion

}
