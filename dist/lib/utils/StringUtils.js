"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringUtils = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A class contains static string util methods.
 */
var StringUtils = /*#__PURE__*/function () {
  /**
   * Prevent creating instance.
   */
  function StringUtils() {
    _classCallCheck(this, StringUtils);
  }
  /**
   * Returns an list of all results matching a string against a regular expression, including capturing groups.
   * @param str string used to be matched.
   * @param regex Regular expression used to match the input string.
   * @returns list of matched results.
   */


  _createClass(StringUtils, null, [{
    key: "matchAll",
    value: function matchAll(str, regex) {
      var result = [];
      var localCopy = new RegExp(regex, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
      var match = localCopy.exec(str);

      while (match) {
        result.push(match);
        match = localCopy.exec(str);
      }

      return result;
    }
  }]);

  return StringUtils;
}();

exports.StringUtils = StringUtils;