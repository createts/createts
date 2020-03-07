import { Point } from './base/Point';
import { Container } from './components/Container';
import { XObject } from './components/XObject';
export declare class Stage extends Container {
    canvas: HTMLCanvasElement;
    autoClear: boolean;
    private pressedChildren;
    private hovedChildren;
    constructor(canvas: HTMLCanvasElement);
    enableEvents(): void;
    reportPressedChild(child: XObject): void;
    reportHovedChild(child: XObject): void;
    handleActionEvent(type: string, pt: Point, e: any): void;
    update(): void;
    toString(): string;
    private handleTouchDownEvent;
    private handleTouchUpEvent;
    private handleTouchMoveEvent;
}
//# sourceMappingURL=Stage.d.ts.map