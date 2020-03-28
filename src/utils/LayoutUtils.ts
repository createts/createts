import { XObject } from '../components/XObject';
import { Runtime } from '../runtime/Runtime';
import { Font } from '../style/Font';
import { BoxSizing } from '../style/Style';

/**
 * A class contains static layout util methods.
 */
export class LayoutUtils {
  /**
   * Prevent creating instance.
   */
  private constructor() {}

  /**
   * Update width/height according to parent size and element's style.
   *
   * @param element The element needs to update size.
   * @param parentWidth Width of parent element.
   * @param parentHeight Height of parent element.
   */
  public static updateSize(element: XObject, parentWidth: number, parentHeight: number) {
    if (element.style.width && element.style.height) {
      element.rect.width = element.style.width.getValue(parentWidth);
      element.rect.height = element.style.height.getValue(parentHeight);
    } else if (element.style.width) {
      element.rect.width = element.style.width.getValue(parentWidth);
      element.rect.height =
        element.style.aspectRatio === undefined
          ? 0
          : element.rect.width / element.style.aspectRatio;
    } else if (element.style.height) {
      element.rect.height = element.style.height.getValue(parentHeight);
      element.rect.width =
        element.style.aspectRatio === undefined
          ? 0
          : element.rect.height * element.style.aspectRatio;
    } else {
      element.rect.height = element.rect.width = 0;
    }

    if (element.style.boxSizing === BoxSizing.CONTENT_BOX) {
      element.rect.width +=
        (element.style.paddingLeft ? element.style.paddingLeft.getValue(element.rect.width) : 0) +
        (element.style.paddingRight ? element.style.paddingRight.getValue(element.rect.width) : 0) +
        (element.style.borderLeft ? element.style.borderLeft.width : 0) +
        (element.style.borderRight ? element.style.borderRight.width : 0);
      element.rect.height +=
        (element.style.paddingTop ? element.style.paddingTop.getValue(element.rect.height) : 0) +
        (element.style.paddingBottom
          ? element.style.paddingBottom.getValue(element.rect.height)
          : 0) +
        (element.style.borderTop ? element.style.borderTop.width : 0) +
        (element.style.borderBottom ? element.style.borderBottom.width : 0);
    }
  }

  /**
   * Update width/height according to parent size and element's style.
   *
   * @param element The element needs to update size.
   * @param parentWidth Width of parent element.
   * @param parentHeight Height of parent element.
   */
  public static updatePositionForAbsoluteElement(
    element: XObject,
    parentWidth: number,
    parentHeight: number
  ) {
    if (element.style.right) {
      element.rect.x =
        parentWidth -
        element.rect.width -
        element.style.right.getValue(parentWidth) -
        (element.style.marginRight ? element.style.marginRight.getValue(parentWidth) : 0);
    } else if (element.style.left) {
      element.rect.x =
        element.style.left.getValue(parentWidth) +
        (element.style.marginLeft ? element.style.marginLeft.getValue(parentWidth) : 0);
    } else {
      element.rect.x = element.style.marginLeft
        ? element.style.marginLeft.getValue(parentWidth)
        : 0;
    }

    if (element.style.bottom) {
      element.rect.y =
        parentHeight -
        element.rect.height -
        element.style.bottom.getValue(parentHeight) -
        (element.style.marginBottom ? element.style.marginBottom.getValue(parentHeight) : 0);
    } else if (element.style.top) {
      element.rect.y =
        element.style.top.getValue(parentHeight) +
        (element.style.marginTop ? element.style.marginTop.getValue(parentHeight) : 0);
    } else {
      element.rect.y = element.style.marginTop ? element.style.marginTop.getValue(parentHeight) : 0;
    }
  }

  /**
   * Measures the width of a text with specified font.
   * @param text the text to be calculated.
   * @param font the font of the text.
   * @returns The width of this text with specified font.
   */
  public static measureTextWidth(text: string, font: Font): number {
    if (text.length === 0) {
      return 0;
    }
    const canvas = Runtime.get().newCanvas();
    const ctx = canvas.getContext('2d');
    let width = 0;
    if (ctx) {
      ctx.save();
      ctx.font = font.toString();
      width = ctx.measureText(text).width;
      ctx.restore();
    }
    Runtime.get().releaseCanvas(canvas);
    return width;
  }
}
