import { IContainer, XObject } from './XObject';
export declare class Container extends IContainer {
    readonly children: XObject[];
    findById(id: string): XObject | undefined;
    drawContent(ctx: CanvasRenderingContext2D): void;
    addChild(child: XObject): Container;
    addChildren(...children: XObject[]): Container;
    addChildAt(child: XObject, index: number): Container;
    removeChild(child: XObject): XObject | undefined;
    removeChildAt(index: number): XObject | null;
    removeAllChildren(): Container;
    getChildAt(index: number): XObject;
    sortChildren(sortFunction: (a: XObject, b: XObject) => number): Container;
    getChildIndex(child: XObject): number;
    swapChildrenAt(index1: number, index2: number): Container;
    swapChildren(child1: XObject, child2: XObject): Container;
    layout(): void;
    layoutChildren(): void;
    getObjectUnderPoint(x: number, y: number, eventEnabled: boolean): XObject | undefined;
    load(html: string, clear?: boolean): Container;
    toString(): string;
}
//# sourceMappingURL=Container.d.ts.map