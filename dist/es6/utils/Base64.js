function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A lookup table contains valid based64 characters.
 */
var STANDARD_ENCODE_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
/**
 * A class that can be used to encode Uint8Array to base64 string.
 */

export var Base64 = /*#__PURE__*/function () {
  function Base64() {
    _classCallCheck(this, Base64);
  }

  _createClass(Base64, null, [{
    key: "tripletToBase64",

    /**
     * Encodes a 4 bytes integer to a base64 string.
     * @param num an integer (4 bytes) to be encoded.
     * @returns a encoded base64 string.
     */
    value: function tripletToBase64(num) {
      return STANDARD_ENCODE_TABLE[num >> 18 & 0x3f] + STANDARD_ENCODE_TABLE[num >> 12 & 0x3f] + STANDARD_ENCODE_TABLE[num >> 6 & 0x3f] + STANDARD_ENCODE_TABLE[num & 0x3f];
    }
    /**
     * Given an array of Uint8Array object and current position, returns the current uint8 value and
     * move to next position.
     * @param dataArray An array of Uint8Array object.
     * @param index Current position, will be moved to next position after calling this function.
     * @returns The uint8 value of current position.
     */

  }, {
    key: "next",
    value: function next(dataArray, index) {
      if (dataArray[index.i].length > index.j) {
        return dataArray[index.i][index.j++];
      } else {
        // tslint:disable-next-line: no-empty
        while (dataArray[++index.i].length === 0) {}

        index.j = 1;
        return dataArray[index.i][0];
      }
    }
    /**
     * Encodes an array of Uint8Array to a base64 string, this function is usually used to encode
     * raw image content to a base64 string which can be used to as src of an image object.
     * @param dataArray An array of Uint8Array.
     * @returns A encoded based64 string.
     */

  }, {
    key: "encode",
    value: function encode(dataArray) {
      var sizes = [];
      var len = 0;

      var _iterator = _createForOfIteratorHelper(dataArray),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var data = _step.value;
          len += data.length;
          sizes.push({
            size: data.length,
            current: 0
          });
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var index = {
        i: 0,
        j: 0
      };
      var extraBytes = len % 3;
      var parts = [];
      var times = Math.floor(len / 3);

      for (var i = 0; i < times; ++i) {
        parts.push(this.tripletToBase64((this.next(dataArray, index) << 16 & 0xff0000) + (this.next(dataArray, index) << 8 & 0xff00) + (this.next(dataArray, index) & 0xff)));
      }

      if (extraBytes === 1) {
        var tmp = this.next(dataArray, index);
        parts.push(STANDARD_ENCODE_TABLE[tmp >> 2] + STANDARD_ENCODE_TABLE[tmp << 4 & 0x3f] + '==');
      } else if (extraBytes === 2) {
        var _tmp = (this.next(dataArray, index) << 8) + this.next(dataArray, index);

        parts.push(STANDARD_ENCODE_TABLE[_tmp >> 10] + STANDARD_ENCODE_TABLE[_tmp >> 4 & 0x3f] + STANDARD_ENCODE_TABLE[_tmp << 2 & 0x3f] + '=');
      }

      return parts.join('');
    }
  }]);

  return Base64;
}();