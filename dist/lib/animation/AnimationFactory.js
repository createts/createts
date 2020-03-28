"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimationFactory = void 0;

var _Event = require("../base/Event");

var _Animation = require("./Animation");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AnimationFactory = /*#__PURE__*/function (_EventDispatcher) {
  _inherits(AnimationFactory, _EventDispatcher);

  function AnimationFactory() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, AnimationFactory);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AnimationFactory)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.animations = [];
    return _this;
  }

  _createClass(AnimationFactory, [{
    key: "create",
    value: function create(target, override) {
      if (override) {
        this.removeByTarget(target);
      }

      var animation = new _Animation.Animation(target);
      this.animations.push(animation);
      return animation;
    }
  }, {
    key: "removeByTarget",
    value: function removeByTarget(target) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.animations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var animation = _step.value;

          if (animation.target === target && animation.state === _Animation.AnimationState.RUNNING) {
            animation.cancel();
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.animations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var animation = _step2.value;
          animation.cancel();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "onInterval",
    value: function onInterval() {
      var size = this.animations.length;

      if (size === 0) {
        return false;
      }

      var updated = false;

      for (var i = 0; i < size; ++i) {
        if (this.animations[i].onInterval()) {
          updated = true;
        }
      }

      if (updated) {
        this.dispatchEvent(new _Event.Event('update', false, true));
      }

      for (var _i = this.animations.length - 1; _i >= 0; --_i) {
        var animation = this.animations[_i];

        if (animation.state === _Animation.AnimationState.COMPLETED || animation.state === _Animation.AnimationState.CANCELLED) {
          this.animations.splice(_i, 1);
        }
      }

      return updated;
    }
  }]);

  return AnimationFactory;
}(_Event.EventDispatcher);

exports.AnimationFactory = AnimationFactory;