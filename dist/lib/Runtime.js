"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Runtime = void 0;

var _Point = require("./base/Point");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WebRuntime =
/*#__PURE__*/
function () {
  function WebRuntime() {
    _classCallCheck(this, WebRuntime);

    this.globalCanvas = void 0;
  }

  _createClass(WebRuntime, [{
    key: "newCanvas",
    value: function newCanvas() {
      return document.createElement('canvas');
    }
  }, {
    key: "releaseCanvas",
    value: function releaseCanvas(canvas) {
      return;
    }
  }, {
    key: "enableEvents",
    value: function enableEvents(stage) {
      var _this = this;

      stage.canvas.addEventListener('mousedown', function (e) {
        _this.handleEvent('mousedown', stage, e);
      });
      stage.canvas.addEventListener('mousemove', function (e) {
        _this.handleEvent('mousemove', stage, e);
      });
      stage.canvas.addEventListener('pressmove', function (e) {
        _this.handleEvent('mousemove', stage, e);
      });
      stage.canvas.addEventListener('mouseup', function (e) {
        _this.handleEvent('mouseup', stage, e);
      });
      stage.canvas.addEventListener('mouseenter', function (e) {
        _this.handleEvent('mouseenter', stage, e);
      });
      stage.canvas.addEventListener('mouseleave', function (e) {
        _this.handleEvent('mouseleave', stage, e);
      });
    }
  }, {
    key: "requestAnimationFrame",
    value: function requestAnimationFrame(listener) {
      window.requestAnimationFrame(listener);
    }
  }, {
    key: "measureTextWidth",
    value: function measureTextWidth(text, font) {
      if (text.length === 0) {
        return 0;
      }

      var canvas = this.getGlobalCanvas();
      var ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.save();
        ctx.font = font.toString();
        var width = ctx.measureText(text).width;
        ctx.restore();
        return width;
      } else {
        return 0;
      }
    }
  }, {
    key: "getGlobalCanvas",
    value: function getGlobalCanvas() {
      if (!this.globalCanvas) {
        this.globalCanvas = this.newCanvas();
      }

      return this.globalCanvas;
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(type, stage, e) {
      var scaleX = stage.canvas.width / stage.canvas.clientWidth;
      var scaleY = stage.canvas.height / stage.canvas.clientHeight;
      var x = e.offsetX * scaleX;
      var y = e.offsetY * scaleY;
      stage.handleActionEvent(type, new _Point.Point(x, y), e);
    }
  }]);

  return WebRuntime;
}();

var Runtime =
/*#__PURE__*/
function () {
  function Runtime() {
    _classCallCheck(this, Runtime);
  }

  _createClass(Runtime, null, [{
    key: "get",
    value: function get() {
      return this.runtime;
    }
  }]);

  return Runtime;
}();

exports.Runtime = Runtime;
Runtime.runtime = new WebRuntime();