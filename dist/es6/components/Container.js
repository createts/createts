function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import { Display, Position, TextAlign } from '../style/Style';
import { LayoutUtils } from '../utils/LayoutUtils';
import { TouchEvent, XObject } from './XObject';
export var Container =
/*#__PURE__*/
function (_XObject) {
  _inherits(Container, _XObject);

  function Container(opt) {
    var _this;

    _classCallCheck(this, Container);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Container).call(this, opt));
    _this.children = [];
    return _this;
  }

  _createClass(Container, [{
    key: "findById",
    value: function findById(id) {
      if (this.id === id) {
        return this;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var child = _step.value;

          if (child.id === id) {
            return child;
          }

          if (child instanceof Container) {
            var find = child.findById(id);

            if (find) {
              return find;
            }
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

      return undefined;
    }
  }, {
    key: "drawContent",
    value: function drawContent(ctx) {
      var list = this.children.slice();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var child = _step2.value;

          if (!child.isVisible()) {
            continue;
          }

          ctx.save();
          child.updateContext(ctx);
          child.draw(ctx);
          ctx.restore();
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
    key: "addChild",
    value: function addChild(child) {
      var parent = child.parent;

      if (parent === this) {
        if (this.children.length > 0 && this.children[this.children.length - 1] === child) {
          return this;
        }

        var idx = this.children.indexOf(child);
        this.children.splice(idx, 1);
        this.children.push(child);
        child.dispatchEvent(new TouchEvent(child, 'moved', false));
        return this;
      } else {
        if (parent) {
          parent.removeChild(child);
        }

        child.parent = this;
        this.children.push(child);
        child.dispatchEvent(new TouchEvent(child, 'added', false));
        return this;
      }
    }
  }, {
    key: "addChildren",
    value: function addChildren() {
      for (var _len = arguments.length, children = new Array(_len), _key = 0; _key < _len; _key++) {
        children[_key] = arguments[_key];
      }

      for (var _i = 0, _children = children; _i < _children.length; _i++) {
        var child = _children[_i];
        this.addChild(child);
      }

      return this;
    }
  }, {
    key: "addChildAt",
    value: function addChildAt(child, index) {
      var parent = child.parent;

      if (parent === this) {
        if (this.children[index] === child) {
          return this;
        }

        var current = this.children.indexOf(child);

        if (current > index) {
          this.children.splice(current, 1);
          this.children.splice(index, 0, child);
        } else {
          this.children.splice(index, 0, child);
          this.children.splice(current, 1);
        }

        child.dispatchEvent(new TouchEvent(child, 'moved', false));
        return this;
      } else {
        if (parent) {
          parent.removeChild(child);
        }

        child.parent = this;
        this.children.splice(index, 0, child);
        child.dispatchEvent(new TouchEvent(child, 'added', false));
        return this;
      }
    }
  }, {
    key: "removeChild",
    value: function removeChild(child) {
      var idx = this.children.indexOf(child);

      if (idx < 0) {
        return null;
      } else {
        this.children.splice(idx, 1);
        child.parent = undefined;
        child.dispatchEvent(new TouchEvent(child, 'removed', false));
        return child;
      }
    }
  }, {
    key: "removeChildAt",
    value: function removeChildAt(index) {
      if (index < 0 || index >= this.children.length) {
        return null;
      }

      var child = this.children[index];
      this.children.splice(index, 1);
      child.dispatchEvent(new TouchEvent(child, 'removed', false));
      return child;
    }
  }, {
    key: "removeAllChildren",
    value: function removeAllChildren() {
      while (this.children.length > 0) {
        this.removeChildAt(0);
      }

      return this;
    }
  }, {
    key: "getChildAt",
    value: function getChildAt(index) {
      return this.children[index];
    }
  }, {
    key: "sortChildren",
    value: function sortChildren(sortFunction) {
      this.children.sort(sortFunction);
      return this;
    }
  }, {
    key: "getChildIndex",
    value: function getChildIndex(child) {
      return this.children.indexOf(child);
    }
  }, {
    key: "swapChildrenAt",
    value: function swapChildrenAt(index1, index2) {
      if (index1 < 0 || index1 >= this.children.length) {
        throw new Error('invalid index:' + index1);
      }

      if (index2 < 0 || index2 >= this.children.length) {
        throw new Error('invalid index:' + index2);
      }

      if (index1 === index2) {
        return this;
      }

      var o1 = this.children[index1];
      var o2 = this.children[index2];
      this.children[index1] = o2;
      this.children[index2] = o1;
      o1.dispatchEvent(new TouchEvent(o1, 'moved', false));
      o2.dispatchEvent(new TouchEvent(o2, 'moved', false));
      return this;
    }
  }, {
    key: "swapChildren",
    value: function swapChildren(child1, child2) {
      return this.swapChildrenAt(this.getChildIndex(child1), this.getChildIndex(child2));
    }
  }, {
    key: "contains",
    value: function contains(child) {
      while (child) {
        if (child === this) {
          return true;
        }

        if (!child.parent) {
          return false;
        }

        child = child.parent;
      }

      return false;
    }
  }, {
    key: "layout",
    value: function layout() {
      this.calculateSize();
      this.layoutChildren();
    }
  }, {
    key: "layoutChildren",
    value: function layoutChildren() {
      // Step1, calculate size
      this.calculateSize(); // Step2, layout all children

      var absolutes = [];
      var relatives = [];
      var contentRect = this.getContentRect();
      var contentWidth = contentRect.width;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var child = _step3.value;

          if (!child.isVisible()) {
            continue;
          }

          child.layout();

          if (child.style.position === Position.ABSOLUTE || child.style.position === Position.FIXED) {
            absolutes.push(child);
          } else {
            relatives.push(child);
            contentWidth = Math.max(contentWidth, child.getOuterWidth());
          }
        } // Step3, break children into lines

      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var lines = [];
      var line = [];
      var lineWidth = 0;

      for (var _i2 = 0, _relatives = relatives; _i2 < _relatives.length; _i2++) {
        var _child = _relatives[_i2];

        if (line.length > 0 && _child.style.display === Display.BLOCK || lineWidth + _child.getOuterWidth() > contentWidth) {
          // Break the current line
          lines.push(line);
          line = [];
          lineWidth = 0;
        }

        line.push(_child);
        lineWidth += _child.getOuterWidth();
      }

      if (line.length > 0) {
        lines.push(line);
      } // Step 4, arrange children


      var lineHeight = this.getLineHeight();
      var contentHeight = 0;

      for (var _i3 = 0, _lines = lines; _i3 < _lines.length; _i3++) {
        var l = _lines[_i3];
        var lineMaxHeight = 0;
        lineWidth = 0;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = l[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _child2 = _step4.value;
            // Align to top
            _child2.rect.y = contentHeight + contentRect.y + (_child2.style.marginTop ? _child2.style.marginTop.getValue(this.rect.height) : 0);
            lineMaxHeight = Math.max(lineMaxHeight, _child2.getOuterHeight());
            lineWidth += _child2.getOuterWidth();
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
              _iterator4["return"]();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        contentHeight += Math.max(lineHeight, lineMaxHeight);
        var x = contentRect.x;

        switch (this.style.textAlign) {
          case TextAlign.RIGHT:
            x = contentRect.x + contentWidth - lineWidth;
            break;

          case TextAlign.CENTER:
            x = contentRect.x + (contentWidth - lineWidth) / 2;
            break;

          default:
            x = contentRect.x;
        }

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = l[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _child3 = _step5.value;
            _child3.rect.x = x + (_child3.style.marginLeft ? _child3.style.marginLeft.getValue(this.rect.width) : 0);
            x += _child3.getOuterWidth();
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
              _iterator5["return"]();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      } // Update width/height
      // TODO: add css (min/max width, overflow) support.


      if (contentWidth > contentRect.width) {
        this.rect.width += contentWidth - contentRect.width;
      }

      if (contentHeight > contentRect.height) {
        this.rect.height += contentHeight - contentRect.height;
      } // Step 5, arrange absolutes


      for (var _i4 = 0, _absolutes = absolutes; _i4 < _absolutes.length; _i4++) {
        var _child4 = _absolutes[_i4];
        LayoutUtils.updatePositionForAbsoluteElement(_child4, this.rect.width, this.rect.height);
      }
    }
  }, {
    key: "getObjectUnderPoint",
    value: function getObjectUnderPoint(x, y, eventEnabled) {
      var children = this.children;

      for (var i = children.length - 1; i >= 0; i--) {
        var child = children[i];

        if (!child.isVisible() || eventEnabled && !child.eventEnabled) {
          continue;
        }

        var pt = this.localToLocal(x, y, child);

        if (child instanceof Container) {
          var result = child.getObjectUnderPoint(pt.x, pt.y, eventEnabled);

          if (result) {
            return result;
          }
        } else {
          if (child.hitTest(pt.x, pt.y)) {
            return child;
          }
        }
      } // No child match, try self


      if (this.hitTest(x, y)) {
        return this;
      }

      return undefined;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "[Container (id=".concat(this.id, ")]");
    }
  }]);

  return Container;
}(XObject);