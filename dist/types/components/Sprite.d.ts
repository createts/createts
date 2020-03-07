import { IXObjectOptions, XObject } from './XObject';
export declare type SpriteFrame = {
    x: number;
    y: number;
    width?: number;
    height?: number;
    image: HTMLImageElement | undefined;
};
export declare type SpriteOption = {
    width: number;
    height: number;
    fps: number;
    url: string;
    image: HTMLImageElement | undefined;
    frames: SpriteFrame[];
};
export declare class Sprite extends XObject {
    private option?;
    private currentFrame;
    private startTime;
    private pauseTime;
    private state;
    private playTimes;
    constructor(options?: IXObjectOptions);
    setOption(option: SpriteOption): this;
    play(times?: number): Sprite;
    pause(): Sprite;
    resume(): Sprite;
    stop(): Sprite;
    times(times: number): Sprite;
    setCurrentFrame(currentFrame: number): Sprite;
    toNextFrame(): Sprite;
    toPreviousFrame(): Sprite;
    private updateFramePosition;
    drawContent(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=Sprite.d.ts.map