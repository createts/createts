import { Container } from './Container';
import { Stage } from './Stage';
import { IXObjectOptions } from './XObject';
export declare class Scrollable extends Container {
    private viewRect;
    private verticalSnappingSize;
    private horizontalSnappingSize;
    constructor(opt?: IXObjectOptions);
    getDefaultStyle(): {
        [key: string]: string | number;
    } | undefined;
    private fixPosition;
    scroll(delta: {
        x: number;
        y: number;
    }, enableSnapping?: boolean): void;
    onRelease(stage: Stage): void;
    layoutChildren(): void;
}
//# sourceMappingURL=Scrollable.d.ts.map