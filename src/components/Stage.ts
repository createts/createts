import { Animation } from '../animation/Animation';
import { AnimationFactory } from '../animation/AnimationFactory';
import { TouchItem } from '../base/TouchItem';
import { ResourceRegistry } from '../resource/ResourceRegistry';
import { Runtime } from '../Runtime';
import { Ticker } from '../Ticker';
import { LayoutUtils } from '../utils/LayoutUtils';
import { Container } from './Container';
import { TouchEvent, XObject } from './XObject';

/**
 * An enum to identify how the stage instance do layout during the update process:
 *
 * 1. **NEVER**: stage does not re-layout during updating, you must call 'layout' method explicitly
 * while children status changes.
 * 1. **ALWAYS**: stage instance calls 'layout' method in each 'update' operation.
 */
export enum StageLayoutPolicy {
  NEVER = 'never',
  ALWAYS = 'always'
}

/**
 * An enum to identify how the stage instance update the canvas for each ticker callback:
 *
 * 1. **NEVER**: stage never update the canvas, you must call stage.update method manually to
 * update the canvas.
 * 1. **IN_ANIMATION**: stage only update canvas during the animation.
 * 1. **ALWAYS**: stage update canvas in each ticker callback.
 */
export enum StageUpdatePolicy {
  NEVER = 'never',
  IN_ANIMATION = 'in_animation',
  ALWAYS = 'always'
}

/**
 * Options for constructing a stage object.
 */
export type StageOptions = {
  /**
   * Frames per second, it defines the frequency of the stage drawing the canvas.
   */
  fps?: number;
  /**
   * Layout policy, see the enum definition of StageLayoutPolicy.
   */
  layoutPolicy?: StageLayoutPolicy;
  /**
   * Update policy, see the enum definition of StageUpdatePolicy.
   */
  updatePolicy?: StageUpdatePolicy;
  /**
   * if true, clear the canvas at beginning of each update time, otherwise drawing on top of
   * previous drawn canvas.
   */
  autoClear?: boolean;
  /**
   * The override styles while constructing a stage object.
   */
  style?: { [key: string]: string | number };
};

/**
 * A pair to hold a XObject instance and a TouchItem instance.
 */
type TouchedObject = {
  object: XObject;
  touch: TouchItem;
};

/**
 * A helper class for staging to hold the touch status of its children.
 */
class TouchedObjectSet {
  /**
   * A list of TouchedObject objects.
   */
  readonly objects: TouchedObject[] = [];

  /**
   * Checks whether this instance contains a TouchItem with this touch identifier.
   * @param identifier Touch identifier to query.
   * @returns True if this instance contains a TouchItem with same identifier, false otherwise.
   */
  public contains(identifier: number): boolean {
    for (const item of this.objects) {
      if (item.touch.identifier === identifier) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets TouchedObject instance by a given touch identifier.
   * @param identifier Touch identifier to query.
   * @returns TouchedObject object if this instance contains a TouchItem with same identifier,
   * undefined otherwise.
   */
  public get(identifier: number): TouchedObject | undefined {
    for (const item of this.objects) {
      if (item.touch.identifier === identifier) {
        return item;
      }
    }
    return undefined;
  }

  /**
   * Puts a pair of XObject and TouchItem instances into current set, caller must make sure that
   * only put the new TouchItem, this method does not check whether there is an existing pair
   * contains same touch identifier.
   * @param object The XObject instance.
   * @param touch  The TouchItem instance.
   */
  public add(object: XObject, touch: TouchItem) {
    this.objects.push({
      object,
      touch
    });
  }

  /**
   * Removes the pair with same touch identifier.
   * @param identifier The touch identifier used to find the pair to be removed.
   */
  public remove(identifier: number) {
    for (let i = 0; i < this.objects.length; ++i) {
      if (this.objects[i].touch.identifier === identifier) {
        this.objects.splice(i, 1);
        return;
      }
    }
  }

  /**
   * Returns a list of TouchItem instance of given XObject instance.
   * @param object The XObject instance to be checked.
   * @returns A list of TouchItem instance attaches to this object.
   */
  public getTouches(object: XObject): TouchItem[] {
    const result: TouchItem[] = [];
    for (const item of this.objects) {
      if (item.object === object) {
        result.push(item.touch);
      }
    }
    return result;
  }
}

/**
 * This class represents a stage object which is the root level Container for a display list.
 * It also manages the context like ticker, animations, resources and controls the rendering
 * process.
 */
export class Stage extends Container {
  /**
   * The canvas instance where this stage render the image to.
   */
  public canvas: HTMLCanvasElement;

  /**
   * The ticker instance is used to provide a centralized tick to render the current stage if
   * necessary, it is also used by the AnimationFactory instance to update the animations.
   *
   * When setting the fps of stage instance, it actually set the fps of ticker.
   */
  public readonly ticker: Ticker;

  /**
   * The animationFactory object manages the animations of children elements of this stage.
   */
  public readonly animationFactory: AnimationFactory;

  /**
   * The resourceRegistry object manages the resources (like images) used in this stage.
   * This is still under developing.
   */
  public readonly resourceRegistry: ResourceRegistry;

  /**
   * The configuration of this stage instance.
   */
  public readonly option: StageOptions = {
    /**
     * The fps controls the frequency of rendering and animation updating, default is 60.
     */
    fps: 60,
    /**
     * Layout policy of this stage instance, default is 'always'.
     */
    layoutPolicy: StageLayoutPolicy.ALWAYS,
    /**
     * Update policy of this stage instance, default is 'in-animation'.
     */
    updatePolicy: StageUpdatePolicy.IN_ANIMATION,
    /**
     * Whether clear the stage before rendering, default is true.
     */
    autoClear: true
  };

  /**
   * Contains paris of touched children and touch information.
   */
  private touchedChildren: TouchedObjectSet = new TouchedObjectSet();

  /**
   * Contains paris of hovered children and touch information.
   */
  private hoverChildren: TouchedObjectSet = new TouchedObjectSet();
  /**
   * Indicated whether this stage object is started to render or not.
   */
  private started: boolean = false;
  /**
   * Indicated whether this stage is invalidate and needs to be rendered.
   */
  private needUpdate: boolean = false;

  /**
   * Construct a stage object by canvas and option.
   *
   * Example
   *
   * ```typescript
   * const canvas = windows.getElementById('canvas');
   * const stage = new Stage(canvas);
   * const parser = new Parser();
   * const html = `
   *    <div style='background:red;width:50%;height:100%'>
   *      <div style='background:yellow;width:50%;height:50%'></div>
   *    </div>
   *    <div style='background:green;width:50%;height:100%'></div>
   * `;
   * const children = parser.parse(html);
   * stage.addChildren(...children);
   * stage.start();
   * ```
   *
   * @param canvas The target canvas object this stage renders to.
   * @param option The parameters to create this stage instance.
   */
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
    this.resourceRegistry = new ResourceRegistry();
  }

  /**
   * Marks this stage is invalidate and it will render the canvas in next ticker.
   */
  public updateOnce() {
    this.needUpdate = true;
  }

  /**
   * Start the ticker of this stage.
   */
  public start() {
    if (!this.started) {
      this.started = true;
      this.layout();
      this.needUpdate = true;
      this.ticker.addEventListener('tick', _ => {
        if (this.animationFactory.onInterval()) {
          this.needUpdate = true;
        }
        if (this.needUpdate || this.option.updatePolicy === StageUpdatePolicy.ALWAYS) {
          this.update();
          this.needUpdate = false;
        }
      });
    }
  }

  /**
   * Enables the event listeners that stage adds to canvas.
   */
  public enableEvents() {
    Runtime.get().enableEvents(this);
  }

  /**
   * Handle the mouse/touch events from runtime.
   * @param type The type of this event.
   * @param touches The list of touches, if the event is a mouse event, the first touch item
   * contains mouse location and the identifier is always 0.
   * @param e The native event object.
   */
  public handleMouseEvent(type: string, touches: TouchItem[], e: any) {
    if (!this.isVisible()) {
      return;
    }
    switch (type) {
      case 'mousedown':
      case 'touchstart':
        this.handleTouchStartEvent(touches, e);
        break;
      case 'mouseup':
        this.handleTouchEndEvent([], e);
        break;
      case 'touchend':
        this.handleTouchEndEvent(touches, e);
        break;
      case 'mousemove':
      case 'touchmove':
      case 'mouseleave':
        this.onTouchMove(touches, e);
        break;
    }
  }

  /**
   * Render the stage to target canvas.
   * For performance respective, do not call this method directly, calls updateOnce to let stage
   * render at next ticker.
   */
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

  /**
   * Calculate stage size and position according to its style.
   */
  public calculateSize() {
    if (!this.canvas || !this.isVisible()) {
      return;
    }
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    LayoutUtils.updateSize(this, canvasWidth, canvasHeight);
    LayoutUtils.updatePositionForAbsoluteElement(this, canvasWidth, canvasHeight);
  }

  /**
   * A wrapper function to use this stage's animationFactory to create animation for the given child.
   *
   * ```typescript
   *
   * const stage = ...;
   * const element = ...;
   *
   * stage.animate(element, true).to({color: 'red'}, 'linear', 1000);
   * ```
   *
   * @param element The target element to create the animation for.
   * @param override Whether to remove the existing animation of this element.
   */
  public animate(element: XObject, override: boolean = true): Animation {
    return this.animationFactory.create(element, override);
  }

  /**
   * Returns a string representation of this stage object.
   * @returns a string representation of this stage object.
   */
  public toString() {
    return `[Stage (id=${this.id})]`;
  }

  /**
   * Dispatch a touch event to a child element.
   * @param element The target element to receive this event.
   * @param type Event type.
   * @param bubble Indicates whether the event bubbles up through its parents or not.
   * @param currentTouch It contains location and identifier of this event.
   * @param e The native event.
   */
  private dispatchTouchEvent(
    element: XObject,
    type: string,
    bubble: boolean,
    currentTouch: TouchItem,
    e: any
  ) {
    const event = new TouchEvent(
      element,
      type,
      bubble,
      currentTouch,
      this.touchedChildren.getTouches(element),
      true
    );
    event.stage = this;
    event.nativeEvent = e;
    element.dispatchEvent(event);
  }

  /**
   * Dispatch a non-cancellable touch event to a child element.
   * @param element The target element to receive this event.
   * @param type Event type.
   * @param bubble Indicates whether the event bubbles up through its parents or not.
   * @param currentTouch It contains location and identifier of this event.
   * @param e The native event.
   */
  private dispatchNonCancellableTouchEvent(
    element: XObject,
    type: string,
    bubble: boolean,
    currentTouch: TouchItem,
    e: any
  ) {
    const event = new TouchEvent(
      element,
      type,
      bubble,
      currentTouch,
      this.touchedChildren.getTouches(element),
      false
    );
    event.stage = this;
    event.nativeEvent = e;
    element.dispatchEvent(event);
  }

  /**
   * Handles the touch move event.
   * @param touches The list of touch item.
   * @param e The native event.
   */
  private onTouchMove(touches: TouchItem[], e: any) {
    const movedTouches: TouchItem[] = [];
    for (const touch of touches) {
      const item = this.touchedChildren.get(touch.identifier);
      if (item) {
        if (item.touch.stageX !== touch.stageX || item.touch.stageY !== touch.stageY) {
          item.touch = touch;
          movedTouches.push(touch);
        }
      } else {
        movedTouches.push(touch);
      }
    }

    for (const touch of movedTouches) {
      const pt = this.globalToLocal(touch.stageX, touch.stageY);
      const element: XObject | undefined = this.getObjectUnderPoint(pt.x, pt.y, true);
      if (element) {
        this.dispatchTouchEvent(element, 'move', true, touch, e);
      }
      const touchedItem = this.touchedChildren.get(touch.identifier);
      if (touchedItem) {
        this.dispatchTouchEvent(touchedItem.object, 'pressmove', true, touchedItem.touch, e);
      }

      // Checks enter/leave
      const hovedItem = this.hoverChildren.get(touch.identifier);
      if (hovedItem && element) {
        if (hovedItem.object !== element) {
          let enterElement = element;
          let leaveElement = hovedItem.object;
          hovedItem.object = element;
          hovedItem.touch = touch;
          while (leaveElement) {
            if (enterElement.isChildOf(leaveElement) || enterElement === leaveElement) {
              break;
            }
            this.dispatchTouchEvent(leaveElement, 'leave', false, touch, e);
            leaveElement = leaveElement.parent;
          }

          while (enterElement && enterElement !== leaveElement) {
            this.dispatchTouchEvent(enterElement, 'enter', false, touch, e);
            enterElement = enterElement.parent;
          }
        }
      } else if (element) {
        this.hoverChildren.add(element, touch);
        this.dispatchNonCancellableTouchEvent(element, 'enter', true, touch, e);
      } else if (hovedItem) {
        this.hoverChildren.remove(touch.identifier);
        this.dispatchNonCancellableTouchEvent(hovedItem.object, 'leave', true, touch, e);
      }
    }
  }

  /**
   * Handles the touch start event.
   * @param touches The list of touch item.
   * @param e The native event.
   */
  private handleTouchStartEvent(touches: TouchItem[], e: any) {
    const newTouches: TouchedObjectSet = new TouchedObjectSet();
    for (const touch of touches) {
      if (!this.touchedChildren.contains(touch.identifier)) {
        const element = this.getObjectUnderPoint(touch.stageX, touch.stageY, true);
        if (element) {
          newTouches.add(element, touch);
          this.touchedChildren.add(element, touch);
        }
      }
    }

    for (const item of newTouches.objects) {
      this.dispatchTouchEvent(item.object, 'touchdown', true, item.touch, e);
    }
    this.onTouchMove(touches, e);
  }

  /**
   * Handles the touch end event.
   * @param touches The list of touch item.
   * @param e The native event.
   */
  private handleTouchEndEvent(touches: TouchItem[], e: any) {
    this.onTouchMove(touches, e);

    const endedTouches: TouchedObjectSet = new TouchedObjectSet();
    for (const item of this.touchedChildren.objects) {
      let exists = false;
      for (const touch of touches) {
        if (touch.identifier === item.touch.identifier) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        endedTouches.add(item.object, item.touch);
      }
    }

    for (const item of endedTouches.objects) {
      this.touchedChildren.remove(item.touch.identifier);
      this.hoverChildren.remove(item.touch.identifier);
    }

    for (const item of endedTouches.objects) {
      const element = this.getObjectUnderPoint(item.touch.stageX, item.touch.stageY, true);
      if (element) {
        this.dispatchTouchEvent(element, 'touchup', true, item.touch, e);
      }
      this.dispatchTouchEvent(item.object, 'pressup', true, item.touch, e);
      if (element === item.object || item.object.isChildOf(element)) {
        this.dispatchTouchEvent(element, 'click', true, item.touch, e);
      }
    }
  }
}
