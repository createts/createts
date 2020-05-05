function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import { AnimationStep } from '../animation/Animation';
import { HtmlParser } from '../parser/HtmlParser';
import { ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { DrawUtils } from '../utils/DrawUtils';
import { Stage } from './Stage';
import { XObject, XObjectEvent } from './XObject';
/**
 * The definition of sprite, a sprite contains size, fps, image and frames.
 */

/**
 * A class defines controls when an sprite render which frame during the animation life cycle.
 * Not like a normal animation, the sprite frames are discrete, we only render the frame while goto
 * next one.
 */
var SpriteAnimationStep = /*#__PURE__*/function (_AnimationStep) {
  _inherits(SpriteAnimationStep, _AnimationStep);

  var _super = _createSuper(SpriteAnimationStep);

  /**
   * The targeted sprite instance.
   */

  /**
   * Create a SpriteAnimationStep instance with a sprite instance.
   * @param sprite The targeted sprite instance.
   */
  function SpriteAnimationStep(sprite) {
    var _this;

    _classCallCheck(this, SpriteAnimationStep);

    _this = _super.call(this, sprite, sprite.spriteSheet.frames.length * 1000 / sprite.spriteSheet.fps);
    _this.sprite = void 0;
    _this.sprite = sprite;
    return _this;
  }
  /**
   * Calculates the current frame and decides need to update.
   * @param percent the current process of an animation play cycle.
   * @returns True if switch frame, false otherwise.
   */


  _createClass(SpriteAnimationStep, [{
    key: "onUpdate",
    value: function onUpdate(percent) {
      if (!this.sprite.spriteSheet || this.sprite.spriteSheet.frames.length === 0) {
        return undefined;
      }

      var index = Math.min(this.sprite.spriteSheet.frames.length - 1, Math.floor(this.sprite.spriteSheet.frames.length * percent));

      if (index === this.sprite.currentFrame) {
        return undefined;
      } else {
        this.sprite.currentFrame = index;
        this.sprite.dispatchEvent(new XObjectEvent('update', true, true, this.sprite));
        return {
          currentFrame: index
        };
      }
    }
  }]);

  return SpriteAnimationStep;
}(AnimationStep);
/**
 * This class represents a sprite object, which plays a sequence of frames from a SpriteSheet
 * instance.
 *
 * Code example:
 * ```typescript
 *  const sprite = new Sprite();
 *  const spriteSheet = {
 *    width: 480,
 *    height: 400,
 *    url: "./elephant.png",
 *    fps: 20,
 *    frames: []
 *  };
 *  for (let i = 0; i < 34; ++i) {
 *    opt.frames.push({ x: 0, y: 400 * i });
 *  }
 *  sprite.setSpriteSheet(spriteSheet).play();
 * ```
 */


export var Sprite = /*#__PURE__*/function (_XObject) {
  _inherits(Sprite, _XObject);

  var _super2 = _createSuper(Sprite);

  /**
   * The SpriteSheet instance to play back.
   */

  /**
   * Index of current frame.
   */

  /**
   * The animation instance to play the sprite sheet.
   */

  /**
   * Create a sprite object, you need to call setSpriteSheet method after the instance was created.
   * @param options The options to create this object.
   */
  function Sprite(options) {
    var _this2;

    _classCallCheck(this, Sprite);

    _this2 = _super2.call(this, options);
    _this2.spriteSheet = void 0;
    _this2.currentFrame = 0;
    _this2.animation = void 0;

    if (options) {
      if (options.attributes && options.attributes.src) {
        ResourceRegistry.DefaultInstance.add(options.attributes.src, ResourceType.JSON).then(function (json) {
          _this2.setSpriteSheet(json);

          _this2.dispatchEvent(new XObjectEvent('load', false, true, _assertThisInitialized(_this2)));
        });
      }
    }

    return _this2;
  }
  /**
   * Set the SpriteSheet to let this Sprite instance know how to play.
   * @param spriteSheet The SpriteSheet instance to be set.
   * @returns The current instance. Useful for chaining method calls.
   */


  _createClass(Sprite, [{
    key: "setSpriteSheet",
    value: function setSpriteSheet(spriteSheet) {
      var _this3 = this;

      this.spriteSheet = spriteSheet;

      if (this.spriteSheet) {
        if (this.spriteSheet.url) {
          ResourceRegistry.DefaultInstance.add(this.spriteSheet.url, ResourceType.IMAGE);
        }

        var _iterator = _createForOfIteratorHelper(this.spriteSheet.frames),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var frame = _step.value;

            if (frame.url) {
              ResourceRegistry.DefaultInstance.add(frame.url, ResourceType.IMAGE).then(function () {
                _this3.dispatchEvent(new XObjectEvent('update', true, true, _this3));
              });
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      this.dispatchEvent(new XObjectEvent('update', true, true, this));
      return this;
    }
    /**
     * returns stage of this element, or undefined if this element is not attached to a stage.
     * @returns Stage or undefined.
     */

  }, {
    key: "getStage",
    value: function getStage() {
      var element = this;

      while (element) {
        if (element instanceof Stage) {
          return element;
        }

        element = element.parent;
      }

      return undefined;
    }
    /**
     * Play the sprite for the specified times, -1 for infinite.
     * @param times How many times to play this sprite, -1 for infinite.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "play",
    value: function play() {
      var _this4 = this;

      var times = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;

      if (this.animation) {
        this.animation.cancel();
        this.animation = undefined;
      }

      var stage = this.getStage();

      if (stage) {
        this.animation = stage.animate(this).addStep(new SpriteAnimationStep(this)).times(times);
        this.animation.addEventListener('complete', function () {
          return _this4.dispatchEvent(new XObjectEvent('stop', false, true, _this4));
        });
        this.dispatchEvent(new XObjectEvent('play', false, true, this));
      }

      return this;
    }
    /**
     * Pause the current playing.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "pause",
    value: function pause() {
      if (this.animation && this.animation.pause()) {
        this.dispatchEvent(new XObjectEvent('pause', false, true, this));
      }

      return this;
    }
    /**
     * Resume the current playing.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "resume",
    value: function resume() {
      if (this.animation && this.animation.resume()) {
        this.dispatchEvent(new XObjectEvent('resume', false, true, this));
      }

      return this;
    }
    /**
     * Stop the current playing.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "stop",
    value: function stop() {
      if (this.animation) {
        this.animation.cancel();
        this.animation = undefined;
      }

      return this;
    }
    /**
     * Alias of play method.
     * @param times How many times to play this sprite, -1 for infinite.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "times",
    value: function times(_times) {
      return this.play(_times);
    }
    /**
     * Set the index of current frame.
     * Please do not call this method while it is playing, it may be updated in next render time.
     * @param currentFrame the index of the specified frame.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "setCurrentFrame",
    value: function setCurrentFrame(currentFrame) {
      this.currentFrame = currentFrame;
      return this;
    }
    /**
     * Move to next frame.
     * Please do not call this method while it is playing, it may be updated in next render time.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "toNextFrame",
    value: function toNextFrame() {
      this.currentFrame = (this.currentFrame + 1) % this.spriteSheet.frames.length;
      return this;
    }
    /**
     * Move to previous frame.
     * Please do not call this method while it is playing, it may be updated in next render time.
     * @param currentFrame the index of the specified frame.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "toPreviousFrame",
    value: function toPreviousFrame() {
      this.currentFrame = (this.currentFrame - 1 + this.spriteSheet.frames.length) % this.spriteSheet.frames.length;
      return this;
    }
    /**
     * Draws content of this element to targeted canvas.
     * @param ctx The canvas rendering context of targeted canvas.
     */

  }, {
    key: "drawContent",
    value: function drawContent(ctx) {
      if (!this.spriteSheet || this.spriteSheet.frames.length === 0) {
        return;
      }

      var frame = this.spriteSheet.frames[this.currentFrame];
      DrawUtils.drawFrame(ctx, this.getContentRect(), frame, this.spriteSheet);
    }
  }]);

  return Sprite;
}(XObject);
HtmlParser.registerTag('sprite', Sprite);