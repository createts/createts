import { Rect } from '../base/Rect';
import { IXObjectOptions, XObject } from './XObject';
export declare class Img extends XObject {
    private src?;
    private sourceRect?;
    constructor(options?: IXObjectOptions);
    setSrc(src: string): Img;
    setSourceRect(sourceRect: Rect): Img;
    drawContent(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=Img.d.ts.map