import { XObject } from './XObject';
export declare type TouchPosition = {
    x: number;
    y: number;
    timestamp: number;
};
export declare type Velocity = {
    speed: number;
    direction: number;
};
export declare class TouchItem {
    readonly identifier: number;
    readonly srcElement?: XObject;
    readonly srcTimestamp: number;
    readonly srcStageX: number;
    readonly srcStageY: number;
    private velocityTracker?;
    pressed: boolean;
    timestamp: number;
    speed: number;
    direction: number;
    stageX: number;
    stageY: number;
    currentTarget?: XObject;
    x: number;
    y: number;
    constructor(identifier: number, srcElement: XObject, stageX: number, stageY: number, timestamp: number);
    switchSourceElement(srcElement: XObject): TouchItem;
    onUpdate(item: TouchItem): void;
    clone(): TouchItem;
}
//# sourceMappingURL=TouchItem.d.ts.map