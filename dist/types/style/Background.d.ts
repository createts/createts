import { RoundRect } from '../base/RoundRect';
import { XObject } from '../components/XObject';
export declare enum BackgroundAttachment {
    SCROLL = "scroll"
}
export declare enum BackgroundRepeat {
    REPEAT = "repeat",
    NO_REPEAT = "no-repeat",
    SPACE = "space",
    ROUND = "round"
}
export declare enum BackgroundClip {
    BORDER_BOX = "border-box",
    PADDING_BOX = "padding-box",
    CONTENT_BOX = "content-box"
}
export declare enum BackgroundOrigin {
    BORDER_BOX = "border-box",
    PADDING_BOX = "padding-box",
    CONTENT_BOX = "content-box"
}
export declare enum BackgroundSizeType {
    AUTO = 0,
    LENGTH = 1,
    PERCENTAGE = 2,
    COVER = 3,
    CONTAIN = 4
}
export declare class Background {
    static of(value: string): Background | undefined;
    private static trimParameter;
    private static parseParameters;
    private static parseImage;
    private static split;
    private static copyArray;
    private static cloneArray;
    private static getFromArray;
    private color?;
    private attachment;
    private image;
    private repeat;
    private clip;
    private origin;
    private size;
    private position;
    private blendMode;
    setColor(value: string): void;
    setAttachment(value: string): void;
    setImage(value: string): void;
    setBlendMode(value: string): void;
    setRepeat(value: string): void;
    setClip(value: string): void;
    setOrigin(value: string): void;
    setSize(value: string): void;
    setPosition(value: string): void;
    draw(target: XObject, ctx: CanvasRenderingContext2D, outerRect: RoundRect, innerRect: RoundRect): void;
    clone(): Background;
    private drawImage;
}
//# sourceMappingURL=Background.d.ts.map