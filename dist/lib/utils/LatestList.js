"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LatestList = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A LatestList class contains the latest N added elements.
 */
var LatestList = /*#__PURE__*/function () {
  /**
   * Construct a LatestList object capacity.
   * @param capacity The capacity of this list.
   */
  function LatestList() {
    var capacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

    _classCallCheck(this, LatestList);

    this.capacity = void 0;
    this.elements = [];
    this.capacity = capacity;
  }
  /**
   * Adds an element to this list, drop the oldest one if size of this.elements is more than
   * this.capacity after adding.
   * @param element The element to be added.
   * @returns The current instance. Useful for chaining method calls.
   */


  _createClass(LatestList, [{
    key: "add",
    value: function add(element) {
      while (this.elements.length >= this.capacity) {
        this.elements.shift();
      }

      this.elements.push(element);
      return this;
    }
  }]);

  return LatestList;
}();

exports.LatestList = LatestList;