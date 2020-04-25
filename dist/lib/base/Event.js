"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventDispatcher = exports.Event = void 0;

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
     * @param type event type to listen, it can be one type or a list of type.
     * @param listener a listener which be invoked if an event with this specified type is
     * dispatching.
     * @returns current object itself for chain calls.
     */
    value: function addEventListener(type, listener) {
      var types = typeof type === 'string' ? [type] : type;

      var _iterator = _createForOfIteratorHelper(types),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var t = _step.value;
          var listeners = this.listeners[t];

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
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
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
     * @param type event type to remove, it can be one type or a list of type.
     * @param listener a listener which te be removed.
     * @returns current object itself for chain calls.
     */

  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener) {
      var types = typeof type === 'string' ? [type] : type;

      var _iterator2 = _createForOfIteratorHelper(types),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var t = _step2.value;
          var arr = this.listeners[t];

          if (!arr) {
            return;
          }

          for (var i = 0, l = arr.length; i < l; i++) {
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
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return this;
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