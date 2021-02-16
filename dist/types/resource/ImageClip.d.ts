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
    private scale;
    static of(clip: string): ImageClip;
    constructor(rect: Rect, rotation?: ImageClipRotation, scale?: number);
    setRect(rect: Rect): void;
    setRotation(rotation: ImageClipRotation): void;
    setScale(scale: number): void;
    getWidth(): number;
    getHeight(): number;
    draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement, rect: Rect): void;
}
//# sourceMappingURL=ImageClip.d.ts.map