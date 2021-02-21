function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { Matrix2D, Rect } from '../base';
import { ResourceRegistry } from './ResourceRegistry';
/**
 * Rotation types for an image clip, only 0/90/180/270 deg is supported.
 */

export var ImageClipRotation;

(function (ImageClipRotation) {
  ImageClipRotation[ImageClipRotation["Rotation0"] = 0] = "Rotation0";
  ImageClipRotation[ImageClipRotation["Rotation90"] = 90] = "Rotation90";
  ImageClipRotation[ImageClipRotation["Rotation180"] = 180] = "Rotation180";
  ImageClipRotation[ImageClipRotation["Rotation270"] = 270] = "Rotation270";
})(ImageClipRotation || (ImageClipRotation = {}));

var REG_IMAGE_CLIP = /^(.+)#([0-9\.]+),([0-9\.]+),([0-9\.]+),([0-9\.]+)@?(0|90|180|270)?$/;
export var ImageClip = /*#__PURE__*/function () {
  _createClass(ImageClip, null, [{
    key: "of",

    /**
     * Contruct an ImageClip instance from a string, the sytax is
     * ```
     * <image url>#<x>,<y>,<width>,<height>@<rotation>)
     * ```
     *
     * It can be used in Img type, i.e.
     * ```html
     * <img src='sample.png#10,20,200,300@270' />
     * <img src='sample.png#10,20,200,300' />
     * <img src='sample.png' />
     * ```
     * @param clip a encoded string presents an image clip.
     */
    value: function of(clip) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var matched = clip.match(REG_IMAGE_CLIP);

      if (!matched) {
        if (clip.indexOf('#') < 0) {
          return new ImageClip(clip);
        } else if (!silent) {
          console.warn("invalid image clip:".concat(clip));
        }

        return undefined;
      }

      return new ImageClip(matched[1], new Rect(parseFloat(matched[2]), parseFloat(matched[3]), parseFloat(matched[4]), parseFloat(matched[5])), matched[6] ? parseInt(matched[6]) : 0);
    }
  }]);

  function ImageClip(src, rect) {
    var rotation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ImageClipRotation.Rotation0;
    var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;

    _classCallCheck(this, ImageClip);

    this.src = void 0;
    this.image = void 0;
    this.rect = void 0;
    this.rotation = void 0;
    this.scale = 1;
    this.src = src;
    this.rect = rect;
    this.rotation = rotation;
    this.scale = scale;
  }

  _createClass(ImageClip, [{
    key: "ready",
    value: function ready() {
      return !!this.getImage();
    }
  }, {
    key: "getSrc",
    value: function getSrc() {
      return this.src;
    }
  }, {
    key: "setImage",
    value: function setImage(image) {
      this.image = image;
      return this;
    }
  }, {
    key: "setSrc",
    value: function setSrc(src) {
      this.src = src;
      return this;
    }
  }, {
    key: "getRect",
    value: function getRect() {
      return this.rect;
    }
  }, {
    key: "getRotation",
    value: function getRotation() {
      return this.rotation;
    }
  }, {
    key: "getScale",
    value: function getScale() {
      return this.scale;
    }
  }, {
    key: "setRect",
    value: function setRect(rect) {
      this.rect = rect;
      return this;
    }
  }, {
    key: "setRotation",
    value: function setRotation(rotation) {
      this.rotation = rotation;
      return this;
    }
  }, {
    key: "setScale",
    value: function setScale(scale) {
      this.scale = scale;
      return this;
    }
  }, {
    key: "getImage",
    value: function getImage() {
      return this.image ? this.image : ResourceRegistry.DefaultInstance.get(this.src);
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      if (!this.rect) {
        var image = this.getImage();
        return image ? (this.needChangeSize() ? image.height : image.width) * this.scale : 0;
      } else {
        return this.scale * (this.needChangeSize() ? this.rect.height : this.rect.width);
      }
    }
  }, {
    key: "needChangeSize",
    value: function needChangeSize() {
      return this.rotation === ImageClipRotation.Rotation90 || this.rotation === ImageClipRotation.Rotation270;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      if (!this.rect) {
        var image = this.getImage();
        return image ? (this.needChangeSize() ? image.width : image.height) * this.scale : 0;
      } else {
        return this.scale * (this.needChangeSize() ? this.rect.width : this.rect.height);
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx, rect, src) {
      var image = this.getImage();
      if (!image) return;
      var x = this.rect ? this.rect.x : 0;
      var y = this.rect ? this.rect.y : 0;
      var w = this.rect ? this.rect.width : image.width;
      var h = this.rect ? this.rect.height : image.height;

      if (src) {
        switch (this.rotation) {
          case ImageClipRotation.Rotation0:
            x += src.x;
            y += src.y;
            w = src.width;
            h = src.height;
            break;

          case ImageClipRotation.Rotation90:
            x += src.y;
            y += h - src.x - src.width;
            w = src.height;
            h = src.width;
            break;

          case ImageClipRotation.Rotation180:
            x += w - src.x - src.width;
            y += h - src.y - src.height;
            w = src.width;
            h = src.height;
            break;

          case ImageClipRotation.Rotation270:
            x += h - src.y - src.height;
            y += w - src.x - src.width;
            w = src.width;
            h = src.height;
            break;
        }
      }

      switch (this.rotation) {
        case ImageClipRotation.Rotation0:
          ctx.drawImage(image, x, y, w, h, rect.x, rect.y, rect.width, rect.height);
          break;

        case ImageClipRotation.Rotation90:
          ctx.save();
          var mtx = new Matrix2D().appendTransform(0, rect.height, 1, 1, 270, 0, 0, 0, 0);
          ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
          ctx.drawImage(image, x, y, w, h, rect.x, rect.y, rect.height, rect.width);
          ctx.restore();
          break;

        case ImageClipRotation.Rotation180:
          ctx.save();
          mtx = new Matrix2D().appendTransform(rect.width, rect.height, 1, 1, 180, 0, 0, 0, 0);
          ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
          ctx.drawImage(image, x, y, w, h, rect.x, rect.y, rect.width, rect.height);
          ctx.restore();
          break;

        case ImageClipRotation.Rotation270:
          ctx.save();
          mtx = new Matrix2D().appendTransform(rect.width, 0, 1, 1, 90, 0, 0, 0, 0);
          ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
          ctx.drawImage(image, x, y, w, h, rect.x, rect.y, rect.height, rect.width);
          ctx.restore();
          break;
      }
    }
  }, {
    key: "clone",
    value: function clone() {
      return new ImageClip(this.src, this.rect.clone(), this.rotation, this.scale).setImage(this.image);
    }
  }]);

  return ImageClip;
}();