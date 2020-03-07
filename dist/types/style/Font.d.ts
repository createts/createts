import { LineHeight } from './LineHeight';
export declare enum FontStyle {
    NORMAL = "normal",
    ITALIC = "italic",
    OBLIQUE = "oblique"
}
export declare enum FontVariant {
    NORMAL = "normal",
    SMALL_CAPS = "small-caps"
}
export declare enum FontWeight {
    NORMAL = "normal",
    BOLD = "bold",
    BOLDER = "bolder",
    W100 = "100",
    W200 = "200",
    W300 = "300",
    W400 = "400",
    W500 = "500",
    W600 = "600",
    W700 = "700",
    W800 = "800",
    W900 = "900"
}
export declare class Font {
    static DEFAULT_FONT_FAMILY: string;
    static of(value: string, silent?: boolean): Font | undefined;
    style?: FontStyle;
    variant?: FontVariant;
    weight?: FontWeight;
    size: number;
    lineHeight?: LineHeight;
    family?: string;
    constructor(style?: FontStyle, variant?: FontVariant, weight?: FontWeight, size?: number, lineHeight?: LineHeight, family?: string);
    toString(): string;
    measureTextWidth(text: string): number;
    clone(): Font;
}
//# sourceMappingURL=Font.d.ts.map