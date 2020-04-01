"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApngParser = exports.ApngFrame = exports.ApngData = void 0;

var _Runtime = require("../runtime/Runtime");

var _Base = require("../utils/Base64");

var _CRC = require("../utils/CRC32");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApngData = function ApngData() {
  _classCallCheck(this, ApngData);

  this.width = void 0;
  this.height = void 0;
  this.duration = 0;
  this.numPlays = 0;
  this.frames = [];
};

exports.ApngData = ApngData;

var ApngFrame = function ApngFrame() {
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


exports.ApngFrame = ApngFrame;
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

var ApngParser = /*#__PURE__*/function () {
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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = chunks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (apng.frames.length === 0) {
        if (!silent) {
          console.warn('not a png file');
        }

        return undefined;
      } // Generates the static frames.


      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = apng.frames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var frm = _step2.value;
          var imageData = [];
          imageData.push(PNG_SIGNATURE); // Update the static frame size.

          headerDataBytes.set(toDWordArray(frm.width), 0);
          headerDataBytes.set(toDWordArray(frm.height), 4);
          imageData.push(this.makeChunk(IHDR, headerDataBytes));
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = preDataParts[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var part = _step3.value;
              imageData.push(part);
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                _iterator3["return"]();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = frm.dataParts[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var _part = _step4.value;
              imageData.push(_part);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                _iterator4["return"]();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }

          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = postDataParts[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var _part2 = _step5.value;
              imageData.push(_part2);
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
                _iterator5["return"]();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }

          delete frm.dataParts;

          switch (_Runtime.Runtime.getRuntimeType()) {
            case _Runtime.RuntimeType.WECHAT_MINI_GAME:
              {
                frm.image = _Runtime.Runtime.get().newImage();

                var url = 'data:image/png;base64,' + _Base.Base64.encode(imageData);

                frm.image.src = url;
              }
              break;

            case _Runtime.RuntimeType.WEBPAGE:
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
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
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

      var crc = _CRC.CRC32.calculate(bytes, 4, data.length + 4);

      dataView.setUint32(data.length + 8, crc);
      return bytes;
    }
  }]);

  return ApngParser;
}();

exports.ApngParser = ApngParser;