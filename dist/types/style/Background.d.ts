import { BaseValue } from '../base/BaseValue';
import { Color } from '../base/Color';
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
interface IBackgroundSource extends ICloneable<IBackgroundSource> {
    getSource(width: number, height: number): any;
    toString(): string;
    destory(): void;
}
interface ICloneable<T> {
    clone(): T;
}
declare class BackgroundRepeatPair implements ICloneable<BackgroundRepeatPair> {
    static of(value: string): BackgroundRepeatPair | undefined;
    static toBaseValue(value: string): BaseValue;
    x: BackgroundRepeat;
    y: BackgroundRepeat;
    constructor(x: BackgroundRepeat, y: BackgroundRepeat);
    clone(): BackgroundRepeatPair;
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
declare class BackgroundSizePair implements ICloneable<BackgroundSizePair> {
    static of(value: string): BackgroundSizePair;
    static toBaseValue(value: string): BaseValue;
    x: BaseValue;
    y: BaseValue;
    constructor(x: BaseValue, y: BaseValue);
    clone(): BackgroundSizePair;
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
    color?: Color;
    attachment: BackgroundAttachment[];
    image: (IBackgroundSource | undefined)[];
    repeat: BackgroundRepeatPair[];
    clip: BackgroundClip[];
    origin: BackgroundOrigin[];
    size: BackgroundSizePair[];
    position: BackgroundSizePair[];
    blendMode: string[];
    setColor(value: string | Color): void;
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
export {};
//# sourceMappingURL=Background.d.ts.map