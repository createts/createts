import { Rect } from '../base';
export declare enum ImageClipRotation {
    Rotation0 = 0,
    Rotation90 = 90,
    Rotation180 = 180,
    Rotation270 = 270
}
export declare class ImageClip {
    private src?;
    private image?;
    private rect?;
    private rotation;
    private scale;
    static of(clip: string, silent?: boolean): ImageClip;
    constructor(src: string, rect?: Rect, rotation?: ImageClipRotation, scale?: number);
    ready(): boolean;
    getSrc(): string;
    setImage(image: HTMLImageElement): ImageClip;
    setSrc(src: string): ImageClip;
    getRect(): Rect;
    getRotation(): ImageClipRotation;
    getScale(): number;
    setRect(rect: Rect): ImageClip;
    setRotation(rotation: ImageClipRotation): ImageClip;
    setScale(scale: number): ImageClip;
    private getImage;
    getWidth(): number;
    private needChangeSize;
    getHeight(): number;
    draw(ctx: CanvasRenderingContext2D, rect: Rect, src?: Rect): void;
    clone(): ImageClip;
}
//# sourceMappingURL=ImageClip.d.ts.map