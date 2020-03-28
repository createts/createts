"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sprite = void 0;

var _Animation = require("../animation/Animation");

var _HtmlParser = require("../parser/HtmlParser");

var _ResourceRegistry = require("../resource/ResourceRegistry");

var _Stage = require("./Stage");

var _XObject2 = require("./XObject");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * A class defines controls when an sprite render which frame during the animation life cycle.
 * Not like a normal animation, the sprite frames are discrete, we only render the frame while goto
 * next one.
 */
var SpriteAnimationStep = /*#__PURE__*/function (_AnimationStep) {
  _inherits(SpriteAnimationStep, _AnimationStep);

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

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SpriteAnimationStep).call(this, sprite, sprite.spriteSheet.frames.length * 1000 / sprite.spriteSheet.fps));
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
        return false;
      }

      var index = Math.min(this.sprite.spriteSheet.frames.length - 1, Math.floor(this.sprite.spriteSheet.frames.length * percent));

      if (index === this.sprite.currentFrame) {
        return false;
      } else {
        this.sprite.currentFrame = index;
        return true;
      }
    }
  }]);

  return SpriteAnimationStep;
}(_Animation.AnimationStep);
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


var Sprite = /*#__PURE__*/function (_XObject) {
  _inherits(Sprite, _XObject);

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

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Sprite).call(this, options));
    _this2.spriteSheet = void 0;
    _this2.currentFrame = 0;
    _this2.animation = void 0;
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
      this.spriteSheet = spriteSheet;

      if (this.spriteSheet && this.spriteSheet.url) {
        _ResourceRegistry.ResourceRegistry.DefaultInstance.add(this.spriteSheet.url, _ResourceRegistry.ResourceType.IMAGE);
      }

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
        if (element instanceof _Stage.Stage) {
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
      var _this3 = this;

      var times = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;

      if (this.animation) {
        this.animation.cancel();
        this.animation = undefined;
      }

      var stage = this.getStage();

      if (stage) {
        this.animation = stage.animate(this).addStep(new SpriteAnimationStep(this)).times(times);
        this.animation.addEventListener('complete', function () {
          return _this3.dispatchEvent(new _XObject2.TouchEvent(_this3, 'stop'));
        });
        this.dispatchEvent(new _XObject2.TouchEvent(this, 'play'));
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
        this.dispatchEvent(new _XObject2.TouchEvent(this, 'pause'));
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
        this.dispatchEvent(new _XObject2.TouchEvent(this, 'resume'));
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

      var frame = this.spriteSheet.frames[this.currentFrame]; // Get image

      var rect = this.getContentRect();
      var image;

      if (frame.image) {
        image = frame.image;
      } else {
        image = this.spriteSheet.image || this.spriteSheet.url && _ResourceRegistry.ResourceRegistry.DefaultInstance.get(this.spriteSheet.url);
      }

      if (!image) {
        return;
      }

      var scaleX = rect.width / this.spriteSheet.width;
      var scaleY = rect.height / this.spriteSheet.height;
      var destX = frame.destX !== undefined ? frame.destX : 0;
      var destY = frame.destY !== undefined ? frame.destY : 0;
      var destWidth = frame.destWidth !== undefined ? frame.destWidth : this.spriteSheet.width - destX;
      var destHeight = frame.destHeight !== undefined ? frame.destHeight : this.spriteSheet.height - destY;
      var srcX = frame.srcX !== undefined ? frame.srcX : 0;
      var srcY = frame.srcY !== undefined ? frame.srcY : 0;
      var srcWidth = frame.srcWidth !== undefined ? frame.srcWidth : destWidth;
      var srcHeight = frame.srcHeight !== undefined ? frame.srcHeight : destHeight;

      try {
        ctx.drawImage(image, srcX, srcY, srcWidth, srcHeight, destX * scaleX, destY * scaleY, destWidth * scaleX, destHeight * scaleY);
      } catch (e) {
        return;
      }
    }
  }]);

  return Sprite;
}(_XObject2.XObject);

exports.Sprite = Sprite;

_HtmlParser.HtmlParser.registerTag('sprite', Sprite);