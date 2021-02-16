import { Rect } from '../base/Rect';
import { ImageClip } from '../resource/ImageClip';
import { IXObjectOptions, XObject } from './XObject';
export declare class Img extends XObject {
    private src?;
    private image?;
    private imageClip?;
    constructor(options?: IXObjectOptions);
    setSrc(src: string): Img;
    setImage(image: HTMLImageElement): Img;
    setSourceRect(sourceRect: Rect): Img;
    setImageClip(imageClip: ImageClip): Img;
    calculateSize(): void;
    drawContent(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=Img.d.ts.map