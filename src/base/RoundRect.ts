import { BaseValue } from '../base/BaseValue';
import { Rect } from '../base/Rect';
import { BorderRadius } from '../style/BorderRadius';

/**
 * This class represents an rectangle object which contains start point (x, y) and size (width, height) with radius in
 * four corners.
 */
export class RoundRect {
  /**
   * The X coordinate of the left-top corner of the Rect.
   */
  x1: number = 0;
  /**
   * The Y coordinate of the left-top corner of the Rect.
   */
  y1: number = 0;
  /**
   * The X coordinate of the right-bottom corner of the Rect.
   */
  x2: number = 0;
  /**
   * The Y coordinate of the right-bottom corner of the Rect.
   */
  y2: number = 0;

  /**
   * The X radius of the left-top corner of the Rect.
   */
  leftTopRadiusX: number = 0;
  /**
   * The Y radius of the left-top corner of the Rect.
   */
  leftTopRadiusY: number = 0;
  /**
   * The X radius of the right-top corner of the Rect.
   */
  rightTopRadiusX: number = 0;
  /**
   * The Y radius of the right-top corner of the Rect.
   */
  rightTopRadiusY: number = 0;
  /**
   * The X radius of the right-bottom corner of the Rect.
   */
  rightBottomRadiusX: number = 0;
  /**
   * The Y radius of the right-bottom corner of the Rect.
   */
  rightBottomRadiusY: number = 0;
  /**
   * The X radius of the left-bottom corner of the Rect.
   */
  leftBottomRadiusX: number = 0;
  /**
   * The Y radius of the left-bottom corner of the Rect.
   */
  leftBottomRadiusY: number = 0;

  constructor(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  /**
   * Convert current RoundRect object to a Rect object by dropping radius.
   *
   * @returns a Rect object with same position and size.
   */
  toRect(): Rect {
    return new Rect(this.x1, this.y1, this.x2 - this.x1 + 1, this.y2 - this.y1 + 1);
  }

  /**
   * Apply the given size.
   * @param width width of new size.
   * @param height height of new size.
   * @returns The current instance. Useful for chaining method calls
   */
  applySize(width: number, height: number): RoundRect {
    this.x2 = this.x1 + width - 1;
    this.y2 = this.y1 + height - 1;
    return this;
  }

  /**
   * Apply the given radius of 4 corners.
   * @param borderTopLeftRadius radius in top-left corner.
   * @param borderTopRightRadius height in top-right corner.
   * @param borderBottomLeftRadius radius in bottom-right corner.
   * @param borderBottomRightRadius radius in bottom-left corner.
   * @returns The current instance. Useful for chaining method calls.
   */
  applyRadius(
    borderTopLeftRadius?: BorderRadius,
    borderTopRightRadius?: BorderRadius,
    borderBottomLeftRadius?: BorderRadius,
    borderBottomRightRadius?: BorderRadius
  ): RoundRect {
    const width = this.x2 - this.x1 + 1;
    const height = this.y2 - this.y1 + 1;
    if (borderTopLeftRadius) {
      this.leftTopRadiusX = borderTopLeftRadius.value1.getValue(width);
      this.leftTopRadiusY = borderTopLeftRadius.value2.getValue(height);
    }
    if (borderTopRightRadius) {
      this.rightTopRadiusX = borderTopRightRadius.value1.getValue(width);
      this.rightTopRadiusY = borderTopRightRadius.value2.getValue(height);
    }
    if (borderBottomLeftRadius) {
      this.leftBottomRadiusX = borderBottomLeftRadius.value1.getValue(width);
      this.leftBottomRadiusY = borderBottomLeftRadius.value1.getValue(height);
    }
    if (borderBottomRightRadius) {
      this.rightBottomRadiusX = borderBottomRightRadius.value1.getValue(width);
      this.rightBottomRadiusY = borderBottomRightRadius.value2.getValue(height);
    }
    if (this.leftTopRadiusX + this.rightTopRadiusX > width) {
      const scale = width / (this.leftTopRadiusX + this.rightTopRadiusX);
      this.leftTopRadiusX *= scale;
      this.rightTopRadiusX *= scale;
    }
    if (this.leftBottomRadiusX + this.rightBottomRadiusX > width) {
      const scale = width / (this.leftBottomRadiusX + this.rightBottomRadiusX);
      this.leftBottomRadiusX *= scale;
      this.rightBottomRadiusX *= scale;
    }
    if (this.leftTopRadiusY + this.leftBottomRadiusY > height) {
      const scale = height / (this.leftTopRadiusY + this.leftBottomRadiusY);
      this.leftTopRadiusY *= scale;
      this.leftBottomRadiusY *= scale;
    }
    if (this.rightTopRadiusY + this.rightBottomRadiusY > height) {
      const scale = height / (this.rightTopRadiusY + this.rightBottomRadiusY);
      this.rightTopRadiusY *= scale;
      this.rightBottomRadiusY *= scale;
    }
    return this;
  }

  /**
   * Calculate the inner RoundRect by current instance and give borders in 4 directions.
   * @param top top border.
   * @param right right border.
   * @param bottom bottom border.
   * @param left left border.
   * @returns The current instance if all borders are 0, or a new RoundRect object which presents the result of current
   * instance applies the borders.
   */
  applyBorder(top: number, right: number, bottom: number, left: number): RoundRect {
    if (top === 0 && right === 0 && bottom === 0 && left === 0) {
      return this;
    }

    const rect = new RoundRect();
    rect.x1 = this.x1 + left;
    rect.y1 = this.y1 + top;
    rect.x2 = this.x2 - right;
    rect.y2 = this.y2 - bottom;

    rect.leftTopRadiusX = Math.max(0, this.leftTopRadiusX - left);
    rect.leftTopRadiusY = Math.max(0, this.leftTopRadiusY - top);
    if (rect.leftTopRadiusX === 0 || rect.leftTopRadiusY === 0) {
      rect.leftTopRadiusX = rect.leftTopRadiusY = 0;
    }
    rect.rightTopRadiusX = Math.max(0, this.rightTopRadiusX - right);
    rect.rightTopRadiusY = Math.max(0, this.rightTopRadiusY - top);
    if (rect.rightTopRadiusX === 0 || rect.rightTopRadiusY === 0) {
      rect.rightTopRadiusX = rect.rightTopRadiusY = 0;
    }
    rect.rightBottomRadiusX = Math.max(0, this.rightBottomRadiusX - right);
    rect.rightBottomRadiusY = Math.max(0, this.rightBottomRadiusY - bottom);
    if (rect.rightBottomRadiusX === 0 || rect.rightBottomRadiusY === 0) {
      rect.rightBottomRadiusX = rect.rightBottomRadiusY = 0;
    }
    rect.leftBottomRadiusX = Math.max(0, this.leftBottomRadiusX - left);
    rect.leftBottomRadiusY = Math.max(0, this.leftBottomRadiusY - bottom);
    if (rect.leftBottomRadiusX === 0 || rect.leftBottomRadiusY === 0) {
      rect.leftBottomRadiusX = rect.leftBottomRadiusY = 0;
    }
    return rect;
  }

  /**
   * Makes a path of current RouncRect object.
   * @param ctx The rendering context of target canvas.
   * @param newPath If true, start a new path, otherwise continue the previous path.
   * @param clockwise The directions of the path.
   */
  makePath(ctx: CanvasRenderingContext2D, newPath: boolean, clockwise: boolean) {
    const x1 = this.x1;
    const y1 = this.y1;
    const x2 = this.x2 + 1;
    const y2 = this.y2 + 1;

    if (clockwise) {
      if (newPath) {
        ctx.moveTo(x1, y1 + this.leftTopRadiusY);
      } else {
        ctx.lineTo(x1, y1 + this.leftTopRadiusY);
      }
      this.arcTo(x1, y1 + this.leftTopRadiusY, x1, y1, x1 + this.leftTopRadiusX, y1, ctx);
      this.arcTo(x2 - this.rightTopRadiusX, y1, x2, y1, x2, y1 + this.rightTopRadiusY, ctx);
      this.arcTo(x2, y2 - this.rightBottomRadiusY, x2, y2, x2 - this.rightBottomRadiusX, y2, ctx);
      this.arcTo(x1 + this.leftBottomRadiusX, y2, x1, y2, x1, y2 - this.leftBottomRadiusY, ctx);

      if (this.leftTopRadiusX !== 0 && this.leftTopRadiusY !== 0) {
        ctx.lineTo(x1, y1 + this.leftTopRadiusY);
      } else {
        ctx.lineTo(x1, y1);
      }
    } else {
      if (newPath) {
        ctx.moveTo(x1, y1 + this.leftTopRadiusY);
      } else {
        ctx.lineTo(x1, y1 + this.leftTopRadiusY);
      }
      this.arcTo(x1, y2 - this.leftBottomRadiusY, x1, y2, x1 + this.leftBottomRadiusX, y2, ctx);
      this.arcTo(x2 - this.rightBottomRadiusX, y2, x2, y2, x2, y2 - this.rightBottomRadiusY, ctx);
      this.arcTo(x2, y1 + this.rightTopRadiusY, x2, y1, x2 - this.rightTopRadiusX, y1, ctx);
      this.arcTo(x1 + this.leftTopRadiusX, y1, x1, y1, x1, y1 + this.leftTopRadiusY, ctx);
    }
  }

  /**
   * Make a clip of current RoundRect object to a canvas.
   * @param ctx The rendering context of target canvas.
   * @returns The current instance. Useful for chaining method calls.
   */
  clip(ctx: CanvasRenderingContext2D): RoundRect {
    ctx.beginPath();
    this.makePath(ctx, true, true);
    ctx.closePath();
    ctx.clip();
    return this;
  }

  /**
   * Adds a circular arc to the current sub-path, using the given control points and radius.
   * @param x1 The X coordinate of the source point.
   * @param y1 The Y coordinate of the source point.
   * @param x0 The X coordinate of the corner point.
   * @param y0 The Y coordinate of the corner point.
   * @param x2 The X coordinate of the destination point.
   * @param y2 The Y coordinate of the destination point.
   * @param ctx The rendering context of target canvas.
   * @returns The current instance. Useful for chaining method calls.
   */
  private arcTo(
    x1: number,
    y1: number,
    x0: number,
    y0: number,
    x2: number,
    y2: number,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.lineTo(x1, y1);
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    const min = 0.000001;
    if (dx < min && dy < min) {
      return;
    } else if (dx < min || dy < min) {
      ctx.lineTo(x2, y2);
    } else {
      if (Math.abs(dx - dy) < min) {
        ctx.arcTo(x0, y0, x2, y2, dx);
      } else {
        ctx.quadraticCurveTo(x0, y0, x2, y2);
      }
    }
  }
}
