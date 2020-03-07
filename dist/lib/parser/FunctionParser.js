"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunctionParser = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var State;
/**
 * This class provides an util function to parse a string to a Func object.
 */

(function (State) {
  State[State["NAME_START"] = 0] = "NAME_START";
  State[State["NAME"] = 1] = "NAME";
  State[State["NAME_END"] = 2] = "NAME_END";
  State[State["PARAMETER_START"] = 3] = "PARAMETER_START";
  State[State["PARAMETER"] = 4] = "PARAMETER";
  State[State["PARAMETER_END"] = 5] = "PARAMETER_END";
  State[State["END"] = 6] = "END";
})(State || (State = {}));

var FunctionParser =
/*#__PURE__*/
function () {
  function FunctionParser() {
    _classCallCheck(this, FunctionParser);
  }

  _createClass(FunctionParser, null, [{
    key: "isBlank",

    /**
     * Checks whether a character is blank.
     * @param ch the character to be checked.
     * @returns true if the character is one of ' ', '\t', '\r', '\n'; false otherwise.
     */
    value: function isBlank(ch) {
      return ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n';
    }
    /**
     * Convert the input string to a Func object.
     * @param content the input string.
     * @param [silent] if ture, ignore warning for an invalid value.
     * @returns a Func object for valid content, undefined otherwise.
     */

  }, {
    key: "parse",
    value: function parse(content) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var func = {
        name: undefined,
        arguments: []
      };
      var state = State.NAME_START;
      var parameterQuota = '';
      var start = 0;
      var len = content.length;
      var i = 0;

      for (; i < len; ++i) {
        var ch = content[i];

        switch (state) {
          case State.NAME_START:
            if (!this.isBlank(ch)) {
              start = i;
              state = State.NAME;
            }

            break;

          case State.NAME:
            if (this.isBlank(ch) || ch === ')') {
              if (!silent) {
                console.warn('invalid function:' + content);
              }

              return undefined;
            } else if (ch === '(') {
              func.name = content.substring(start, i);
              state = ch === '(' ? State.PARAMETER_START : State.NAME_END;
            }

            break;

          case State.NAME_END:
            if (ch === '(') {
              state = State.PARAMETER_START;
              break;
            } else if (!this.isBlank(ch)) {
              if (!silent) {
                console.warn('invalid function:' + content);
              }

              return undefined;
            }

          case State.PARAMETER_START:
            if (this.isBlank(ch)) {
              break;
            } else if (ch === '"' || ch === "'") {
              state = State.PARAMETER;
              start = i + 1;
              parameterQuota = ch;
            } else if (ch === ')') {
              state = State.END;
            } else if (ch === ',') {
              if (!silent) {
                console.warn('invalid function:' + content);
              }

              return undefined;
            } else {
              state = State.PARAMETER;
              start = i;
              parameterQuota = '';
            }

            break;

          case State.PARAMETER:
            if (parameterQuota !== '') {
              if (parameterQuota === ch) {
                state = State.PARAMETER_END;
                func.arguments.push(content.substring(start, i));
                parameterQuota = '';
              }
            } else {
              if (this.isBlank(ch)) {
                state = State.PARAMETER_END;
                func.arguments.push(content.substring(start, i));
                parameterQuota = '';
              } else if (ch === ',') {
                state = State.PARAMETER_START;
                func.arguments.push(content.substring(start, i));
                parameterQuota = '';
              } else if (ch === ')') {
                state = State.END;
                func.arguments.push(content.substring(start, i));
                parameterQuota = '';
              }
            }

            break;

          case State.PARAMETER_END:
            if (this.isBlank(ch)) {
              break;
            } else if (ch === ',') {
              state = State.PARAMETER_START;
            } else if (ch === ')') {
              state = State.END;
            }

            break;

          case State.END:
            if (!this.isBlank(ch)) {
              if (!silent) {
                console.warn('invalid function:' + content);
              }

              return undefined;
            }

            break;
        }
      }

      if (state !== State.END) {
        if (!silent) {
          console.warn('invalid function:' + content);
        }

        return undefined;
      }

      return func;
    }
  }]);

  return FunctionParser;
}();

exports.FunctionParser = FunctionParser;