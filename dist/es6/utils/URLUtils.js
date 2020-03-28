function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A class contains static url util methods.
 */
export var URLUtils = /*#__PURE__*/function () {
  /**
   * Prevent creating instance.
   */
  function URLUtils() {
    _classCallCheck(this, URLUtils);
  }
  /**
   * Checks an url is absolute url or not.
   * @param url an url to be checked.
   */


  _createClass(URLUtils, null, [{
    key: "isAbsolute",
    value: function isAbsolute(url) {
      return url.indexOf('://') > 0 || url.startsWith('//');
    }
  }]);

  return URLUtils;
}();