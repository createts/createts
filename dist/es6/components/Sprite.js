function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import { ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { XActionEvent, XObject } from './XObject';
var SpriteState;

(function (SpriteState) {
  SpriteState[SpriteState["STOPPED"] = 0] = "STOPPED";
  SpriteState[SpriteState["PLAYING"] = 1] = "PLAYING";
  SpriteState[SpriteState["PAUSED"] = 2] = "PAUSED";
})(SpriteState || (SpriteState = {}));

export var Sprite =
/*#__PURE__*/
function (_XObject) {
  _inherits(Sprite, _XObject);

  function Sprite(options) {
    var _this;

    _classCallCheck(this, Sprite);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Sprite).call(this, options));
    _this.option = void 0;
    _this.currentFrame = 0;
    _this.startTime = 0;
    _this.pauseTime = 0;
    _this.state = SpriteState.STOPPED;
    _this.playTimes = 0;
    return _this;
  }

  _createClass(Sprite, [{
    key: "setOption",
    value: function setOption(option) {
      this.option = option;

      if (this.option && this.option.url) {
        ResourceRegistry.DefaultInstance.add(this.option.url, ResourceType.IMAGE);
      }

      return this;
    }
  }, {
    key: "play",
    value: function play() {
      var times = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
      this.playTimes = times;
      this.startTime = Date.now();
      this.currentFrame = 0;
      this.state = SpriteState.PLAYING;
      this.dispatchEvent(new XActionEvent(this, 'play'));
      return this;
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.state === SpriteState.PLAYING) {
        this.state = SpriteState.PAUSED;
        this.pauseTime = Date.now();
        this.dispatchEvent(new XActionEvent(this, 'pause'));
      }

      return this;
    }
  }, {
    key: "resume",
    value: function resume() {
      if (this.state === SpriteState.PAUSED) {
        this.state = SpriteState.PLAYING;
        this.startTime = this.startTime + Date.now() - this.pauseTime;
        this.dispatchEvent(new XActionEvent(this, 'resume'));
      }

      return this;
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.state !== SpriteState.STOPPED) {
        this.state = SpriteState.STOPPED;
        this.dispatchEvent(new XActionEvent(this, 'stop'));
      }

      return this;
    }
  }, {
    key: "times",
    value: function times(_times) {
      return this.play(_times);
    }
  }, {
    key: "setCurrentFrame",
    value: function setCurrentFrame(currentFrame) {
      this.currentFrame = currentFrame;
      return this;
    }
  }, {
    key: "toNextFrame",
    value: function toNextFrame() {
      this.currentFrame = (this.currentFrame + 1) % this.option.frames.length;
      return this;
    }
  }, {
    key: "toPreviousFrame",
    value: function toPreviousFrame() {
      this.currentFrame = (this.currentFrame - 1 + this.option.frames.length) % this.option.frames.length;
      return this;
    }
  }, {
    key: "updateFramePosition",
    value: function updateFramePosition() {
      if (this.state !== SpriteState.PLAYING || this.playTimes === 0 || !this.option || this.option.fps <= 0 || this.option.frames.length === 0) {
        return false;
      }

      var now = Date.now();

      if (now < this.startTime) {
        this.startTime = now;
        this.currentFrame = 0;
        return false;
      }

      var interval = 1000 / this.option.fps;
      var pass = Math.floor((now - this.startTime) / interval);
      this.currentFrame = pass % this.option.frames.length;

      if (this.playTimes > 0 && pass >= this.option.frames.length * this.playTimes) {
        this.currentFrame = this.option.frames.length - 1;
        this.state = SpriteState.STOPPED;
        return true;
      }
    }
  }, {
    key: "drawContent",
    value: function drawContent(ctx) {
      if (!this.option || this.option.frames.length === 0) {
        return;
      }

      var end = this.updateFramePosition();
      var frame = this.option.frames[this.currentFrame]; // Get image

      var rect = this.getContentRect();
      var image;
      var srcX = 0;
      var srcY = 0;
      var srcWidth = this.option.width;
      var srcHeight = this.option.height;
      var destX = rect.x;
      var destY = rect.y;
      var destWidth = rect.width;
      var destHeight = rect.height;
      var scaleX = rect.width / this.option.width;
      var scaleY = rect.height / this.option.height;

      if (frame.image) {
        image = frame.image;
        destX += frame.x * scaleX;
        destY += frame.y * scaleY;
        destWidth = frame.width * scaleX;
        destHeight = frame.height * scaleY;
        srcX = 0;
        srcY = 0;
        srcWidth = frame.width;
        srcHeight = frame.height;
      } else {
        image = this.option.image || this.option.url && ResourceRegistry.DefaultInstance.get(this.option.url);

        if (!image) {
          return;
        }

        srcX = frame.x;
        srcY = frame.y;
        srcWidth = frame.width || this.option.width;
        srcHeight = frame.height || this.option.height;
      }

      if (!image) {
        return;
      }

      try {
        ctx.drawImage(image, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth, destHeight);
      } catch (e) {
        console.warn(this.currentFrame, e);
      }

      if (end) {
        this.dispatchEvent(new XActionEvent(this, 'stop'));
      }
    }
  }]);

  return Sprite;
}(XObject);