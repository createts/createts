import { Event, EventDispatcher } from '../base/Event';
import { Matrix2D } from '../base/Matrix2D';
import { Point } from '../base/Point';
import { Rect } from '../base/Rect';
import { RoundRect } from '../base/RoundRect';
import { Runtime } from '../runtime/Runtime';
import { Display, PointerEvents, Style, Visibility } from '../style/Style';
import { DrawUtils } from '../utils/DrawUtils';
import { LayoutUtils } from '../utils/LayoutUtils';
import { Container } from './Container';
import { Stage } from './Stage';
import { TouchItem } from './TouchItem';

/**
 * This class represents an event object for both touch event (in mobile devices) and mouse event
 * (in desktop).
 */
export class TouchEvent extends Event {
  /**
   * The stage object of the target element.
   */
  public stage?: Stage;
  /**
   * The native event, note that the location of this event is not transferred to the stage.
   */
  public nativeEvent: any = null;
  /**
   * The identifier of this TouchItem, used to track a serial of touch events.
   */
  readonly identifier: number;
  /**
   * The X coordinate of this TouchItem in the stage.
   */
  readonly stageX: number;
  /**
   * The Y coordinate of this TouchItem in the stage.
   */
  readonly stageY: number;
  /**
   * The X coordinate of this TouchItem in the current element.
   */
  public x: number;
  /**
   * The Y coordinate of this TouchItem in the current element.
   */
  public y: number;
  /**
   * A reference to the currently registered target for the event. This is the object to which the
   * event is currently slated to be sent. It's possible this has been changed along the way
   * through re-targeting.
   */
  public currentTarget: XObject;

  /**
   * The source element of this event.
   */
  public readonly srcElement: XObject;

  /**
   * Creates an instance of TouchEvent.
   * @param srcElement The source element of this event.
   * @param type Event type.
   * @param bubbles Indicates whether the event bubbles up through its parents or not.
   * @param touch Contains location and identifier of this touch event.
   * @param cancelable Interface indicates whether the event can be canceled, and
   * therefore prevented as if the event never happened.
   */
  constructor(
    srcElement: XObject,
    type: string,
    bubbles: boolean = true,
    touch?: TouchItem,
    cancelable: boolean = true
  ) {
    super(type, bubbles, cancelable);
    this.srcElement = srcElement;
    if (touch) {
      this.identifier = touch.identifier;
      this.stageX = touch.stageX;
      this.stageY = touch.stageY;
      this.x = touch.x;
      this.y = touch.y;
    }
    this.currentTarget = srcElement;
  }

  /**
   * Returns a string representation of this TouchEvent object.
   * @returns a string representation of this TouchEvent object.
   */
  toString() {
    return '[TouchEvent (type=' + this.type + ')]';
  }
}

/**
 * Indicates the cache state of this object.
 */
enum CacheState {
  /**
   * Never cache this object.
   */
  DISABLED = 1,
  /**
   * Already cached this object to an offscreen canvas.
   */
  CACHED = 2,
  /**
   * Cache is enabled for the current object, but it is invalidate, and will be updated in next
   * render time.
   */
  INVALIDATE = 3
}

/**
 * Options to create an XObject instance.
 */
export interface IXObjectOptions {
  style: Style;
  attributes: { [key: string]: string };
  text?: string;
}

/**
 * This class represents an basic object (XObject), contains id, style, cache and cache status,
 * etc.
 */
export class XObject extends EventDispatcher<TouchEvent> {
  /**
   * The string if of this object.
   */
  public id?: string = undefined;
  /**
   * The style of this object.
   */
  public style: Style;
  /**
   * The calculated location and size of this object.
   * Note: it is a computed result, do not change it manually, it maybe re-calculated in next
   * layout process.
   */
  public rect: Rect = new Rect(0, 0, 0, 0);
  /**
   * Parent object of this object.
   */
  public parent?: Container;
  /**
   * The cached canvas.
   */
  private cacheCanvas?: HTMLCanvasElement;
  /**
   * Cache state, by default it is not cached.
   * Note that enabling cache does not always improve the performance, if this instance is a image
   * there is no performance gain, or its size is bigger but simple to draw, enabling cache may
   * hurt performance.
   */
  private cacheState: CacheState = CacheState.DISABLED;

  /**
   * Creates a XObject instance.
   * @param opt The options to create this object.
   */
  constructor(opt?: IXObjectOptions) {
    super();
    this.style = opt && opt.style ? opt.style : new Style();
    if (opt && opt.attributes.id) {
      this.id = opt.attributes.id;
    }
  }

  /**
   * This this element from its parent.
   */
  public remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

  /**
   * Dispatches an event from current element and bubbles up through its parents.
   * @param event The event to be dispatched.
   * @returns True if the event is prevented, false otherwise.
   */
  public dispatchEvent(event: TouchEvent): boolean {
    if (!event.bubbles || !this.parent) {
      this.doDispatchEvent(event);
    } else {
      let element: XObject = this;
      // To avoid issues with items being removed or added during the dispatch
      const queue: XObject[] = [element];

      while (element.parent) {
        queue.push(element.parent);
        element = element.parent;
      }

      // Bubbling
      for (const ele of queue) {
        event.currentTarget = ele;
        if (event.propagationStopped) {
          break;
        }
        ele.doDispatchEvent(event);
      }
    }
    return !event.defaultPrevented;
  }

  /**
   * Checks whether this element is visible.
   * @returns True if it is visible, false otherwise.
   */
  public isVisible(): boolean {
    return !!(
      this.style.visibility !== Visibility.HIDDEN &&
      this.style.display !== Display.NONE &&
      this.style.alpha > 0 &&
      this.style.scaleX > 0 &&
      this.style.scaleY > 0
    );
  }

  /**
   * Checks whether this element enables pointer events.
   * @returns True if it enables pointer events, false otherwise.
   */
  public isPointerEventsEnabled(): boolean {
    return this.style.pointerEvents !== PointerEvents.NONE;
  }

  /**
   * Returns the offscreen cache canvas.
   * @returns The offscreen cache canvas.
   */
  public getCacheCanvas(): HTMLCanvasElement | undefined {
    return this.cacheCanvas;
  }

  /**
   * Checks whether this element is cache enabled.
   * Note that it returns true for an invalidate cache state.
   * @returns True if it is cache enabled, false otherwise.
   */
  public isCached(): boolean {
    return this.cacheState !== CacheState.DISABLED;
  }

  /**
   * Enable cache for this element.
   */
  public cache() {
    if (this.cacheState !== CacheState.CACHED) {
      this.cacheState = CacheState.INVALIDATE;
    }
  }

  /**
   * Disable cache for this element.
   */
  public uncache() {
    this.cacheState = CacheState.DISABLED;
    delete this.cacheCanvas;
  }

  /**
   * Marks the cache is invalidate and update in next render cycle.
   */
  public invalidateCache() {
    if (this.cacheState === CacheState.DISABLED) {
      console.warn('Cache does not enabled for ' + this.toString());
      return;
    }
    this.cacheState = CacheState.INVALIDATE;
  }

  /**
   * Draws the image to stage canvas.
   * @param ctx The canvas rendering context of stage canvas.
   * @param ignoreCache If true, always not use cache.
   */
  public draw(ctx: CanvasRenderingContext2D, ignoreCache: boolean = false) {
    ctx.filter = this.style.filter || 'none';
    if (!ignoreCache && this.cacheState !== CacheState.DISABLED) {
      if (!this.cacheCanvas) {
        this.cacheCanvas = Runtime.get().newCanvas();
      }
      if (this.cacheState !== CacheState.CACHED) {
        this.cacheCanvas.width = this.rect.width;
        this.cacheCanvas.height = this.rect.height;
        const cacheCtx = this.cacheCanvas.getContext('2d');
        if (cacheCtx) {
          DrawUtils.drawElement(this, cacheCtx);
        }
        this.cacheState = CacheState.CACHED;
      }
      ctx.drawImage(this.cacheCanvas, 0, 0, this.rect.width, this.rect.height);
    } else {
      DrawUtils.drawElement(this, ctx);
    }
  }

  /**
   * Draws the background of this element to targeted canvas.
   * @param ctx The canvas rendering context of targeted canvas.
   * @param outerRect the outer position of border of this element.
   * @param innerRect the inner position of border of this element.
   */
  public drawBackground(ctx: CanvasRenderingContext2D, outerRect: RoundRect, innerRect: RoundRect) {
    if (this.style.background) {
      this.style.background.draw(this, ctx, outerRect, innerRect);
    }
  }

  /**
   * Draws content of this element to targeted canvas.
   * @param ctx The canvas rendering context of targeted canvas.
   */
  public drawContent(ctx: CanvasRenderingContext2D) {
    return;
  }

  /**
   * Applies this object's transformation and alpha to the specified context. This is typically
   * called prior to 'draw' function.
   * @param ctx The canvas rendering context to update.
   */
  public updateContext(ctx: CanvasRenderingContext2D) {
    const mtx: Matrix2D = this.getMatrix();
    ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
    ctx.globalAlpha *= this.style.alpha;
  }

  /**
   * Transforms the specified x and y position from the coordinate space of this object to the
   * stage coordinate space.
   * @param x The x position in the source object to transform.
   * @param y The y position in the source object to transform.
   * @returns A Point instance with x and y properties correlating to the transformed coordinates.
   */
  public localToGlobal(x: number, y: number): Point {
    return this.getConcatenatedMatrix().transformPoint(x, y);
  }

  /**
   * Transforms the specified x and y position from the stage coordinate space to the coordinate
   * space of this object.
   * @param x The x position in the source object to transform.
   * @param y The y position in the source object to transform.
   * @returns A Point instance with x and y properties correlating to the transformed coordinates.
   */
  public globalToLocal(x: number, y: number): Point {
    return this.getConcatenatedMatrix()
      .invert()
      .transformPoint(x, y);
  }

  /**
   * Transforms the specified x and y position from the coordinate space of this object to the
   * coordinate space of the target object.
   * @param x The x position in the source object to transform.
   * @param y The y position on the source object to transform.
   * @param target The target object to which the coordinates will be transformed.
   * @returns Returns a Point instance with x and y properties correlating to the transformed
   * position in the target's coordinate space.
   */
  public localToLocal(x: number, y: number, target: XObject): Point {
    const pt = this.localToGlobal(x, y);
    return target.globalToLocal(pt.x, pt.y);
  }

  /**
   * Returns a matrix based on this object's current transform.
   * @param matrix Optional. A Matrix2D object to populate with the calculated values.
   * If null, a new Matrix2D object is returned.
   * @return A matrix representing this object's transform.
   */
  public getMatrix(matrix?: Matrix2D): Matrix2D {
    const mtx = (matrix && matrix.identity()) || new Matrix2D();
    const cx = this.style.perspectiveOriginX.getValue(this.rect.width);
    const cy = this.style.perspectiveOriginY.getValue(this.rect.height);
    return mtx.appendTransform(
      this.rect.x + cx + this.style.transformX.getValue(this.rect.width),
      this.rect.y + cy + this.style.transformY.getValue(this.rect.height),
      this.style.scaleX,
      this.style.scaleY,
      this.style.rotation,
      this.style.skewX,
      this.style.skewY,
      cx,
      cy
    );
  }

  /**
   * Generates a Matrix2D object representing the combined transform of the object and all of its
   * parent Containers up to the stage. This can be used to transform positions between coordinate
   * spaces.
   * @param matrix A Matrix2D object to populate with the calculated values. If null, a new
   * Matrix2D object is returned.
   * @returnsThe combined matrix.
   */
  public getConcatenatedMatrix(matrix?: Matrix2D): Matrix2D {
    const mtx = this.getMatrix(matrix);
    let o: XObject | undefined = this.parent;
    while (o) {
      mtx.prependMatrix(o.getMatrix());
      o = o.parent;
    }
    return mtx;
  }

  /**
   * Checks the given location should trigger a click event or not.
   * @param x The x position to test.
   * @param y The y position to test.
   * @returns True if it should trigger a click event, false otherwise.
   */
  public hitTest(x: number, y: number): boolean {
    return x >= 0 && x < this.rect.width && y >= 0 && y < this.rect.height;
  }

  /**
   * Calculates size of current object.
   */
  public layout() {
    this.calculateSize();
  }

  /**
   * Calculates size of current object.
   */
  public calculateSize() {
    if (!this.parent) {
      return;
    }
    LayoutUtils.updateSize(this, this.parent.getWidth(), this.parent.getHeight());
  }

  /**
   * Applies the style map to current object.
   * @param style Style map to apply.
   * @returns The current instance. Useful for chaining method calls.
   */
  public css(style: { [key: string]: string | number }): XObject {
    this.style.apply(style);
    return this;
  }

  /**
   * Returns line height of this object.
   * @returns Line height of this object.
   */
  public getLineHeight(): number {
    if (this.style.font) {
      if (this.style.lineHeight) {
        return this.style.lineHeight.getValue(this.style.font.size);
      } else if (this.style.font.lineHeight) {
        return this.style.font.lineHeight.getValue(this.style.font.size);
      } else {
        return this.style.font.size;
      }
    } else {
      if (this.style.lineHeight) {
        return this.style.lineHeight.getValue(0);
      } else {
        return 0;
      }
    }
  }

  /**
   * Returns width of this object, including content width, padding width and border width.
   * @returns Width of this object.
   */
  public getWidth(): number {
    return this.rect.width;
  }

  /**
   * Returns height of this object, including content height, padding height and border height.
   * @returns Height of this object.
   */
  public getHeight(): number {
    return this.rect.height;
  }

  /**
   * Returns padding width of this object.
   * @returns Padding width of this object.
   */
  public getPaddingWidth(): number {
    return (
      this.rect.width -
      (this.style.borderLeft ? this.style.borderLeft.width : 0) -
      (this.style.borderRight ? this.style.borderRight.width : 0)
    );
  }

  /**
   * Returns padding height of this object.
   * @returns Padding height of this object.
   */
  public getPaddingHeight(): number {
    return (
      this.rect.height -
      (this.style.borderTop ? this.style.borderTop.width : 0) -
      (this.style.borderBottom ? this.style.borderBottom.width : 0)
    );
  }

  /**
   * Returns padding rect of this object.
   * @returns Padding rect of this object.
   */
  public getPaddingRect(): Rect {
    const rect = new Rect(0, 0, this.rect.width, this.rect.height);
    if (this.style.borderLeft) {
      rect.x += this.style.borderLeft.width;
      rect.width -= this.style.borderLeft.width;
    }
    if (this.style.borderRight) {
      rect.width -= this.style.borderRight.width;
    }

    if (this.style.borderTop) {
      rect.y += this.style.borderTop.width;
      rect.height -= this.style.borderTop.width;
    }
    if (this.style.borderBottom) {
      rect.height -= this.style.borderBottom.width;
    }
    return rect;
  }

  /**
   * Returns content width of this object.
   * @returns Content width of this object.
   */
  public getContentWidth(): number {
    return (
      this.rect.width -
      (this.style.paddingLeft ? this.style.paddingLeft.getValue(this.rect.width) : 0) -
      (this.style.paddingRight ? this.style.paddingRight.getValue(this.rect.width) : 0) -
      (this.style.borderLeft ? this.style.borderLeft.width : 0) -
      (this.style.borderRight ? this.style.borderRight.width : 0)
    );
  }

  /**
   * Returns content height of this object.
   * @returns content height of this object.
   */
  public getContentHeight(): number {
    return (
      this.rect.height -
      (this.style.paddingTop ? this.style.paddingTop.getValue(this.rect.height) : 0) -
      (this.style.paddingBottom ? this.style.paddingBottom.getValue(this.rect.height) : 0) -
      (this.style.borderTop ? this.style.borderTop.width : 0) -
      (this.style.borderBottom ? this.style.borderBottom.width : 0)
    );
  }

  /**
   * Returns content rect of this object.
   * @returns content rect of this object.
   */
  public getContentRect(): Rect {
    const rect = new Rect(0, 0, this.rect.width, this.rect.height);
    if (this.style.paddingLeft) {
      const left = this.style.paddingLeft.getValue(this.rect.width);
      rect.x += left;
      rect.width -= left;
    }
    if (this.style.paddingRight) {
      rect.width -= this.style.paddingRight.getValue(this.rect.width);
    }
    if (this.style.paddingTop) {
      const top = this.style.paddingTop.getValue(this.rect.height);
      rect.y += top;
      rect.height -= top;
    }
    if (this.style.paddingBottom) {
      rect.height -= this.style.paddingBottom.getValue(this.rect.height);
    }

    if (this.style.borderLeft) {
      rect.x += this.style.borderLeft.width;
      rect.width -= this.style.borderLeft.width;
    }
    if (this.style.borderRight) {
      rect.width -= this.style.borderRight.width;
    }

    if (this.style.borderTop) {
      rect.y += this.style.borderTop.width;
      rect.height -= this.style.borderTop.width;
    }
    if (this.style.borderBottom) {
      rect.height -= this.style.borderBottom.width;
    }
    return rect;
  }

  /**
   * Returns outer width of this object.
   * @returns Outer width of this object.
   */
  public getOuterWidth(): number {
    const parentWidth = this.parent ? this.parent.getWidth() : 0;
    return (
      this.rect.width +
      (this.style.marginLeft ? this.style.marginLeft.getValue(parentWidth) : 0) +
      (this.style.marginRight ? this.style.marginRight.getValue(parentWidth) : 0)
    );
  }

  /**
   * Returns outer height of this object.
   * @returns Outer height of this object.
   */
  public getOuterHeight(): number {
    const parentHeight = this.parent ? this.parent.getHeight() : 0;
    return (
      this.rect.height +
      (this.style.marginTop ? this.style.marginTop.getValue(parentHeight) : 0) +
      (this.style.marginBottom ? this.style.marginBottom.getValue(parentHeight) : 0)
    );
  }

  /**
   * Checks it this object is a child of the given object.
   * @param element The object to check with.
   * @returns True if this object is a child of the given object, false otherwise.
   */
  public isChildOf(element: XObject): boolean {
    let parent = this.parent;
    while (parent) {
      if (parent === element) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  /**
   * Returns a string representation of this object.
   * @returns a string representation of this object.
   */
  public toString() {
    return `[XObject (id=${this.id})]`;
  }

  /**
   * Do dispatch a touch event to a this element.
   * @param event The event to be dispatched.
   */
  private doDispatchEvent(event: TouchEvent) {
    event.currentTarget = this;
    if (event.stage) {
      if (this.willTrigger(event.type)) {
        const pt = event.stage.localToLocal(event.stageX, event.stageY, this);
        event.x = pt.x;
        event.y = pt.y;
      }
    }
    super.dispatchEvent(event);
  }
}
