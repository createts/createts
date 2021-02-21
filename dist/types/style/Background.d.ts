import { BaseValue } from '../base/BaseValue';
import { Color } from '../base/Color';
import { Rect } from '../base/Rect';
import { RoundRect } from '../base/RoundRect';
import { XObject } from '../components/XObject';
export declare enum BackgroundAttachment {
    SCROLL = "scroll"
}
interface IBgAttribute<T> {
    clone(): T;
}
interface IBackgroundImage extends IBgAttribute<IBackgroundImage> {
    draw(ctx: CanvasRenderingContext2D, rect: Rect, srcRect?: Rect): void;
    ready(): boolean;
    width(originRect: Rect): number;
    height(originRect: Rect): number;
    toString(): string;
    destroy(): void;
}
export declare enum BackgroundRepeatType {
    REPEAT = "repeat",
    NO_REPEAT = "no-repeat",
    SPACE = "space",
    ROUND = "round"
}
declare class BackgroundRepeat implements IBgAttribute<BackgroundRepeat> {
    static DEFAULT: BackgroundRepeat;
    static of(tokens: string[]): BackgroundRepeat | undefined;
    readonly x: BackgroundRepeatType;
    readonly y: BackgroundRepeatType;
    constructor(x: BackgroundRepeatType, y: BackgroundRepeatType);
    clone(): BackgroundRepeat;
}
export declare enum BackgroundClip {
    BORDER_BOX = "border-box",
    PADDING_BOX = "padding-box",
    CONTENT_BOX = "content-box"
}
export declare enum BackgroundSizeType {
    AUTO = "auto",
    COVER = "cover",
    CONTAIN = "contain",
    VALUE = "value"
}
declare class BackgroundSize implements IBgAttribute<BackgroundSize> {
    static DEFAULT: BackgroundSize;
    static of(tokens: string[]): BackgroundSize | undefined;
    readonly xType: BackgroundSizeType;
    readonly yType: BackgroundSizeType;
    readonly x: BaseValue;
    readonly y: BaseValue;
    constructor(xType: BackgroundSizeType, x: BaseValue, yType: BackgroundSizeType, y: BaseValue);
    clone(): BackgroundSize;
}
declare enum BackgroundPositionType {
    LEFT = "left",
    TOP = "top",
    CENTER = "center",
    BOTTOM = "bottom",
    RIGHT = "right"
}
declare class BackgroundPosition implements IBgAttribute<BackgroundPosition> {
    static DEFAULT: BackgroundPosition;
    static acceptToken(token: string): boolean;
    static of(tokens: string[]): BackgroundPosition | undefined;
    readonly xDir: BackgroundPositionType;
    readonly yDir: BackgroundPositionType;
    readonly x: BaseValue;
    readonly y: BaseValue;
    constructor(xDir: BackgroundPositionType, x: BaseValue, yDir: BackgroundPositionType, y: BaseValue);
    clone(): BackgroundPosition;
}
export declare class Background {
    static of(value: string, silent?: boolean): Background | undefined;
    private static parseImage;
    private static split;
    private static copyArray;
    private static cloneArray;
    private static getFromArray;
    color?: Color;
    attachment: BackgroundAttachment[];
    image: IBackgroundImage[];
    repeat: BackgroundRepeat[];
    clip: BackgroundClip[];
    origin: BackgroundClip[];
    size: BackgroundSize[];
    position: BackgroundPosition[];
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