function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { BaseValue } from '../base/BaseValue';
/**
 * A class contains static style util methods.
 */

export var StyleUtils = /*#__PURE__*/function () {
  function StyleUtils() {
    _classCallCheck(this, StyleUtils);
  }

  _createClass(StyleUtils, null, [{
    key: "parse4Dirs",
    value: function parse4Dirs(value) {
      var pieces = value.trim().split(/\s+/);

      if (pieces.length === 1) {
        return [BaseValue.of(pieces[0]), BaseValue.of(pieces[0]), BaseValue.of(pieces[0]), BaseValue.of(pieces[0])];
      } else if (pieces.length === 2) {
        return [BaseValue.of(pieces[0]), BaseValue.of(pieces[1]), BaseValue.of(pieces[0]), BaseValue.of(pieces[1])];
      } else if (pieces.length === 3) {
        return [BaseValue.of(pieces[0]), BaseValue.of(pieces[1]), BaseValue.of(pieces[2]), BaseValue.of(pieces[1])];
      } else if (pieces.length === 4) {
        return [BaseValue.of(pieces[0]), BaseValue.of(pieces[1]), BaseValue.of(pieces[2]), BaseValue.of(pieces[3])];
      } else {
        return undefined;
      }
    }
  }]);

  return StyleUtils;
}();