import { Animation } from '../animation/Animation';
import { AnimationFactory } from '../animation/AnimationFactory';
import { BaseValue } from '../base/BaseValue';
import { Point } from '../base/Point';
import { Runtime } from '../Runtime';
import { Ticker } from '../Ticker';
import { LayoutUtils } from '../utils/LayoutUtils';
import { Container } from './Container';
import { XActionEvent, XObject } from './XObject';

export enum StageLayoutPolicy {
  NEVER = 'never',
  ALWAYS = 'always'
}

export type StageOptions = {
  fps?: number;
  layoutPolicy?: StageLayoutPolicy;
  autoClear?: boolean;
  style?: { [key: string]: string | number };
};

export class Stage extends Container {
  public canvas: HTMLCanvasElement;

  public readonly ticker: Ticker;
  public readonly animationFactory: AnimationFactory;
  public readonly option: StageOptions = {
    fps: 60,
    layoutPolicy: StageLayoutPolicy.NEVER,
    autoClear: true
  };

  private pressedChild?: XObject;
  private hovedChildren: XObject[] = [];
  private started: boolean = false;

  constructor(canvas: HTMLCanvasElement, option: StageOptions = {}) {
    super();
    for (const k in option) {
      (this.option as { [key: string]: any })[k] = (option as { [key: string]: any })[k];
    }
    this.canvas = canvas;
    this.css({
      width: '100%',
      height: '100%',
      left: 0,
      top: 0
    });
    if (option.style) {
      this.css(option.style);
    }

    this.enableEvents();
    this.ticker = new Ticker(this.option.fps);
    this.animationFactory = new AnimationFactory();
    this.ticker.addEventListener('tick', _ => {
      this.animationFactory.onInterval();
    });
  }

  public start() {
    if (!this.started) {
      this.started = true;
      this.layout();
      this.ticker.addEventListener('tick', time => {
        this.update();
      });
    }
  }

  public enableEvents() {
    Runtime.get().enableEvents(this);
  }

  public reportHovedChild(child: XObject) {
    for (const c of this.hovedChildren) {
      if (c === child) {
        return;
      }
    }
    this.hovedChildren.push(child);
  }

  public handleActionEvent(type: string, pt: Point, e: any) {
    if (!this.isVisible()) {
      return;
    }
    pt = this.globalToLocal(pt.x, pt.y);
    switch (type) {
      case 'mousedown':
        this.handleTouchDownEvent(pt, e);
        break;
      case 'mouseup':
        this.handleTouchUpEvent(pt, e);
        break;
      case 'mousemove':
        this.handleTouchMoveEvent(pt, e);
        break;
      case 'mouseleave':
        this.handleMouseLeaveEvent(pt, e);
        break;
    }
  }

  public update() {
    if (!this.canvas || !this.isVisible()) {
      return;
    }
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    if (this.option.layoutPolicy === StageLayoutPolicy.ALWAYS) {
      this.layout();
    }
    if (this.option.autoClear) {
      ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
    }
    ctx.save();
    this.updateContext(ctx);
    this.draw(ctx, false);
    ctx.restore();
  }

  public calculateSize() {
    if (!this.canvas || !this.isVisible()) {
      return;
    }
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    LayoutUtils.updateSize(this, canvasWidth, canvasHeight);
    LayoutUtils.updatePositionForAbsoluteElement(this, canvasWidth, canvasHeight);
  }

  public animate(element: XObject, override: boolean = true): Animation {
    return this.animationFactory.create(element, override);
  }

  public toString() {
    return `[Stage (id=${this.id})]`;
  }

  private dispatchActionEvent(element: XObject, type: string, bubble: boolean, pt: Point, e: any) {
    const event = new XActionEvent(element, type, bubble);
    event.stage = this;
    event.stageX = pt.x;
    event.stageY = pt.y;
    event.nativeEvent = e;
    element.dispatchEvent(event);
  }

  private handleMouseLeaveEvent(pt: Point, e: any) {
    for (const child of this.hovedChildren) {
      child.actionState.inBounds = false;
      this.dispatchActionEvent(child, 'leave', false, pt, e);
    }
    this.hovedChildren = [];
  }

  private handleTouchDownEvent(pt: Point, e: any) {
    const ele = this.getObjectUnderPoint(pt.x, pt.y, true);
    if (ele) {
      this.dispatchActionEvent(ele, 'pressdown', true, pt, e);
      this.pressedChild = ele;
    } else {
      this.pressedChild = undefined;
    }
  }

  private handleTouchUpEvent(pt: Point, e: any) {
    const ele = this.getObjectUnderPoint(pt.x, pt.y, true);
    if (ele) {
      this.dispatchActionEvent(ele, 'touchup', true, pt, e);
    }
    if (this.pressedChild) {
      this.pressedChild.actionState.pressed = false;
      this.dispatchActionEvent(this.pressedChild, 'pressup', true, pt, e);
      if (ele) {
        if (ele === this.pressedChild || this.pressedChild.isChildOf(ele)) {
          this.dispatchActionEvent(ele, 'click', true, pt, e);
        }
      }
    }
    this.pressedChild = undefined;
  }

  private handleTouchMoveEvent(pt: Point, e: any) {
    pt = this.globalToLocal(pt.x, pt.y);
    const ele = this.getObjectUnderPoint(pt.x, pt.y, true);
    if (ele) {
      const hoved: XObject[] = [];
      let current: XObject | undefined = ele;
      let cursor;
      while (current) {
        if (!current.actionState.inBounds) {
          current.actionState.inBounds = true;
          this.dispatchActionEvent(current, 'enter', false, pt, e);
        }
        hoved.push(current);
        if (cursor === undefined && current.style.cursor) {
          cursor = current.style.cursor;
        }
        current = current.parent;
      }
      if (this.canvas.style) {
        this.canvas.style.cursor = cursor || 'auto';
      }

      this.dispatchActionEvent(ele, 'move', true, pt, e);

      for (const child of this.hovedChildren) {
        let found = false;
        for (const h of hoved) {
          if (h === child) {
            found = true;
            break;
          }
        }
        if (!found) {
          child.actionState.inBounds = false;
          this.dispatchActionEvent(child, 'leave', false, pt, e);
        }
      }
      this.hovedChildren = hoved;
    } else {
      if (this.canvas.style) {
        this.canvas.style.cursor = this.style.cursor || 'auto';
      }
      for (const child of this.hovedChildren) {
        child.actionState.inBounds = false;
        this.dispatchActionEvent(child, 'leave', false, pt, e);
      }
      this.hovedChildren.length = 0;
    }

    if (this.pressedChild) {
      this.dispatchActionEvent(this.pressedChild, 'pressmove', true, pt, e);
    }
  }
}
