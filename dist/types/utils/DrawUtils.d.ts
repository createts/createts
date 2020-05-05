import { Rect } from '../base/Rect';
import { BitmapTextSheet } from '../components/BitmapText';
import { SpriteFrame, SpriteSheet } from '../components/Sprite';
import { XObject } from '../components/XObject';
export declare class DrawUtils {
    private constructor();
    static drawElement(element: XObject, ctx: CanvasRenderingContext2D): void;
    static getFrameImage(frame: SpriteFrame, parent: SpriteSheet | BitmapTextSheet): HTMLImageElement | undefined;
    static getFrameSize(frame: SpriteFrame, parent: SpriteSheet | BitmapTextSheet): {
        width: number;
        height: number;
    };
    static drawFrame(ctx: CanvasRenderingContext2D, rect: Rect, frame: SpriteFrame, parent: SpriteSheet | BitmapTextSheet): void;
}
//# sourceMappingURL=DrawUtils.d.ts.map