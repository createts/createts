"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContainerUtils = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ContainerUtils = /*#__PURE__*/function () {
  function ContainerUtils() {
    _classCallCheck(this, ContainerUtils);
  }
  /**
   * Checks a map is empty.
   * @param map a map to be checked.
   * @returns True if the map is undefined or empty.
   */


  _createClass(ContainerUtils, null, [{
    key: "isEmpty",
    value: function isEmpty(map) {
      if (!map) return true;

      for (var _key in map) {
        if (map.hasOwnProperty(_key)) return false;
      }

      return true;
    }
  }]);

  return ContainerUtils;
}();

exports.ContainerUtils = ContainerUtils;