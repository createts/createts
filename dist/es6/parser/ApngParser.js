function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { Runtime, RuntimeType } from '../runtime/Runtime';
import { Base64 } from '../utils/Base64';
import { CRC32 } from '../utils/CRC32';
export var ApngData = function ApngData() {
  _classCallCheck(this, ApngData);

  this.width = void 0;
  this.height = void 0;
  this.duration = 0;
  this.numPlays = 0;
  this.frames = [];
};
export var ApngFrame = function ApngFrame() {
  _classCallCheck(this, ApngFrame);

  this.left = 0;
  this.top = 0;
  this.width = 0;
  this.height = 0;
  this.delay = 0;
  this.disposeOp = 0;
  this.blendOp = 0;
  this.dataParts = [];
  this.image = void 0;
}; // '\x89PNG\x0d\x0a\x1a\x0a'

var PNG_SIGNATURE = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function toUint32(data) {
  return data.charCodeAt(0) << 24 | data.charCodeAt(1) << 16 | data.charCodeAt(2) << 8 | data.charCodeAt(3);
}

function toDWordArray(x) {
  return [x >>> 24 & 0xff, x >>> 16 & 0xff, x >>> 8 & 0xff, x & 0xff];
}

var IHDR = toUint32('IHDR');
var acTL = toUint32('acTL');
var IDAT = toUint32('IDAT');
var fcTL = toUint32('fcTL');
var fdAT = toUint32('fdAT');
var IEND = toUint32('IEND');
export var ApngParser = /*#__PURE__*/function () {
  function ApngParser() {
    _classCallCheck(this, ApngParser);
  }

  _createClass(ApngParser, null, [{
    key: "parse",
    value: function parse(buffer) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var bytes = new Uint8Array(buffer); // Check signature.

      for (var i = 0; i < PNG_SIGNATURE.length; ++i) {
        if (PNG_SIGNATURE[i] !== bytes[i]) {
          if (!silent) {
            console.warn('not a png file');
          }

          return undefined;
        }
      }

      var chunks = this.toChunks(bytes);
      var preDataParts = [];
      var postDataParts = [];
      var headerDataBytes = null;
      var frame = null;
      var apng = new ApngData();
      var dataView = new DataView(bytes.buffer);

      var _iterator = _createForOfIteratorHelper(chunks),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var chunk = _step.value;

          switch (chunk.type) {
            case IHDR:
              headerDataBytes = bytes.subarray(chunk.start + 8, chunk.end - 4);
              apng.width = dataView.getUint32(chunk.start + 8);
              apng.height = dataView.getUint32(chunk.start + 8 + 4);
              break;

            case acTL:
              apng.numPlays = dataView.getUint32(chunk.start + 8);
              break;

            case fcTL:
              frame = new ApngFrame();
              apng.frames.push(frame);
              frame.width = dataView.getUint32(chunk.start + 8 + 4);
              frame.height = dataView.getUint32(chunk.start + 8 + 8);
              frame.left = dataView.getUint32(chunk.start + 8 + 12);
              frame.top = dataView.getUint32(chunk.start + 8 + 16);
              var delayN = dataView.getUint16(chunk.start + 8 + 20);
              var delayD = dataView.getUint16(chunk.start + 8 + 22);

              if (delayD === 0) {
                delayD = 100;
              }

              frame.delay = 1000 * delayN / delayD;

              if (frame.delay <= 10) {
                frame.delay = 100;
              }

              apng.duration += frame.delay;
              frame.disposeOp = dataView.getUint8(chunk.start + 8 + 24);
              frame.blendOp = dataView.getUint8(chunk.start + 8 + 25);
              frame.dataParts = [];

              if (apng.frames.length === 1 && frame.disposeOp === 2) {
                frame.disposeOp = 1;
              }

              break;

            case fdAT:
              if (frame) {
                // This is an animation frame, the first 4 byte of the data contains metadata which is
                // not required for a static frame, delete it.
                frame.dataParts.push(this.makeChunk(IDAT, bytes.subarray(chunk.start + 12, chunk.end - 4)));
              } else if (!silent) {
                console.warn('invalid fdAT chunk before frame');
              }

              break;

            case IDAT:
              // This a normal PNG data frame.
              if (frame) {
                frame.dataParts.push(this.makeChunk(IDAT, bytes.subarray(chunk.start + 8, chunk.end - 4)));
              } else if (!silent) {
                console.warn('invalid IDAT chunk before frame');
              }

              break;

            case IEND:
              postDataParts.push(bytes.subarray(chunk.start, chunk.end));
              break;

            default:
              preDataParts.push(bytes.subarray(chunk.start, chunk.end));
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (apng.frames.length === 0) {
        if (!silent) {
          console.warn('not a png file');
        }

        return undefined;
      } // Generates the static frames.


      var _iterator2 = _createForOfIteratorHelper(apng.frames),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var frm = _step2.value;
          var imageData = [];
          imageData.push(PNG_SIGNATURE); // Update the static frame size.

          headerDataBytes.set(toDWordArray(frm.width), 0);
          headerDataBytes.set(toDWordArray(frm.height), 4);
          imageData.push(this.makeChunk(IHDR, headerDataBytes));

          var _iterator3 = _createForOfIteratorHelper(preDataParts),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var part = _step3.value;
              imageData.push(part);
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          var _iterator4 = _createForOfIteratorHelper(frm.dataParts),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var _part = _step4.value;
              imageData.push(_part);
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }

          var _iterator5 = _createForOfIteratorHelper(postDataParts),
              _step5;

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var _part2 = _step5.value;
              imageData.push(_part2);
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }

          delete frm.dataParts;

          switch (Runtime.getRuntimeType()) {
            case RuntimeType.WECHAT_MINI_GAME:
              {
                frm.image = Runtime.get().newImage();
                var url = 'data:image/png;base64,' + Base64.encode(imageData);
                frm.image.src = url;
              }
              break;

            case RuntimeType.WEBPAGE:
              {
                (function () {
                  var url = URL.createObjectURL(new Blob(imageData, {
                    type: 'image/png'
                  }));
                  var image = new Image();
                  frm.image = image;
                  image.src = url;

                  image.onload = function () {
                    URL.revokeObjectURL(url);
                  };

                  image.onerror = function (e) {
                    URL.revokeObjectURL(url);
                  };
                })();
              }
              break;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return apng;
    }
  }, {
    key: "toChunks",
    value: function toChunks(bytes) {
      var chunks = [];
      var dataView = new DataView(bytes.buffer);
      var position = 8; // Skip the signature in header.
      // A valid chunk should be >= 12 bytes.

      while (position <= bytes.length - 12) {
        // First 4 bytes present chunk length.
        var length = dataView.getUint32(position);

        if (length < 0 || position + 12 + length > bytes.length) {
          console.warn('invalid chunk length, position=' + position + ' length=' + length + ' total=' + bytes.length);
          return undefined;
        } // Next 4 bytes present chunk type.


        var type = dataView.getUint32(position + 4);
        chunks.push({
          type: type,
          start: position,
          end: position + length + 12
        }); // The tail 4 bytes present CRC digest, ignore it.
        // TODO: validate it.

        position += 12 + length;

        if (type === IEND) {
          break;
        }
      }

      return chunks;
    }
  }, {
    key: "makeChunk",
    value: function makeChunk(type, data) {
      var bytes = new Uint8Array(data.length + 12);
      var dataView = new DataView(bytes.buffer);
      dataView.setUint32(0, data.length);
      dataView.setUint32(4, type);
      bytes.set(data, 8);
      var crc = CRC32.calculate(bytes, 4, data.length + 4);
      dataView.setUint32(data.length + 8, crc);
      return bytes;
    }
  }]);

  return ApngParser;
}();