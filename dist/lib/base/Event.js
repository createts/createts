"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventDispatcher = exports.Event = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * This class represents an event object.
 */
var Event = /*#__PURE__*/function () {
  /**
   * True indicates that the default user agent action was prevented, and false indicates that it was
   * not.
   */

  /**
   * True indicates that the Event interface prevents further propagation of the current event in
   * the capturing and bubbling phases, and false indicates that it was not.
   */

  /**
   * True indicates that prevents other listeners of the same event from being called.
   */

  /**
   * Type of event.
   */

  /**
   * The bubbles read-only property of the Event interface indicates whether the event bubbles up
   * through its parents or not.
   */

  /**
   * The cancelable read-only property of the Event interface indicates whether the event can be
   * canceled, and therefore prevented as if the event never happened. If the event is not
   * cancelable, then its cancelable property will be false and the event listener cannot stop
   * the event from occurring.
   */

  /**
   * Time stamp of eventThe timeStamp read-only property of the Event interface returns the time
   * (in milliseconds) at which the event was created.
   */

  /**
   * Creates an instance of event.
   * @param type event type
   * @param [bubbles] indicates this event bubbles up through its parents or not
   * @param [cancelable] indicates this event is cancelable or not
   */
  function Event(type) {
    var bubbles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var cancelable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _classCallCheck(this, Event);

    this.defaultPrevented = false;
    this.propagationStopped = false;
    this.immediatePropagationStopped = false;
    this.type = void 0;
    this.bubbles = false;
    this.cancelable = false;
    this.timeStamp = void 0;
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


  _createClass(Event, [{
    key: "preventDefault",
    value: function preventDefault() {
      this.defaultPrevented = this.cancelable && true;
    }
    /**
     * Stops propagationThe stopPropagation() method of the Event interface prevents further
     * propagation of the current event in the capturing and bubbling phases.
     */

  }, {
    key: "stopPropagation",
    value: function stopPropagation() {
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

  }, {
    key: "stopImmediatePropagation",
    value: function stopImmediatePropagation() {
      this.immediatePropagationStopped = this.propagationStopped = true;
    }
    /**
     * Returns a string representation of this Event object.
     * @returns a string representation of this Event object.
     */

  }, {
    key: "toString",
    value: function toString() {
      return '[Event (type=' + this.type + ')]';
    }
  }]);

  return Event;
}();

exports.Event = Event;

/**
 * This class represents an class which can dispatch specified type of event to its listeners.
 */
var EventDispatcher = /*#__PURE__*/function () {
  function EventDispatcher() {
    _classCallCheck(this, EventDispatcher);

    this.listeners = {};
  }

  _createClass(EventDispatcher, [{
    key: "addEventListener",

    /**
     * Adds event listener of specified type.
     * @param type event type to listen.
     * @param listener a listener which be invoked if an event with this specified type is
     * dispatching.
     * @returns current object itself for chain calls.
     */
    value: function addEventListener(type, listener) {
      var listeners = this.listeners[type];

      if (listeners) {
        this.removeEventListener(type, listener);
      }

      listeners = this.listeners[type]; // 'removeEventListener' may have deleted the array

      if (!listeners) {
        this.listeners[type] = [listener];
      } else {
        listeners.push(listener);
      }

      return this;
    }
    /**
     * Alias of 'addEventListener' method.
     */

  }, {
    key: "on",
    value: function on(type, listener) {
      return this.addEventListener(type, listener);
    }
    /**
     * Removes a event listener with specified type.
     * @param type event type to remove.
     * @param listener a listener which te be removed.
     */

  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener) {
      var arr = this.listeners[type];

      if (!arr) {
        return;
      }

      for (var i = 0, l = arr.length; i < l; i++) {
        if (arr[i] === listener) {
          if (l === 1) {
            delete this.listeners[type];
          } else {
            arr.splice(i, 1);
          }

          break;
        }
      }
    }
    /**
     * Alias of 'removeEventListener' method.
     */

  }, {
    key: "off",
    value: function off(type, listener) {
      this.removeEventListener(type, listener);
    }
    /**
     * Removes all event listeners of a specified type, if the type is not specified, remove all
     * listeners of all types.
     * @param type event type to remove, if it is not specified, remove all listeners of all types.
     */

  }, {
    key: "removeAllEventListeners",
    value: function removeAllEventListeners(type) {
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

  }, {
    key: "hasEventListener",
    value: function hasEventListener(type) {
      return !!this.listeners[type];
    }
    /**
     * Alias of 'hasEventListener' method.
     */

  }, {
    key: "willTrigger",
    value: function willTrigger(type) {
      return this.hasEventListener(type);
    }
    /**
     * Dispatches event to each listeners.
     * @param event event to be dispatched
     * @returns true if the event is not prevented by any listener.
     */

  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      var listeners = this.listeners[event.type];

      if (listeners) {
        // To avoid issues with items being removed or added during the dispatch
        listeners = listeners.slice();

        for (var i = 0; i < listeners.length && !event.immediatePropagationStopped; i++) {
          listeners[i](event);
        }
      }

      return !event.defaultPrevented;
    }
  }]);

  return EventDispatcher;
}();

exports.EventDispatcher = EventDispatcher;