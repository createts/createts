import { AnimationValues } from '../animation/Animation';
import { Rect } from '../base/Rect';
import { HtmlParser } from '../parser/HtmlParser';
import { Container } from './Container';
import { Stage } from './Stage';
import { IXObjectOptions, XObjectEvent } from './XObject';

/**
 * A Container is a nestable display list that allows you to work with compound objects, it can be
 * use to build the tree structure of all the objects like DOM tree, and itself is also a XObject
 * so that it also supports style, event handling, etc.
 *
 * Code example:
 *
 * ```typescript
 * const container  = new Container();
 * container.css({width:100, height:200, display:'absolute', left:50});
 * const obj  = new XObject();
 * container.addChild(obj);
 * ```
 */
export class Scrollable extends Container {
  private viewRect: Rect = new Rect(0, 0, 0, 0);
  private verticalSnappingSize: number = 0;
  private horizontalSnappingSize: number = 200;

  constructor(opt?: IXObjectOptions) {
    super(opt);
    this.on('pressmove', e => {
      this.scroll(e.touchItem.getDelta());
      e.stage.updateOnce();
    });
    this.on('mousewheel', e => {
      const delta = e.touchItem.getDelta();
      delta.x = -delta.x;
      delta.y = -delta.y;
      this.scroll(delta, false);
      e.stage.updateOnce();
    });
    this.on('pressup', e => {
      if (e.stage.getPressedTouchItems(this).length === 0) {
        this.onRelease(e.stage);
        e.stage.updateOnce();
      }
    });
  }

  getDefaultStyle(): { [key: string]: string | number } | undefined {
    return {
      overflow: 'hidden'
    };
  }

  private fixPosition(val: number, min: number, max: number): number {
    if (val > max) {
      return max;
    } else if (val < min) {
      return min;
    } else {
      return val;
    }
  }

  scroll(delta: { x: number; y: number }, enableSnapping: boolean = true) {
    this.viewRect.x = this.fixPosition(
      this.viewRect.x + delta.x,
      Math.min(0, this.getContentWidth() - this.viewRect.width) -
        (enableSnapping ? this.horizontalSnappingSize : 0),
      enableSnapping ? this.horizontalSnappingSize : 0
    );
    this.viewRect.y = this.fixPosition(
      this.viewRect.y + delta.y,
      Math.min(0, this.getContentHeight() - this.viewRect.height) -
        (enableSnapping ? this.verticalSnappingSize : 0),
      enableSnapping ? this.verticalSnappingSize : 0
    );
  }

  onRelease(stage: Stage) {
    const back = {
      x: this.fixPosition(
        this.viewRect.x,
        Math.min(0, this.getContentWidth() - this.viewRect.width),
        0
      ),
      y: this.fixPosition(
        this.viewRect.y,
        Math.min(0, this.getContentHeight() - this.viewRect.height),
        0
      )
    };
    if (back.x === this.viewRect.x && back.y === this.viewRect.y) {
      return;
    }
    stage
      .animate({ x: this.viewRect.x, y: this.viewRect.y }, true)
      .to(back, 200, 'quadIn')
      .on('update', e => {
        if (back.x !== undefined) {
          this.viewRect.x = (e.value as AnimationValues).x as number;
        }
        if (back.y !== undefined) {
          this.viewRect.y = (e.value as AnimationValues).y as number;
        }
        this.dispatchEvent(new XObjectEvent('update', true, true, this));
      });
  }

  layoutChildren() {
    super.layoutChildren();
    this.viewRect.width = 0;
    this.viewRect.height = 0;
    const paddingRect = this.getPaddingRect();
    for (const child of this.children) {
      this.viewRect.width = Math.max(
        this.viewRect.width,
        child.rect.x + child.getOuterWidth() - paddingRect.x
      );
      this.viewRect.height = Math.max(
        this.viewRect.height,
        child.rect.y + child.getOuterHeight() - paddingRect.y
      );
      child.rect.x += this.viewRect.x;
      child.rect.y += this.viewRect.y;
    }
  }
}

HtmlParser.registerTag('scrollable', Scrollable);
