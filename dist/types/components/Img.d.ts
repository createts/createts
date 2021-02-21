import { Rect } from '../base/Rect';
import { IXObjectOptions, XObject } from './XObject';
export declare class Img extends XObject {
    private imageClip;
    constructor(options?: IXObjectOptions);
    setSrc(src: string): Img;
    setImage(image?: HTMLImageElement): Img;
    setSourceRect(sourceRect: Rect): Img;
    calculateSize(): void;
    drawContent(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=Img.d.ts.map