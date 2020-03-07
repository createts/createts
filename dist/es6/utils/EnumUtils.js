function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A class contains static enum util methods.
 *
 * Code example:
 *
 * ```typescript
 * enum TestEnum {
 *   V1 = 'v1',
 *   V2 = 'v2'
 * }
 * EnumUtils.fromString(TestEnum, 'v1', TestEnum.V2);  // TestEnum.v1
 * EnumUtils.fromString(TestEnum, 'v', TestEnum.V2);  // TestEnum.v2
 * EnumUtils.fromStringOrUndefined(TestEnum, 'v');  // undefined
 * ```
 */
export var EnumUtils =
/*#__PURE__*/
function () {
  /**
   * Prevent creating instance.
   */
  function EnumUtils() {
    _classCallCheck(this, EnumUtils);
  }
  /**
   * Convert a string to an enum value of a give type.
   * @param enumtype an enum type.
   * @param value the string converted from.
   * @param defaultValue if the string is not defined in this enum, return this as default value.
   * @returns an enum value convert from the string or default value if string is not defined in this enum.
   */


  _createClass(EnumUtils, null, [{
    key: "fromString",
    value: function fromString(enumtype, value, defaultValue) {
      for (var name in enumtype) {
        if (enumtype[name] === value) {
          return value;
        }
      }

      return defaultValue;
    }
    /**
     * Convert a string to an enum value of a give type.
     * @param enumtype an enum type.
     * @param value the string converted from.
     * @returns an enum value convert from the string or undefined if string is not defined in this enum.
     */

  }, {
    key: "fromStringOrUndefined",
    value: function fromStringOrUndefined(enumtype, value) {
      for (var name in enumtype) {
        if (enumtype[name] === value) {
          return value;
        }
      }

      return undefined;
    }
  }]);

  return EnumUtils;
}();