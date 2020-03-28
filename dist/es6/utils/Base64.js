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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = dataArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var data = _step.value;
          len += data.length;
          sizes.push({
            size: data.length,
            current: 0
          });
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