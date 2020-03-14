import { IXObjectOptions, XObject } from './XObject';
export declare class Container extends XObject {
    readonly children: XObject[];
    constructor(opt?: IXObjectOptions);
    findById(id: string): XObject | undefined;
    drawContent(ctx: CanvasRenderingContext2D): void;
    addChild(child: XObject): Container;
    addChildren(...children: XObject[]): Container;
    addChildAt(child: XObject, index: number): Container;
    removeChild(child: XObject): XObject | null;
    removeChildAt(index: number): XObject | null;
    removeAllChildren(): Container;
    getChildAt(index: number): XObject;
    sortChildren(sortFunction: (a: XObject, b: XObject) => number): Container;
    getChildIndex(child: XObject): number;
    swapChildrenAt(index1: number, index2: number): Container;
    swapChildren(child1: XObject, child2: XObject): Container;
    contains(child: XObject): boolean;
    layout(): void;
    layoutChildren(): void;
    getObjectUnderPoint(x: number, y: number, eventEnabled: boolean): XObject | undefined;
    toString(): string;
}
//# sourceMappingURL=Container.d.ts.map