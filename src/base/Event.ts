/**
 * This class represents an event object.
 */
export class Event {
  /**
   * True indicates that the default user agent action was prevented, and false indicates that it was
   * not.
   */
  public defaultPrevented: boolean = false;

  /**
   * True indicates that the Event interface prevents further propagation of the current event in
   * the capturing and bubbling phases, and false indicates that it was not.
   */
  public propagationStopped: boolean = false;

  /**
   * True indicates that prevents other listeners of the same event from being called.
   */
  public immediatePropagationStopped: boolean = false;

  /**
   * Type of event.
   */
  readonly type: string;

  /**
   * The bubbles read-only property of the Event interface indicates whether the event bubbles up
   * through its parents or not.
   */
  readonly bubbles: boolean = false;

  /**
   * The cancelable read-only property of the Event interface indicates whether the event can be
   * canceled, and therefore prevented as if the event never happened. If the event is not
   * cancelable, then its cancelable property will be false and the event listener cannot stop
   * the event from occurring.
   */
  readonly cancelable: boolean = false;

  /**
   * Time stamp of eventThe timeStamp read-only property of the Event interface returns the time
   * (in milliseconds) at which the event was created.
   */
  readonly timeStamp: number;

  /**
   * Creates an instance of event.
   * @param type event type
   * @param [bubbles] indicates this event bubbles up through its parents or not
   * @param [cancelable] indicates this event is cancelable or not
   */
  constructor(type: string, bubbles: boolean = true, cancelable: boolean = true) {
    this.type = type;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
    this.timeStamp = Date.now();
  }

  /**
   * The Event interface's preventDefault() method tells the user agent that if the event does not
   * get explicitly handled, its default action should not be taken as it normally would be. The
   * event continues to propagate as usual, unless one of its event listeners calls
   * stopPropagation() or stopImmediatePropagation(), either of which terminates propagation at
   * once.
   *
   * As noted below, calling preventDefault() for a non-cancelable event, such as one dispatched
   * via EventTarget.dispatchEvent(), without specifying cancelable: true has no effect.
   */
  preventDefault() {
    this.defaultPrevented = this.cancelable && true;
  }

  /**
   * Stops propagationThe stopPropagation() method of the Event interface prevents further
   * propagation of the current event in the capturing and bubbling phases.
   */
  stopPropagation() {
    this.propagationStopped = true;
  }

  /**
   * The stopImmediatePropagation() method of the Event interface prevents other listeners of the
   * same event from being called.
   *
   * If several listeners are attached to the same element for the same event type, they are called
   * in the order in which they were added. If stopImmediatePropagation() is invoked during one
   * such call, no remaining listeners will be called.
   */
  stopImmediatePropagation() {
    this.immediatePropagationStopped = this.propagationStopped = true;
  }

  /**
   * Returns a string representation of this Event object.
   * @returns a string representation of this Event object.
   */
  toString() {
    return '[Event (type=' + this.type + ')]';
  }
}

type IEventListener<T extends Event> = (event: T) => void;

interface IListeners<T extends Event> {
  [key: string]: IEventListener<T>[];
}

/**
 * This class represents an class which can dispatch specified type of event to its listeners.
 */
export class EventDispatcher<T extends Event> {
  private listeners: IListeners<T> = {};

  /**
   * Adds event listener of specified type.
   * @param type event type to listen, it can be one type or a list of type.
   * @param listener a listener which be invoked if an event with this specified type is
   * dispatching.
   * @returns current object itself for chain calls.
   */
  public addEventListener(
    type: string | string[],
    listener: IEventListener<T>
  ): EventDispatcher<T> {
    const types = typeof type === 'string' ? [type] : type;
    for (const t of types) {
      let listeners = this.listeners[t];
      if (listeners) {
        this.removeEventListener(t, listener);
      }
      listeners = this.listeners[t]; // 'removeEventListener' may have deleted the array
      if (!listeners) {
        this.listeners[t] = [listener];
      } else {
        listeners.push(listener);
      }
    }
    return this;
  }

  /**
   * Alias of 'addEventListener' method.
   */
  public on(type: string | string[], listener: IEventListener<T>): EventDispatcher<T> {
    return this.addEventListener(type, listener);
  }

  /**
   * Removes a event listener with specified type.
   * @param type event type to remove, it can be one type or a list of type.
   * @param listener a listener which te be removed.
   * @returns current object itself for chain calls.
   */
  public removeEventListener(
    type: string | string[],
    listener: IEventListener<T>
  ): EventDispatcher<T> {
    const types = typeof type === 'string' ? [type] : type;
    for (const t of types) {
      const arr = this.listeners[t];
      if (!arr) {
        return;
      }
      for (let i = 0, l = arr.length; i < l; i++) {
        if (arr[i] === listener) {
          if (l === 1) {
            delete this.listeners[t];
          } else {
            arr.splice(i, 1);
          }
          break;
        }
      }
    }
    return this;
  }

  /**
   * Alias of 'removeEventListener' method.
   */
  public off(type: string | string[], listener: IEventListener<T>) {
    this.removeEventListener(type, listener);
  }

  /**
   * Removes all event listeners of a specified type, if the type is not specified, remove all
   * listeners of all types.
   * @param type event type to remove, if it is not specified, remove all listeners of all types.
   */
  public removeAllEventListeners(type?: string) {
    if (!type) {
      this.listeners = {};
    } else if (this.listeners) {
      delete this.listeners[type];
    }
  }

  /**
   * Determines whether current object has any event listener of specified type.
   * @param type event type to check.
   * @returns true if there is any event listener of specified type.
   */
  public hasEventListener(type: string): boolean {
    return !!this.listeners[type];
  }

  /**
   * Alias of 'hasEventListener' method.
   */
  public willTrigger(type: string): boolean {
    return this.hasEventListener(type);
  }

  /**
   * Dispatches event to each listeners.
   * @param event event to be dispatched
   * @returns true if the event is not prevented by any listener.
   */
  public dispatchEvent(event: T): boolean {
    let listeners = this.listeners[event.type];
    if (listeners) {
      // To avoid issues with items being removed or added during the dispatch
      listeners = listeners.slice();
      for (let i = 0; i < listeners.length && !event.immediatePropagationStopped; i++) {
        listeners[i](event);
      }
    }
    return !event.defaultPrevented;
  }
}
