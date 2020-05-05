import { AnimationProps, AnimationValues } from '../animation/Animation';
import { BaseValue } from '../base/BaseValue';
import { Color } from '../base/Color';
import { XObject } from '../components/XObject';
import { Background } from './Background';
import { Border } from './Border';
import { BorderRadius } from './BorderRadius';
import { Font } from './Font';
import { LineHeight } from './LineHeight';
import { Shadow } from './Shadow';
export declare enum BoxSizing {
    CONTENT_BOX = "content-box",
    BORDER_BOX = "border-box"
}
export declare enum TextAlign {
    LEFT = "left",
    RIGHT = "right",
    CENTER = "center"
}
export declare enum VerticalAlign {
    TOP = "top",
    BOTTOM = "bottom",
    MIDDLE = "middle"
}
export declare enum Position {
    STATIC = "static",
    RELATIVE = "relative",
    ABSOLUTE = "absolute",
    FIXED = "fixed"
}
export declare enum Display {
    INLINE = "inline",
    BLOCK = "block",
    NONE = "none"
}
export declare enum Overflow {
    VISIBLE = "visible",
    HIDDEN = "hidden"
}
export declare enum TextBorderPosition {
    OUTER = "outer",
    INNER = "inner"
}
export declare enum PointerEvents {
    AUTO = "auto",
    NONE = "none"
}
export declare enum Visibility {
    VISIBLE = "visible",
    HIDDEN = "hidden"
}
export declare class Style {
    static of(value: string): Style;
    static parse(value: string): {
        [key: string]: string;
    };
    width?: BaseValue;
    height?: BaseValue;
    position: Position;
    display: Display;
    left?: BaseValue;
    right?: BaseValue;
    top?: BaseValue;
    bottom?: BaseValue;
    paddingTop?: BaseValue;
    paddingRight?: BaseValue;
    paddingBottom?: BaseValue;
    paddingLeft?: BaseValue;
    marginTop?: BaseValue;
    marginRight?: BaseValue;
    marginBottom?: BaseValue;
    marginLeft?: BaseValue;
    perspectiveOriginX: BaseValue;
    perspectiveOriginY: BaseValue;
    transformX: BaseValue;
    transformY: BaseValue;
    alpha: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
    shadow?: Shadow;
    visibility: Visibility;
    background?: Background;
    boxSizing: BoxSizing;
    color: Color;
    font?: Font;
    lineHeight?: LineHeight;
    textAlign?: TextAlign;
    verticalAlign?: VerticalAlign;
    borderTopLeftRadius?: BorderRadius;
    borderTopRightRadius?: BorderRadius;
    borderBottomLeftRadius?: BorderRadius;
    borderBottomRightRadius?: BorderRadius;
    borderTop?: Border;
    borderRight?: Border;
    borderBottom?: Border;
    borderLeft?: Border;
    overflow: Overflow;
    compositeOperation?: string;
    aspectRatio?: number;
    filter?: string;
    cursor?: string;
    pointerEvents: PointerEvents;
    textBorder?: Border;
    textBorderPosition?: TextBorderPosition;
    textShadow?: Shadow;
    apply(attrs: {
        [key: string]: string | number;
    }): Style;
    getSnapshotForAnimation(target: XObject, props: AnimationValues): AnimationProps;
    applyAnimationResult(result: AnimationValues): void;
    clone(): Style;
    private fillSnapshotForAnimation;
    private static calculateAnimationBaseValue;
    private static parseBorderRadius;
    private static parse4Dirs;
    private normalize;
}
//# sourceMappingURL=Style.d.ts.map