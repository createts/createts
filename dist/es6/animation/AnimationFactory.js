function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { Animation, AnimationState } from './Animation';
export var AnimationFactory =
/*#__PURE__*/
function () {
  function AnimationFactory() {
    _classCallCheck(this, AnimationFactory);

    this.animations = [];
  }

  _createClass(AnimationFactory, [{
    key: "create",
    value: function create(target, override) {
      if (override) {
        this.removeByTarget(target);
      }

      var animation = new Animation(target);
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

          if (animation.target === target && animation.state === AnimationState.RUNNING) {
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
    key: "onInterval",
    value: function onInterval() {
      var size = this.animations.length;

      for (var i = 0; i < size; ++i) {
        this.animations[i].onInterval();
      }

      for (var _i = this.animations.length - 1; _i >= 0; --_i) {
        var animation = this.animations[_i];

        if (animation.state === AnimationState.COMPLETED || animation.state === AnimationState.CANCELLED) {
          this.animations.splice(_i, 1);
        }
      }
    }
  }]);

  return AnimationFactory;
}();