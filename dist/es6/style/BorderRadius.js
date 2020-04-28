function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { BaseValue } from '../base/BaseValue';
/**
 * This class represents an immutable border object contains width, style and color.
 */

export var BorderRadius = /*#__PURE__*/function () {
  _createClass(BorderRadius, null, [{
    key: "of",

    /**
     * Convert a string to a BorderRadius object.
     * @param value a string present border, the format is [first value] [second value], and second
     * value is optional.
     * @param [silent] if true, ignore warning for an invalid value.
     * @returns A BorderRadius object for valid value, otherwise returns undefined.
     */
    value: function of(value) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (typeof value === 'number') {
        return new BorderRadius(BaseValue.of(value));
      } else {
        var pieces = value.split(/\s+/);

        var _value;

        var value2;

        if (pieces.length === 1) {
          _value = value2 = BaseValue.of(pieces[0]);
        } else if (pieces.length === 2) {
          _value = BaseValue.of(pieces[0]);
          value2 = BaseValue.of(pieces[1]);
        }

        if (_value && value2) {
          return new BorderRadius(_value, value2);
        } else {
          if (!silent) {
            console.warn("invalid border:".concat(value));
          }

          return undefined;
        }
      }
    }
  }]);

  /**
   * Constructs and initializes a BorderRadius object with given arguments of values.
   * @param value1 the first value.
   * @param value2 the second value.
   */
  function BorderRadius(value1) {
    var value2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : value1;

    _classCallCheck(this, BorderRadius);

    this.value1 = void 0;
    this.value2 = void 0;
    this.value1 = value1;
    this.value2 = value2;
  }
  /**
   * Returns a string representation of this BorderRadius object.
   * @returns a string representation of this object.
   */


  _createClass(BorderRadius, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.value1.toString(), " ").concat(this.value2.toString());
    }
    /**
     * Creates a new BorderRadius with the same values as this object.
     * @returns a clone of this instance.
     */

  }, {
    key: "clone",
    value: function clone() {
      return new BorderRadius(this.value1, this.value2);
    }
  }, {
    key: "update",
    value: function update(target, progress) {
      return new BorderRadius(this.value1.update(target.value1, progress), this.value2.update(target.value2, progress));
    }
  }, {
    key: "convertFrom",
    value: function convertFrom(src) {
      var result = BorderRadius.of(src + '');

      if (result === undefined) {
        return new BorderRadius(BaseValue.ZERO, BaseValue.ZERO);
      } else {
        return result;
      }
    }
  }, {
    key: "isAnimatable",
    value: function isAnimatable() {
      return true;
    }
  }]);

  return BorderRadius;
}();