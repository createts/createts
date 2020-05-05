import { SpriteFrame } from './Sprite';
import { IXObjectOptions, XObject } from './XObject';
export declare type BitmapTextSheet = {
    width?: number;
    height?: number;
    url?: string;
    image?: HTMLImageElement;
    texts: {
        [key: string]: SpriteFrame;
    };
    gapX?: number;
    gapY?: number;
};
export declare class BitmapText extends XObject {
    private text;
    private bitmapTextSheet?;
    constructor(options?: IXObjectOptions);
    setBitmapTextSheet(bitmapTextSheet: BitmapTextSheet): void;
    setText(text: string): void;
    getText(): string;
    drawContent(ctx: CanvasRenderingContext2D): boolean;
    layout(): void;
}
//# sourceMappingURL=BitmapText.d.ts.map