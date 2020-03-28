import { XObject } from '../components/XObject';
import { Font } from '../style/Font';
export declare class LayoutUtils {
    private constructor();
    static updateSize(element: XObject, parentWidth: number, parentHeight: number): void;
    static updatePositionForAbsoluteElement(element: XObject, parentWidth: number, parentHeight: number): void;
    static measureTextWidth(text: string, font: Font): number;
}
//# sourceMappingURL=LayoutUtils.d.ts.map