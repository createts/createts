export declare class TouchItem {
    readonly identifier: number;
    readonly stageX: number;
    readonly stageY: number;
    x: number;
    y: number;
    constructor(identifier: number, stageX: number, stageY: number, x: number, y: number);
    equals(that: TouchItem): boolean;
    clone(): TouchItem;
}
//# sourceMappingURL=TouchItem.d.ts.map