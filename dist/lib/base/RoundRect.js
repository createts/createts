"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RoundRect = void 0;

var _Rect = require("../base/Rect");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * This class represents an rectangle object which contains start point (x, y) and size (width, height) with radius in
 * four corners.
 */
var RoundRect = /*#__PURE__*/function () {
  /**
   * The X coordinate of the left-top corner of the Rect.
   */

  /**
   * The Y coordinate of the left-top corner of the Rect.
   */

  /**
   * The X coordinate of the right-bottom corner of the Rect.
   */

  /**
   * The Y coordinate of the right-bottom corner of the Rect.
   */

  /**
   * The X radius of the left-top corner of the Rect.
   */

  /**
   * The Y radius of the left-top corner of the Rect.
   */

  /**
   * The X radius of the right-top corner of the Rect.
   */

  /**
   * The Y radius of the right-top corner of the Rect.
   */

  /**
   * The X radius of the right-bottom corner of the Rect.
   */

  /**
   * The Y radius of the right-bottom corner of the Rect.
   */

  /**
   * The X radius of the left-bottom corner of the Rect.
   */

  /**
   * The Y radius of the left-bottom corner of the Rect.
   */
  function RoundRect() {
    var x1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var x2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var y2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    _classCallCheck(this, RoundRect);

    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.leftTopRadiusX = 0;
    this.leftTopRadiusY = 0;
    this.rightTopRadiusX = 0;
    this.rightTopRadiusY = 0;
    this.rightBottomRadiusX = 0;
    this.rightBottomRadiusY = 0;
    this.leftBottomRadiusX = 0;
    this.leftBottomRadiusY = 0;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
  /**
   * Convert current RoundRect object to a Rect object by dropping radius.
   *
   * @returns a Rect object with same position and size.
   */


  _createClass(RoundRect, [{
    key: "toRect",
    value: function toRect() {
      return new _Rect.Rect(this.x1, this.y1, this.x2 - this.x1 + 1, this.y2 - this.y1 + 1);
    }
    /**
     * Apply the given size.
     * @param width width of new size.
     * @param height height of new size.
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "applySize",
    value: function applySize(width, height) {
      this.x2 = this.x1 + width - 1;
      this.y2 = this.y1 + height - 1;
      return this;
    }
    /**
     * Apply the given radius of 4 corners.
     * @param radiusLeftTop radius in left-top corner.
     * @param radiusRightTop height in right-top corner.
     * @param radiusRightBottom radius in right-bottom corner.
     * @param radiusLeftBottom radius in left-bottom corner.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "applyRadius",
    value: function applyRadius(radiusLeftTop, radiusRightTop, radiusRightBottom, radiusLeftBottom) {
      var width = this.x2 - this.x1 + 1;
      var height = this.y2 - this.y1 + 1;

      if (radiusLeftTop) {
        this.leftTopRadiusX = radiusLeftTop.getValue(width);
        this.leftTopRadiusY = radiusLeftTop.getValue(height);
      }

      if (radiusRightTop) {
        this.rightTopRadiusX = radiusRightTop.getValue(width);
        this.rightTopRadiusY = radiusRightTop.getValue(height);
      }

      if (radiusRightBottom) {
        this.rightBottomRadiusX = radiusRightBottom.getValue(width);
        this.rightBottomRadiusY = radiusRightBottom.getValue(height);
      }

      if (radiusLeftBottom) {
        this.leftBottomRadiusX = radiusLeftBottom.getValue(width);
        this.leftBottomRadiusY = radiusLeftBottom.getValue(height);
      }

      return this;
    }
    /**
     * Calculate the inner RoundRect by current instance and give borders in 4 directions.
     * @param top top border.
     * @param right right border.
     * @param bottom bottom border.
     * @param left left border.
     * @returns The current instance if all borders are 0, or a new RoundRect object which presents the result of current
     * instance applies the borders.
     */

  }, {
    key: "applyBorder",
    value: function applyBorder(top, right, bottom, left) {
      if (top === 0 && right === 0 && bottom === 0 && left === 0) {
        return this;
      }

      var rect = new RoundRect();
      rect.x1 = this.x1 + left;
      rect.y1 = this.y1 + top;
      rect.x2 = this.x2 - right;
      rect.y2 = this.y2 - bottom;
      rect.leftTopRadiusX = Math.max(0, this.leftTopRadiusX - left);
      rect.leftTopRadiusY = Math.max(0, this.leftTopRadiusY - top);

      if (rect.leftTopRadiusX === 0 || rect.leftTopRadiusY === 0) {
        rect.leftTopRadiusX = rect.leftTopRadiusY = 0;
      }

      rect.rightTopRadiusX = Math.max(0, this.rightTopRadiusX - right);
      rect.rightTopRadiusY = Math.max(0, this.rightTopRadiusY - top);

      if (rect.rightTopRadiusX === 0 || rect.rightTopRadiusY === 0) {
        rect.rightTopRadiusX = rect.rightTopRadiusY = 0;
      }

      rect.rightBottomRadiusX = Math.max(0, this.rightBottomRadiusX - right);
      rect.rightBottomRadiusY = Math.max(0, this.rightBottomRadiusY - bottom);

      if (rect.rightBottomRadiusX === 0 || rect.rightBottomRadiusY === 0) {
        rect.rightBottomRadiusX = rect.rightBottomRadiusY = 0;
      }

      rect.leftBottomRadiusX = Math.max(0, this.leftBottomRadiusX - left);
      rect.leftBottomRadiusY = Math.max(0, this.leftBottomRadiusY - bottom);

      if (rect.leftBottomRadiusX === 0 || rect.leftBottomRadiusY === 0) {
        rect.leftBottomRadiusX = rect.leftBottomRadiusY = 0;
      }

      return rect;
    }
    /**
     * Makes a path of current RouncRect object.
     * @param ctx The rendering context of target canvas.
     * @param newPath If true, start a new path, otherwise continue the previous path.
     * @param clockwise The directions of the path.
     */

  }, {
    key: "makePath",
    value: function makePath(ctx, newPath, clockwise) {
      var x1 = this.x1;
      var y1 = this.y1;
      var x2 = this.x2 + 1;
      var y2 = this.y2 + 1;

      if (clockwise) {
        if (newPath) {
          ctx.moveTo(x1, y1 + this.leftTopRadiusY);
        } else {
          ctx.lineTo(x1, y1 + this.leftTopRadiusY);
        }

        this.arcTo(x1, y1 + this.leftTopRadiusY, x1, y1, x1 + this.leftTopRadiusX, y1, ctx);
        this.arcTo(x2 - this.rightTopRadiusX, y1, x2, y1, x2, y1 + this.rightTopRadiusY, ctx);
        this.arcTo(x2, y2 - this.rightBottomRadiusY, x2, y2, x2 - this.rightBottomRadiusX, y2, ctx);
        this.arcTo(x1 + this.leftBottomRadiusX, y2, x1, y2, x1, y2 - this.leftBottomRadiusY, ctx);

        if (this.leftTopRadiusX !== 0 && this.leftTopRadiusY !== 0) {
          ctx.lineTo(x1, y1 + this.leftTopRadiusY);
        } else {
          ctx.lineTo(x1, y1);
        }
      } else {
        if (newPath) {
          ctx.moveTo(x1, y1 + this.leftTopRadiusY);
        } else {
          ctx.lineTo(x1, y1 + this.leftTopRadiusY);
        }

        this.arcTo(x1, y2 - this.leftBottomRadiusY, x1, y2, x1 + this.leftBottomRadiusX, y2, ctx);
        this.arcTo(x2 - this.rightBottomRadiusX, y2, x2, y2, x2, y2 - this.rightBottomRadiusY, ctx);
        this.arcTo(x2, y1 + this.rightTopRadiusY, x2, y1, x2 - this.rightTopRadiusX, y1, ctx);
        this.arcTo(x1 + this.leftTopRadiusX, y1, x1, y1, x1, y1 + this.leftTopRadiusY, ctx);
      }
    }
    /**
     * Make a clip of current RoundRect object to a canvas.
     * @param ctx The rendering context of target canvas.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "clip",
    value: function clip(ctx) {
      ctx.beginPath();
      this.makePath(ctx, true, true);
      ctx.closePath();
      ctx.clip();
      return this;
    }
    /**
     * Adds a circular arc to the current sub-path, using the given control points and radius.
     * @param x1 The X coordinate of the source point.
     * @param y1 The Y coordinate of the source point.
     * @param x0 The X coordinate of the corner point.
     * @param y0 The Y coordinate of the corner point.
     * @param x2 The X coordinate of the destination point.
     * @param y2 The Y coordinate of the destination point.
     * @param ctx The rendering context of target canvas.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "arcTo",
    value: function arcTo(x1, y1, x0, y0, x2, y2, ctx) {
      ctx.lineTo(x1, y1);
      var dx = Math.abs(x1 - x2);
      var dy = Math.abs(y1 - y2);
      var min = 0.000001;

      if (dx < min && dy < min) {
        return;
      } else if (dx < min || dy < min) {
        ctx.lineTo(x2, y2);
      } else {
        if (Math.abs(dx - dy) < min) {
          ctx.arcTo(x0, y0, x2, y2, dx);
        } else {
          ctx.quadraticCurveTo(x0, y0, x2, y2);
        }
      }
    }
  }]);

  return RoundRect;
}();

exports.RoundRect = RoundRect;