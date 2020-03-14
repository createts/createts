import { Stage } from './Stage';
import { IXObjectOptions, XObject } from './XObject';
export declare type SpriteSheet = {
    width: number;
    height: number;
    fps: number;
    url?: string;
    image?: HTMLImageElement;
    frames: SpriteFrame[];
};
export declare type SpriteFrame = {
    srcX?: number;
    srcY?: number;
    srcWidth?: number;
    srcHeight?: number;
    destX?: number;
    destY?: number;
    destWidth?: number;
    destHeight?: number;
    image?: HTMLImageElement;
};
export declare class Sprite extends XObject {
    spriteSheet?: SpriteSheet;
    currentFrame: number;
    private animation?;
    constructor(options?: IXObjectOptions);
    setSpriteSheet(spriteSheet: SpriteSheet): Sprite;
    getStage(): Stage | undefined;
    play(times?: number): Sprite;
    pause(): Sprite;
    resume(): Sprite;
    stop(): Sprite;
    times(times: number): Sprite;
    setCurrentFrame(currentFrame: number): Sprite;
    toNextFrame(): Sprite;
    toPreviousFrame(): Sprite;
    drawContent(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=Sprite.d.ts.map