import { Event, EventDispatcher } from '../base/Event';
import { Matrix2D } from '../base/Matrix2D';
import { Point } from '../base/Point';
import { Rect } from '../base/Rect';
import { RoundRect } from '../base/RoundRect';
import { Runtime } from '../Runtime';
import { Shadow } from '../style/Shadow';
import { BoxSizing, Display, Style } from '../style/Style';
import { DrawUtils } from '../utils/DrawUtils';
import { LayoutUtils } from '../utils/LayoutUtils';
import { Container } from './Container';
import { Stage } from './Stage';

export class ActionState {
  public pressed: boolean = false;
  public inBounds: boolean = false;
}

export class XActionEvent extends Event {
  public stage?: Stage;
  public nativeEvent: any = null;

  // TODO: change to support multiple touches.
  public stageX: number = -1;
  public stageY: number = -1;
  public x: number = -1;
  public y: number = -1;

  // A reference to the currently registered target for the event. This is the object to which the
  // event is currently slated to be sent. It's possible this has been changed along the way
  // through retargeting.
  public currentTarget: XObject;

  public readonly srcElement: XObject;

  constructor(target: XObject, type: string, bubbles: boolean = true, cancelable: boolean = true) {
    super(type, bubbles, cancelable);
    this.srcElement = target;
    this.currentTarget = target;
  }

  toString() {
    return '[XActionEvent (type=' + this.type + ')]';
  }
}

enum CacheState {
  DISABLED = 1,
  CACHED = 2,
  INVALIDATE = 3
}

export interface IAttributes {
  [key: string]: string;
}

export interface IXObjectOptions {
  style: Style;
  attributes: IAttributes;
  text?: string;
}

export class XObject extends EventDispatcher<XActionEvent> {
  public eventEnabled: boolean = true;
  public actionState: ActionState = new ActionState();
  public id?: string = undefined;
  public style: Style;
  public rect: Rect = new Rect(0, 0, 0, 0);
  public parent?: Container;
  private cacheCanvas?: HTMLCanvasElement;
  private cacheState: CacheState = CacheState.DISABLED;

  constructor(opt?: IXObjectOptions) {
    super();
    this.style = opt && opt.style ? opt.style : new Style();
    if (opt && opt.attributes.id) {
      this.id = opt.attributes.id;
    }
  }

  public getCacheCanvas(): HTMLCanvasElement | undefined {
    return this.cacheCanvas;
  }

  public remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

  public dispatchEvent(event: XActionEvent): boolean {
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

  public willTrigger(type: string): boolean {
    let o: XObject | undefined = this;
    while (o) {
      if (o.hasEventListener(type)) {
        return true;
      }
      o = o.parent;
    }
    return false;
  }

  public isVisible(): boolean {
    return !!(
      this.style.visible &&
      this.style.display !== Display.NONE &&
      this.style.alpha > 0 &&
      this.style.scaleX > 0 &&
      this.style.scaleY > 0
    );
  }

  public isCached(): boolean {
    return this.cacheState !== CacheState.DISABLED;
  }

  public cache() {
    this.cacheState = CacheState.INVALIDATE;
  }

  public uncache() {
    this.cacheState = CacheState.DISABLED;
  }

  public invalidateCache() {
    if (this.cacheState === CacheState.DISABLED) {
      console.warn('Cache does not enabled for ' + this.toString());
      return;
    }
    this.cacheState = CacheState.INVALIDATE;
  }

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
      return;
    }
    DrawUtils.drawElement(this, ctx);
  }

  public drawBackground(ctx: CanvasRenderingContext2D, outerRect: RoundRect, innerRect: RoundRect) {
    if (this.style.background) {
      this.style.background.draw(this, ctx, outerRect, innerRect);
    }
  }

  public drawContent(ctx: CanvasRenderingContext2D) {
    return;
  }

  public updateContext(ctx: CanvasRenderingContext2D) {
    const mtx: Matrix2D = this.getMatrix();
    ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
    ctx.globalAlpha *= this.style.alpha;
  }

  public localToGlobal(x: number, y: number): Point {
    return this.getConcatenatedMatrix().transformPoint(x, y);
  }

  public globalToLocal(x: number, y: number): Point {
    return this.getConcatenatedMatrix()
      .invert()
      .transformPoint(x, y);
  }

  public localToLocal(x: number, y: number, target: XObject): Point {
    const pt = this.localToGlobal(x, y);
    return target.globalToLocal(pt.x, pt.y);
  }

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

  public getConcatenatedMatrix(matrix?: Matrix2D): Matrix2D {
    const mtx = this.getMatrix(matrix);
    let o: XObject | undefined = this.parent;
    while (o) {
      mtx.prependMatrix(o.getMatrix());
      o = o.parent;
    }
    return mtx;
  }

  public hitTest(x: number, y: number): boolean {
    return x >= 0 && x < this.rect.width && y >= 0 && y < this.rect.height;
  }

  public layout() {
    this.calculateSize();
  }

  public calculateSize() {
    if (!this.parent) {
      return;
    }
    LayoutUtils.updateSize(this, this.parent.getWidth(), this.parent.getHeight());
  }

  public css(style: { [key: string]: string | number }) {
    this.style.apply(style);
  }

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

  public getWidth(): number {
    return this.rect.width;
  }

  public getHeight(): number {
    return this.rect.height;
  }

  public getPaddingWidth(): number {
    return (
      this.rect.width -
      (this.style.borderLeft ? this.style.borderLeft.width : 0) -
      (this.style.borderRight ? this.style.borderRight.width : 0)
    );
  }

  public getPaddingHeight(): number {
    return (
      this.rect.height -
      (this.style.borderTop ? this.style.borderTop.width : 0) -
      (this.style.borderBottom ? this.style.borderBottom.width : 0)
    );
  }

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

  public getContentWidth(): number {
    return (
      this.rect.width -
      (this.style.paddingLeft ? this.style.paddingLeft.getValue(this.rect.width) : 0) -
      (this.style.paddingRight ? this.style.paddingRight.getValue(this.rect.width) : 0) -
      (this.style.borderLeft ? this.style.borderLeft.width : 0) -
      (this.style.borderRight ? this.style.borderRight.width : 0)
    );
  }

  public getContentHeight(): number {
    return (
      this.rect.height -
      (this.style.paddingTop ? this.style.paddingTop.getValue(this.rect.height) : 0) -
      (this.style.paddingBottom ? this.style.paddingBottom.getValue(this.rect.height) : 0) -
      (this.style.borderTop ? this.style.borderTop.width : 0) -
      (this.style.borderBottom ? this.style.borderBottom.width : 0)
    );
  }

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

  public getOuterWidth(): number {
    const parentWidth = this.parent ? this.parent.getWidth() : 0;
    return (
      this.rect.width +
      (this.style.marginLeft ? this.style.marginLeft.getValue(parentWidth) : 0) +
      (this.style.marginRight ? this.style.marginRight.getValue(parentWidth) : 0)
    );
  }

  public getOuterHeight(): number {
    const parentHeight = this.parent ? this.parent.getHeight() : 0;
    return (
      this.rect.height +
      (this.style.marginTop ? this.style.marginTop.getValue(parentHeight) : 0) +
      (this.style.marginBottom ? this.style.marginBottom.getValue(parentHeight) : 0)
    );
  }

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

  public toString() {
    return `[XObject (id=${this.id})]`;
  }

  private doDispatchEvent(event: XActionEvent) {
    event.currentTarget = this;
    if (event.stage) {
      const pt = event.stage.localToLocal(event.stageX!, event.stageY!, this);
      event.x = pt.x;
      event.y = pt.y;
    }
    super.dispatchEvent(event);
  }
}
