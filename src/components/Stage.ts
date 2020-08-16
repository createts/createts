import { Animation, AnimationTarget } from '../animation/Animation';
import { AnimationFactory } from '../animation/AnimationFactory';
import { ResourceRegistry } from '../resource/ResourceRegistry';
import { Runtime } from '../runtime/Runtime';
import { Ticker } from '../Ticker';
import { LatestList } from '../utils/LatestList';
import { LayoutUtils } from '../utils/LayoutUtils';
import { Container } from './Container';
import { TouchItem } from './TouchItem';
import { XObject, XObjectEvent } from './XObject';
import { initBaseValuesCanvas } from '../base/BaseValue';

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
 * 1. **AUTO**: stage only update canvas after listens a 'update' event.
 * 1. **ALWAYS**: stage update canvas in each ticker callback.
 */
export enum StageUpdatePolicy {
  NEVER = 'never',
  AUTO = 'auto',
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
   * If true, clear the canvas at beginning of each update time, otherwise drawing on top of
   * previous drawn canvas.
   */
  autoClear?: boolean;
  /**
   * If true, ignore installing event handler by default, you can still call installEventHandler
   * later to install the event handler.
   */
  noEventHandler?: boolean;
  /**
   * The override styles while constructing a stage object.
   */
  style?: { [key: string]: string | number };
  /**
   * If true, record latest 30 render latencies.
   */
  recordRenderLatencies?: boolean;
};

/**
 * A helper class for staging to hold the all touch status of this stage.
 */
class TouchedObjectSet {
  /**
   * A list of TouchItem objects.
   */
  readonly touchItems: TouchItem[] = [];

  /**
   * Checks whether this instance contains a TouchItem with this touch identifier.
   * @param identifier Touch identifier to query.
   * @returns True if this instance contains a TouchItem with same identifier, false otherwise.
   */
  public contains(identifier: number): boolean {
    for (const item of this.touchItems) {
      if (item.identifier === identifier) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets TouchItem instance by a given touch identifier.
   * @param identifier Touch identifier to query.
   * @returns TouchItem with same identifier, undefined if not found.
   */
  public get(identifier: number): TouchItem | undefined {
    for (const item of this.touchItems) {
      if (item.identifier === identifier) {
        return item;
      }
    }
    return undefined;
  }

  /**
   * Puts a TouchItem instances into current set, caller must make sure that only put the new
   * TouchItem, this method does not check whether there is an existing TouchItem contains same
   * touch identifier.
   * @param touch  The TouchItem instance.
   */
  public add(touch: TouchItem) {
    this.touchItems.push(touch);
  }

  /**
   * Removes the TouchItem with same touch identifier.
   * @param identifier The touch identifier used to find the TouchItem to be removed.
   */
  public remove(identifier: number) {
    for (let i = 0; i < this.touchItems.length; ++i) {
      if (this.touchItems[i].identifier === identifier) {
        this.touchItems.splice(i, 1);
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
    for (const item of this.touchItems) {
      if (item.srcElement === object || item.srcElement.isChildOf(object)) {
        result.push(item);
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
     * Update policy of this stage instance, default is 'auto'.
     */
    updatePolicy: StageUpdatePolicy.AUTO,
    /**
     * Whether clear the stage before rendering, default is true.
     */
    autoClear: true
  };

  /**
   * Contains current touch items of this stage.
   */
  private touchItems: TouchedObjectSet = new TouchedObjectSet();
  /**
   * Indicated whether this stage object is started to render or not.
   */
  private started: boolean = false;
  /**
   * Indicated whether this stage is invalidate and needs to be rendered.
   */
  private needUpdate: boolean = false;
  /**
   * Indicated whether event handler of this stage is installed.
   */
  private eventHandlerInstalled: boolean = false;
  /**
   * Indicated whether event is enabled for this stage.
   */
  private eventEnabled: boolean = true;

  /**
   *
   * @param canvas
   * @param option
   */
  private latestRenderLatencies?: LatestList<number>;

  /**
   * Construct a stage object by canvas and option.
   *
   * Example
   *
   * ```typescript
   * const canvas = window.getElementById('canvas');
   * const stage = new Stage(canvas);
   * const html = `
   *    <div style='background:red;width:50%;height:100%'>
   *      <div style='background:yellow;width:50%;height:50%'></div>
   *    </div>
   *    <div style='background:green;width:50%;height:100%'></div>
   * `;
   * stage.load(html).start();
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
    initBaseValuesCanvas(canvas);
    this.css({
      width: '100%',
      height: '100%',
      left: 0,
      top: 0
    });
    if (option.style) {
      this.css(option.style);
    }

    if (option.recordRenderLatencies) {
      this.latestRenderLatencies = new LatestList<number>();
    }

    if (!option.noEventHandler) {
      this.installEventHandlers();
    }
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
      this.ticker.addEventListener('tick', (_) => {
        this.animationFactory.onInterval();
        if (
          this.option.updatePolicy !== StageUpdatePolicy.NEVER &&
          (this.needUpdate || this.option.updatePolicy === StageUpdatePolicy.ALWAYS)
        ) {
          this.update();
          this.needUpdate = false;
        }
      });
      ResourceRegistry.DefaultInstance.addEventListener('load', (e) => {
        this.updateOnce();
      });
      this.on('update', () => {
        this.updateOnce();
      });
    }
  }

  /**
   * Enables the event listeners that stage adds to canvas.
   */
  public installEventHandlers() {
    if (!this.eventHandlerInstalled) {
      this.eventHandlerInstalled = true;
      Runtime.get().enableEvents(this);
    }
  }

  /**
   * Enables event for this stage.
   * @returns The current instance. Useful for chaining method calls.
   */
  public enableEvents(): Stage {
    this.eventEnabled = true;
    return this;
  }

  /**
   * Disables event for this stage.
   * @returns The current instance. Useful for chaining method calls.
   */
  public disableEvents(): Stage {
    this.eventEnabled = false;
    return this;
  }

  /**
   * Returns a list of TouchItems pressed on a given element.
   * @param child A child to find the pressed TouchItems, use stage itself if it is undefined.
   * @returns A list of TouchItems pressed on this element.
   */
  public getPressedTouchItems(child?: XObject): TouchItem[] {
    if (!child) child = this;
    const touches = this.touchItems.getTouches(child);
    const result = [];
    for (const touch of touches) {
      if (!touch.pressed) continue;
      result.push(touch.clone());
    }
    return result;
  }

  /**
   * Handles the mouse/touch events from runtime.
   * @param type The type of this event.
   * @param touches The list of touches, if the event is a mouse event, the first touch item
   * contains mouse location and the identifier is always 0.
   * @param e The native event object.
   */
  public handleMouseOrTouchEvent(type: string, touches: TouchItem[], e: any) {
    if (!this.eventEnabled || !this.isVisible()) {
      return;
    }
    switch (type) {
      case 'mousedown':
      case 'touchstart':
        this.handleTouchStartEvent(touches, e);
        break;
      case 'mouseup':
        this.onTouchMove(touches, e);
        this.handleTouchEndEvent([], e);
        break;
      case 'touchend':
      case 'touchcancel':
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
   * Handles the mouse/touch events from runtime.
   * @param type The type of this event.
   * @param touches The list of touches, if the event is a mouse event, the first touch item
   * contains mouse location and the identifier is always 0.
   * @param e The native event object.
   */
  public handleMouseWheelEvent(
    stageX: number,
    stageY: number,
    deltaX: number,
    deltaY: number,
    e: any
  ) {
    const pt = this.globalToLocal(stageX, stageY);
    const element: XObject | undefined = this.getObjectUnderPoint(pt.x, pt.y, true);
    if (element) {
      const touch = new TouchItem(0, element, stageX, stageY, Date.now());
      touch.deltaX = deltaX;
      touch.deltaY = deltaY;
      this.dispatchTouchEvent(element, 'mousewheel', touch, true, true, e);
    }
  }

  /**
   * Returns the top stage object of the given element.
   * @returns The top stage object, or undefined if it is not been added.
   */
  public static of(element: XObject): Stage | undefined {
    while (element.parent) {
      element = element.parent;
    }
    return element instanceof Stage ? element : undefined;
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
    const startTime = Date.now();
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
    if (this.latestRenderLatencies) {
      this.latestRenderLatencies.add(Date.now() - startTime);
    }
  }

  /**
   * Calculate stage size and position according to its style.
   */
  public calculateSize() {
    if (!this.canvas || !this.isVisible()) {
      return;
    }
    const canvasWidth = this.canvas.width || this.canvas.clientWidth;
    const canvasHeight = this.canvas.height || this.canvas.clientHeight;
    LayoutUtils.updateSize(this, canvasWidth, canvasHeight);
    LayoutUtils.updatePositionForAbsoluteElement(this, canvasWidth, canvasHeight);
  }

  /**
   * A wrapper function to use this stage's animationFactory to create animation for the given object.
   *
   * ```typescript
   *
   * const stage = ...;
   * const element = ...;
   *
   * stage.animate(element, true).css({color: 'red'}, 1000, 'linear');
   * ```
   *
   * @param element The target element to create the animation for.
   * @param override Whether to remove the existing animation of this element.
   */
  public animate(element: AnimationTarget, override: boolean = true): Animation {
    return this.animationFactory.create(element, override);
  }

  /**
   * A wrapper function to use this stage's animationFactory to stop animation for the given object.
   *
   * ```typescript
   *
   * const stage = ...;
   * const element = ...;
   *
   * stage.stopAnimation(element);
   * ```
   * @param element The target element to create the animation for.
   */
  public stopAnimation(element: AnimationTarget) {
    this.animationFactory.removeByTarget(element);
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
   * @param currentTouch It contains location and identifier of this event.
   * @param bubble Indicates whether the event bubbles up through its parents or not.
   * @param cancellable Indicates whether the event is cancellable or not.
   * @param e The native event.
   */
  private dispatchTouchEvent(
    element: XObject,
    type: string,
    currentTouch: TouchItem,
    bubble: boolean,
    cancellable: boolean,
    e: any
  ) {
    const event = new XObjectEvent(type, bubble, cancellable, element, currentTouch);
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
    const newTouches: TouchItem[] = [];
    for (const touch of touches) {
      const item = this.touchItems.get(touch.identifier);
      if (item) {
        if (item.stageX !== touch.stageX || item.stageY !== touch.stageY) {
          item.onUpdate(touch);
          movedTouches.push(item);
        }
      } else {
        newTouches.push(touch);
      }
    }

    for (const touch of movedTouches) {
      const pt = this.globalToLocal(touch.stageX, touch.stageY);
      const element: XObject | undefined = this.getObjectUnderPoint(pt.x, pt.y, true);
      if (element) {
        this.dispatchTouchEvent(element, 'move', touch, true, true, e);
      }
      if (touch.pressed) {
        this.dispatchTouchEvent(touch.srcElement, 'pressmove', touch, true, true, e);
      }
      // Checks enter/leave
      if (element) {
        if (touch.currentTarget !== element) {
          let enterElement = element;
          let leaveElement = touch.currentTarget;
          touch.currentTarget = element;
          while (leaveElement) {
            if (enterElement.isChildOf(leaveElement) || enterElement === leaveElement) {
              break;
            }
            this.dispatchTouchEvent(leaveElement, 'leave', touch, false, true, e);
            leaveElement = leaveElement.parent;
          }
          while (enterElement && enterElement !== leaveElement) {
            this.dispatchTouchEvent(enterElement, 'enter', touch, false, true, e);
            enterElement = enterElement.parent;
          }
        }
      } else if (touch.currentTarget) {
        this.dispatchTouchEvent(touch.currentTarget, 'leave', touch, false, true, e);
        touch.currentTarget = undefined;
      }
    }

    for (const touch of newTouches) {
      const pt = this.globalToLocal(touch.stageX, touch.stageY);
      const element: XObject | undefined = this.getObjectUnderPoint(pt.x, pt.y, true);
      if (!element) {
        continue;
      }
      const newMove = touch.switchSourceElement(element);
      newMove.pressed = false;
      newMove.currentTarget = element;
      this.touchItems.add(newMove);
      this.dispatchTouchEvent(element, 'move', newMove, true, true, e);
      this.dispatchTouchEvent(element, 'enter', newMove, false, true, e);
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
      const existing = this.touchItems.get(touch.identifier);
      if (!existing || !existing.pressed) {
        if (existing) {
          this.touchItems.remove(existing.identifier);
        }
        const element = this.getObjectUnderPoint(touch.stageX, touch.stageY, true);
        if (element) {
          const item = touch.switchSourceElement(element);
          item.currentTarget = element;
          item.pressed = true;
          newTouches.add(item);
          this.touchItems.add(item);
        }
      }
    }
    for (const item of newTouches.touchItems) {
      this.dispatchTouchEvent(item.srcElement, 'touchdown', item, true, true, e);
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
    for (const item of this.touchItems.touchItems) {
      let exists = false;
      for (const touch of touches) {
        if (touch.identifier === item.identifier) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        endedTouches.add(item);
      }
    }
    for (const item of endedTouches.touchItems) {
      this.touchItems.remove(item.identifier);
    }
    for (const item of endedTouches.touchItems) {
      if (!item.pressed) {
        continue;
      }
      const element = this.getObjectUnderPoint(item.stageX, item.stageY, true);
      if (element) {
        this.dispatchTouchEvent(element, 'touchup', item, true, true, e);
      }
      this.dispatchTouchEvent(item.srcElement, 'pressup', item, true, true, e);
      if (element === item.srcElement || item.srcElement.isChildOf(element)) {
        this.dispatchTouchEvent(element, 'click', item, true, true, e);
      }
    }
  }
}
