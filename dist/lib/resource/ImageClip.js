"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImageClip = exports.ImageClipRotation = void 0;

var _base = require("../base");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Rotation types for an image clip, only 0/90/180/270 deg is supported.
 */
var ImageClipRotation;
exports.ImageClipRotation = ImageClipRotation;

(function (ImageClipRotation) {
  ImageClipRotation[ImageClipRotation["Rotation0"] = 0] = "Rotation0";
  ImageClipRotation[ImageClipRotation["Rotation90"] = 90] = "Rotation90";
  ImageClipRotation[ImageClipRotation["Rotation180"] = 180] = "Rotation180";
  ImageClipRotation[ImageClipRotation["Rotation270"] = 270] = "Rotation270";
})(ImageClipRotation || (exports.ImageClipRotation = ImageClipRotation = {}));

var ImageClip = /*#__PURE__*/function () {
  _createClass(ImageClip, null, [{
    key: "of",
    value: function of(clip) {
      var pieces = clip.split(/\s+/);

      if (pieces.length != 4 && pieces.length != 5) {
        console.warn('invalid clip value:', clip);
        return undefined;
      }

      var x = parseFloat(pieces[0]);

      if (isNaN(x)) {
        console.warn('invalid clip value:', clip);
        return undefined;
      }

      var y = parseFloat(pieces[1]);

      if (isNaN(y)) {
        console.warn('invalid clip value:', clip);
        return undefined;
      }

      var width = parseFloat(pieces[2]);

      if (isNaN(width)) {
        console.warn('invalid clip value:', clip);
        return undefined;
      }

      var height = parseFloat(pieces[3]);

      if (isNaN(height)) {
        console.warn('invalid clip value:', clip);
        return undefined;
      }

      var rotation = 0;

      if (pieces.length > 4) {
        rotation = parseInt(pieces[4]);

        if (rotation !== 0 && rotation !== 90 && rotation !== 180 && rotation != 270) {
          console.warn('invalid clip value:', clip);
          return undefined;
        }
      }

      return new ImageClip(new _base.Rect(x, y, width, height), rotation);
    }
  }]);

  function ImageClip(rect) {
    var rotation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImageClipRotation.Rotation0;

    _classCallCheck(this, ImageClip);

    this.rect = void 0;
    this.rotation = void 0;
    this.rect = rect;
    this.rotation = rotation;
  }

  _createClass(ImageClip, [{
    key: "setRect",
    value: function setRect(rect) {
      this.rect = rect;
    }
  }, {
    key: "setRotation",
    value: function setRotation(rotation) {
      this.rotation = rotation;
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.rotation === ImageClipRotation.Rotation90 || this.rotation === ImageClipRotation.Rotation270 ? this.rect.height : this.rect.width;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.rotation === ImageClipRotation.Rotation90 || this.rotation === ImageClipRotation.Rotation270 ? this.rect.width : this.rect.height;
    }
  }, {
    key: "draw",
    value: function draw(ctx, image, rect) {
      switch (this.rotation) {
        case ImageClipRotation.Rotation0:
          ctx.drawImage(image, this.rect.x, this.rect.y, this.rect.width, this.rect.height, rect.x, rect.y, rect.width, rect.height);
          break;

        case ImageClipRotation.Rotation90:
          ctx.save();
          var mtx = new _base.Matrix2D().appendTransform(0, rect.height, 1, 1, 270, 0, 0, 0, 0);
          ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
          ctx.drawImage(image, this.rect.x, this.rect.y, this.rect.width, this.rect.height, rect.x, rect.y, rect.height, rect.width);
          ctx.restore();
          break;

        case ImageClipRotation.Rotation180:
          ctx.save();
          mtx = new _base.Matrix2D().appendTransform(rect.width, rect.height, 1, 1, 180, 0, 0, 0, 0);
          ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
          ctx.drawImage(image, this.rect.x, this.rect.y, this.rect.width, this.rect.height, rect.x, rect.y, rect.width, rect.height);
          ctx.restore();
          break;

        case ImageClipRotation.Rotation270:
          ctx.save();
          mtx = new _base.Matrix2D().appendTransform(rect.width, 0, 1, 1, 90, 0, 0, 0, 0);
          ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
          ctx.drawImage(image, this.rect.x, this.rect.y, this.rect.width, this.rect.height, rect.x, rect.y, rect.height, rect.width);
          ctx.restore();
          break;
      }
    }
  }]);

  return ImageClip;
}();

exports.ImageClip = ImageClip;