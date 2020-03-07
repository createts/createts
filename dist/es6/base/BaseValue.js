function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

export var BaseValueUnit;
/**
 * This class represents an immutable value object contains a number value and unit.
 *
 * There are 2 types of units:
 * 1. PX: absolute value.
 * 1. PERCENTAGE: the percentage of parent value.
 */

(function (BaseValueUnit) {
  BaseValueUnit[BaseValueUnit["PX"] = 1] = "PX";
  BaseValueUnit[BaseValueUnit["PERCENTAGE"] = 2] = "PERCENTAGE";
})(BaseValueUnit || (BaseValueUnit = {}));

export var BaseValue =
/*#__PURE__*/
function () {
  _createClass(BaseValue, null, [{
    key: "of",

    /**
     * Convert a string to a BaseValue object.
     * @param value if it is a string value and ends with '%', parse it as a percentage value, otherwise parse it as a absolute value.
     * @returns A BaseValue object for valid value, otherwise returns undefined.
     */
    value: function of(value) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (typeof value === 'string') {
        var num = parseFloat(value);

        if (isNaN(num)) {
          if (!silent) {
            console.warn('invalid value:' + value);
          }

          return undefined;
        }

        if (value.endsWith('%')) {
          return new BaseValue(num, BaseValueUnit.PERCENTAGE);
        } else {
          return new BaseValue(num, BaseValueUnit.PX);
        }
      } else {
        return new BaseValue(value, BaseValueUnit.PX);
      }
    }
    /**
     * The number part of this object.
     */

  }]);

  /**
   * Constructs a new BaseValue object whose value and unit are specified by the arguments of the same name.
   * @param value the specified number value
   * @param unit the specified unit
   */
  function BaseValue(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : BaseValueUnit.PX;

    _classCallCheck(this, BaseValue);

    this.numberValue = 0;
    this.unit = void 0;
    this.unit = unit;
    this.numberValue = value;
  }
  /**
   * Calculate the absolute value by the arguments.
   * @param base the base value for percentage unit.
   * @returns current object's number value if the unit is absolute, or base * number / 100 for percentage unit.
   */


  _createClass(BaseValue, [{
    key: "getValue",
    value: function getValue(base) {
      switch (this.unit) {
        case BaseValueUnit.PERCENTAGE:
          return this.numberValue * base / 100;

        case BaseValueUnit.PX:
          return this.numberValue;
      }
    }
    /**
     * Creates a new BaseValue object with absolute unit by current object and a specified base value.
     * @param base the base value for percentage unit.
     * @returns a new BaseValue object with absolute unit.
     */

  }, {
    key: "toAbsolute",
    value: function toAbsolute(base) {
      switch (this.unit) {
        case BaseValueUnit.PERCENTAGE:
          return new BaseValue(this.numberValue * base / 100, BaseValueUnit.PX);

        case BaseValueUnit.PX:
          return this;
      }
    }
    /**
     * Creates a new BaseValue object with percentage unit by current object and a specified base value.
     * @param base the base value for percentage unit.
     * @returns a new BaseValue object with percentage unit.
     */

  }, {
    key: "toPercentage",
    value: function toPercentage(base) {
      switch (this.unit) {
        case BaseValueUnit.PX:
          return new BaseValue(this.numberValue / base * 100, BaseValueUnit.PERCENTAGE);

        case BaseValueUnit.PERCENTAGE:
          return this;
      }
    }
    /**
     * Returns a string representation of this BaseValue object.
     * @returns a string representation of this object
     */

  }, {
    key: "toString",
    value: function toString() {
      switch (this.unit) {
        case BaseValueUnit.PERCENTAGE:
          return this.numberValue + '%';

        case BaseValueUnit.PX:
          return this.numberValue + '';
      }
    }
    /**
     * Checks whether two BaseValue objects are equal.
     * The result is true if and only if the argument is a BaseValue object that has the same number value and unit as this Rect.
     * @param that the Object to compare with this BaseValue object.
     * @returns true if the objects are equal; false otherwise.
     */

  }, {
    key: "equals",
    value: function equals(that) {
      return this.numberValue === that.numberValue && this.unit === this.unit;
    }
    /**
     * Creates a new Rect with the same upper-left corner, width, and height as this object.
     * @returns a clone of this instance.
     */

  }, {
    key: "clone",
    value: function clone() {
      return new BaseValue(this.numberValue, this.unit);
    }
  }]);

  return BaseValue;
}();