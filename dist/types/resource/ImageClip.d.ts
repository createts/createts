import { Rect } from '../base';
export declare enum ImageClipRotation {
    Rotation0 = 0,
    Rotation90 = 90,
    Rotation180 = 180,
    Rotation270 = 270
}
export declare class ImageClip {
    private rect;
    private rotation;
    static of(clip: string): ImageClip;
    constructor(rect: Rect, rotation?: ImageClipRotation);
    setRect(rect: Rect): void;
    setRotation(rotation: ImageClipRotation): void;
    getWidth(): number;
    getHeight(): number;
    draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement, rect: Rect): void;
}
//# sourceMappingURL=ImageClip.d.ts.map