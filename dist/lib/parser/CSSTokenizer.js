"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CSSTokenizer = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var State;
/**
 * This class provides an util function to tokenize a string to a list of token (string).
 */

(function (State) {
  State[State["START"] = 0] = "START";
  State[State["VALUE"] = 1] = "VALUE";
  State[State["FUNC"] = 2] = "FUNC";
})(State || (State = {}));

var CSSTokenizer = /*#__PURE__*/function () {
  function CSSTokenizer() {
    var stopLetters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, CSSTokenizer);

    this.stopLetters = '';
    this.stopLetters = stopLetters;
  }
  /**
   * Checks whether a character is blank.
   * @param ch the character to be checked.
   * @returns true if the character is one of ' ', '\t', '\r', '\n'; false otherwise.
   */


  _createClass(CSSTokenizer, [{
    key: "isSplitter",
    value: function isSplitter(ch) {
      return ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n';
    }
    /**
     * Checks whether a character is stop latter.
     * @param ch the character to be checked.
     * @returns true if the character is one of stop letters; false otherwise.
     */

  }, {
    key: "isStopLetter",
    value: function isStopLetter(ch) {
      return this.stopLetters && this.stopLetters.indexOf(ch) >= 0;
    }
    /**
     * Convert the input string to a Func object.
     * @param content the input string.
     * @param [silent] if true, ignore warning for an invalid value.
     * @returns a Func object for valid content, undefined otherwise.
     */

  }, {
    key: "tokenize",
    value: function tokenize(content) {
      var len = content.length;
      var result = [];
      var state = State.START;
      var tokenQuota = '';
      var start = 0;

      for (var i = 0; i < len; ++i) {
        var ch = content[i];

        switch (state) {
          case State.START:
            if (this.isStopLetter(ch)) {
              result.push(ch);
            } else if (!this.isSplitter(ch)) {
              start = i;
              state = State.VALUE;

              if (ch === "'" || ch === '"') {
                tokenQuota = ch;
              } else {
                tokenQuota = '';
              }
            }

            break;

          case State.VALUE:
            if (tokenQuota !== '') {
              if (ch === tokenQuota) {
                state = State.START;
                result.push(content.substring(start + 1, i));
              }
            } else if (ch === '(') {
              state = State.FUNC;
            } else if (this.isSplitter(ch)) {
              state = State.START;
              result.push(content.substring(start, i));
            } else if (this.isStopLetter(ch)) {
              state = State.START;
              result.push(content.substring(start, i));
              result.push(ch);
            }

            break;

          case State.FUNC:
            if (ch === ')') {
              state = State.START;
              result.push(content.substring(start, i + 1));
            }

            break;
        }
      }

      if (state !== State.START) {
        if (tokenQuota === '') {
          result.push(content.substring(start));
        } else {
          result.push(content.substring(start + 1));
        }
      }

      return result;
    }
  }]);

  return CSSTokenizer;
}();

exports.CSSTokenizer = CSSTokenizer;