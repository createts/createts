function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

export var LineHeightType;

(function (LineHeightType) {
  LineHeightType[LineHeightType["NORMAL"] = 0] = "NORMAL";
  LineHeightType[LineHeightType["NUMBER"] = 1] = "NUMBER";
  LineHeightType[LineHeightType["LENGTH"] = 2] = "LENGTH";
  LineHeightType[LineHeightType["PERCENT"] = 3] = "PERCENT";
})(LineHeightType || (LineHeightType = {}));

var REG_NUMBER = /^([0-9]*\.?[0-9]*)$/;
var REG_LENGTH = /^([0-9]*\.?[0-9]*)px$/i;
var REG_PERCENT = /^([0-9]*\.?[0-9]*)%$/;
export var LineHeight =
/*#__PURE__*/
function () {
  _createClass(LineHeight, null, [{
    key: "of",
    value: function of(value) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      value = value.toLowerCase();

      if (value === 'normal') {
        return new LineHeight(LineHeightType.NORMAL, 0);
      } else if (REG_NUMBER.test(value)) {
        return new LineHeight(LineHeightType.NUMBER, parseFloat(value));
      } else if (REG_LENGTH.test(value)) {
        return new LineHeight(LineHeightType.LENGTH, parseFloat(value));
      } else if (REG_PERCENT.test(value)) {
        return new LineHeight(LineHeightType.PERCENT, parseFloat(value));
      }

      if (!silent) {
        console.warn("invalid line height:".concat(value));
      }

      return undefined;
    }
  }]);

  function LineHeight(type, value) {
    _classCallCheck(this, LineHeight);

    this.type = LineHeightType.NORMAL;
    this.value = 0;
    this.type = type;
    this.value = value;
  }

  _createClass(LineHeight, [{
    key: "getValue",
    value: function getValue(base) {
      switch (this.type) {
        case LineHeightType.NORMAL:
          return base * 1.2;

        case LineHeightType.NUMBER:
          return base * this.value;

        case LineHeightType.LENGTH:
          return this.value;

        case LineHeightType.PERCENT:
          return this.value * base / 100;
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      switch (this.type) {
        case LineHeightType.NORMAL:
          return 'normal';

        case LineHeightType.NUMBER:
          return this.value;

        case LineHeightType.LENGTH:
          return this.value + 'px';

        case LineHeightType.PERCENT:
          return this.value + '%';
      }
    }
  }, {
    key: "clone",
    value: function clone() {
      return new LineHeight(this.type, this.value);
    }
  }]);

  return LineHeight;
}();