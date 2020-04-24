"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawUtils = void 0;

var _RoundRect = require("../base/RoundRect");

var _Style = require("../style/Style");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A class contains static draw util methods.
 */
var DrawUtils = /*#__PURE__*/function () {
  /**
   * Prevent creating instance.
   */
  function DrawUtils() {
    _classCallCheck(this, DrawUtils);
  }
  /**
   * Draws an element to canvas, it takes 3 steps:
   *
   * 1. Draw background (if any).
   * 1. Draw border and calculate the clip.
   * 1. Draw content.
   *
   * @param element The element to be drawn.
   * @param ctx The rendering context of target canvas.
   */


  _createClass(DrawUtils, null, [{
    key: "drawElement",
    value: function drawElement(element, ctx) {
      var style = element.style;

      if (style.compositeOperation) {
        ctx.globalCompositeOperation = style.compositeOperation;
      } // Step 1, calculate border.


      var topWidth = style.borderTop ? style.borderTop.width : 0;
      var rightWidth = style.borderRight ? style.borderRight.width : 0;
      var bottomWidth = style.borderBottom ? style.borderBottom.width : 0;
      var leftWidth = style.borderLeft ? style.borderLeft.width : 0;
      var outerRect = new _RoundRect.RoundRect().applySize(element.rect.width, element.rect.height).applyRadius(style.borderRadiusTop, style.borderRadiusRight, style.borderRadiusBottom, style.borderRadiusLeft);
      var innerRect;

      if (topWidth > 0 || rightWidth > 0 || bottomWidth > 0 || leftWidth > 0) {
        innerRect = outerRect.applyBorder(topWidth, rightWidth, bottomWidth, leftWidth);
      } else {
        innerRect = outerRect;
      } // Step 2, draw shadow.


      if (style.shadow && style.shadow.isEnable()) {
        ctx.save();
        ctx.shadowBlur = style.shadow.blur;
        ctx.shadowColor = style.shadow.color.toString();
        ctx.shadowOffsetX = style.shadow.offsetX;
        ctx.shadowOffsetY = style.shadow.offsetY;
        var x = Math.abs(style.shadow.offsetX) + style.shadow.blur;
        var y = Math.abs(style.shadow.offsetY) + style.shadow.blur;
        var shadowRect = new _RoundRect.RoundRect(outerRect.x1 - x, outerRect.y1 - y, outerRect.x2 + x, outerRect.y2 + y);
        ctx.beginPath();
        shadowRect.makePath(ctx, true, true);
        outerRect.makePath(ctx, false, false);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        outerRect.makePath(ctx, true, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } // Step 3, draw background.


      ctx.save();
      element.drawBackground(ctx, outerRect, innerRect);
      ctx.restore(); // Step 4, draw border

      if (topWidth > 0 || rightWidth > 0 || bottomWidth > 0 || leftWidth > 0) {
        var topColor = style.borderTop ? style.borderTop.color : undefined;
        var rightColor = style.borderRight ? style.borderRight.color : undefined;
        var bottomColor = style.borderBottom ? style.borderBottom.color : undefined;
        var leftColor = style.borderLeft ? style.borderLeft.color : undefined;
        var colors = [];

        if (topColor) {
          colors.push(topColor);
        }

        if (rightColor) {
          colors.push(rightColor);
        }

        if (bottomColor) {
          colors.push(bottomColor);
        }

        if (leftColor) {
          colors.push(leftColor);
        }

        var color = colors[0];
        var sameColor = true;

        for (var i = 1; i < colors.length; ++i) {
          if (!color.equals(colors[i])) {
            sameColor = false;
          }
        }

        if (sameColor) {
          ctx.beginPath();
          outerRect.makePath(ctx, true, true);
          innerRect.makePath(ctx, false, false);
          ctx.closePath();
          ctx.fillStyle = color.toString();
          ctx.fill();
        } else {
          if (leftColor) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(outerRect.x1, outerRect.y1);

            if (!topColor) {
              ctx.lineTo(innerRect.x1 + innerRect.leftTopRadiusX, outerRect.y1);
            }

            ctx.lineTo(innerRect.x1 + innerRect.leftTopRadiusX, innerRect.y1 + innerRect.leftTopRadiusY);
            ctx.lineTo(innerRect.x1 + innerRect.leftBottomRadiusX, innerRect.y2 - innerRect.leftBottomRadiusY);

            if (!bottomColor) {
              ctx.lineTo(innerRect.x1 + innerRect.leftBottomRadiusX, outerRect.y2);
            }

            ctx.lineTo(outerRect.x1, outerRect.y2);
            ctx.closePath();
            ctx.clip();
            ctx.beginPath();
            outerRect.makePath(ctx, true, true);
            innerRect.makePath(ctx, false, false);
            ctx.closePath();
            ctx.fillStyle = leftColor.toString();
            ctx.fill();
            ctx.restore();
          }

          if (topColor) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(outerRect.x2, outerRect.y1);

            if (!rightColor) {
              ctx.lineTo(outerRect.x2, outerRect.y1 + outerRect.rightTopRadiusY);
            }

            ctx.lineTo(innerRect.x2 - innerRect.rightTopRadiusX, innerRect.y1 + innerRect.rightTopRadiusY);
            ctx.lineTo(innerRect.x1 + innerRect.leftTopRadiusX, innerRect.y1 + innerRect.leftTopRadiusY);

            if (!leftColor) {
              ctx.lineTo(outerRect.x1, outerRect.y1 + outerRect.leftTopRadiusY);
            }

            ctx.lineTo(outerRect.x1, outerRect.y1);
            ctx.closePath();
            ctx.clip();
            ctx.beginPath();
            outerRect.makePath(ctx, true, true);
            innerRect.makePath(ctx, false, false);
            ctx.closePath();
            ctx.fillStyle = topColor.toString();
            ctx.fill();
            ctx.restore();
          }

          if (rightColor) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(outerRect.x2, outerRect.y2);

            if (!bottomColor) {
              ctx.lineTo(outerRect.x2 - outerRect.rightBottomRadiusX, outerRect.y2);
            }

            ctx.lineTo(innerRect.x2 - innerRect.rightBottomRadiusX, innerRect.y2 - innerRect.rightBottomRadiusY);
            ctx.lineTo(innerRect.x2 - innerRect.rightTopRadiusX, innerRect.y1 + innerRect.rightTopRadiusY);

            if (!topColor) {
              ctx.lineTo(innerRect.x2 - innerRect.rightTopRadiusX, outerRect.y1);
            }

            ctx.lineTo(outerRect.x2, outerRect.y1);
            ctx.closePath();
            ctx.clip();
            ctx.beginPath();
            outerRect.makePath(ctx, true, true);
            innerRect.makePath(ctx, false, false);
            ctx.closePath();
            ctx.fillStyle = rightColor.toString();
            ctx.fill();
            ctx.restore();
          }

          if (bottomColor) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(outerRect.x1, outerRect.y2);

            if (!leftColor) {
              ctx.lineTo(outerRect.x1, outerRect.y2 - outerRect.leftBottomRadiusY);
            }

            ctx.lineTo(innerRect.x1 + innerRect.leftBottomRadiusX, innerRect.y2 - innerRect.leftBottomRadiusY);
            ctx.lineTo(innerRect.x2 - innerRect.rightBottomRadiusX, innerRect.y2 - innerRect.rightBottomRadiusY);

            if (!rightColor) {
              ctx.lineTo(outerRect.x2, outerRect.y2 - outerRect.rightBottomRadiusY);
            }

            ctx.lineTo(outerRect.x2, outerRect.y2);
            ctx.closePath();
            ctx.clip();
            ctx.beginPath();
            outerRect.makePath(ctx, true, true);
            innerRect.makePath(ctx, false, false);
            ctx.closePath();
            ctx.fillStyle = bottomColor.toString();
            ctx.fill();
            ctx.restore();
          }
        }
      } // Step 6, draw content


      if (element.style.overflow === _Style.Overflow.HIDDEN) {
        ctx.save();
        innerRect.clip(ctx);
        element.drawContent(ctx);
        ctx.restore();
      } else {
        element.drawContent(ctx);
      }
    }
  }]);

  return DrawUtils;
}();

exports.DrawUtils = DrawUtils;