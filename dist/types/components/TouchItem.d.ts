import { XObject } from './XObject';
export declare class TouchItem {
    readonly identifier: number;
    stageX: number;
    stageY: number;
    x: number;
    y: number;
    srcElement?: XObject;
    constructor(identifier: number, srcElement?: XObject, stageX?: number, stageY?: number, x?: number, y?: number);
    equals(that: TouchItem): boolean;
    clone(): TouchItem;
}
//# sourceMappingURL=TouchItem.d.ts.map