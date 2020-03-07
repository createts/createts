import { Rect } from '../base/Rect';
import { IXObjectOptions, XObject } from './XObject';
export declare class ImageIcon extends XObject {
    private imageName?;
    private sourceRect?;
    constructor(options?: IXObjectOptions);
    setImageName(imageName: string): ImageIcon;
    setSourceRect(sourceRect: Rect): ImageIcon;
    drawContent(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=ImageIcon.d.ts.map