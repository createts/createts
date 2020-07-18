"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Container = void 0;

var _HtmlParser = require("../parser/HtmlParser");

var _Style = require("../style/Style");

var _LayoutUtils = require("../utils/LayoutUtils");

var _XObject2 = require("./XObject");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * A Container is a nestable display list that allows you to work with compound objects, it can be
 * use to build the tree structure of all the objects like DOM tree, and itself is also a XObject
 * so that it also supports style, event handling, etc.
 *
 * Code example:
 *
 * ```typescript
 * const container  = new Container();
 * container.css({width:100, height:200, display:'absolute', left:50});
 * const obj = new XObject();
 * container.addChild(obj);
 * ```
 */
var Container = /*#__PURE__*/function (_XObject) {
  _inherits(Container, _XObject);

  var _super = _createSuper(Container);

  function Container() {
    var _this;

    _classCallCheck(this, Container);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.children = [];
    return _this;
  }

  _createClass(Container, [{
    key: "findById",

    /**
     * Finds the first child of this Container object by id.
     * @param id id to identify the child, undefined if not found.
     */
    value: function findById(id) {
      if (this.id === id) {
        return this;
      }

      var _iterator = _createForOfIteratorHelper(this.children),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
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
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return undefined;
    }
    /**
     * Draw content of this object and its children.
     * @param ctx The canvas rendering context of targeted canvas.
     */

  }, {
    key: "drawContent",
    value: function drawContent(ctx) {
      var list = this.children.slice();

      var _iterator2 = _createForOfIteratorHelper(list),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
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
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    /**
     * Append child to this container.
     * @param child Child element to add the this container.
     * @returns The current instance. Useful for chaining method calls.
     */

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
        child.dispatchEvent(new _XObject2.XObjectEvent('moved', false, true, child));
        this.dispatchEvent(new _XObject2.XObjectEvent('update', false, true, this));
        return this;
      } else {
        if (parent) {
          parent.removeChild(child);
        }

        child.parent = this;
        this.children.push(child);
        child.dispatchEvent(new _XObject2.XObjectEvent('added', false, true, child));
        this.dispatchEvent(new _XObject2.XObjectEvent('update', false, true, this));
        return this;
      }
    }
    /**
     * Append a list of child to this container.
     * @param children List of child element to add the this container.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "addChildren",
    value: function addChildren() {
      for (var _len2 = arguments.length, children = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        children[_key2] = arguments[_key2];
      }

      for (var _i = 0, _children = children; _i < _children.length; _i++) {
        var child = _children[_i];
        this.addChild(child);
      }

      return this;
    }
    /**
     * Append a child to this container with a specified position.
     * @param child Child element to add the this container.
     * @param index Position of this child to be added.
     * @returns The current instance. Useful for chaining method calls.
     */

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

        child.dispatchEvent(new _XObject2.XObjectEvent('moved', false, true, child));
        this.dispatchEvent(new _XObject2.XObjectEvent('update', true, true, this));
        return this;
      } else {
        if (parent) {
          parent.removeChild(child);
        }

        child.parent = this;
        this.children.splice(index, 0, child);
        child.dispatchEvent(new _XObject2.XObjectEvent('added', false, true, child));
        this.dispatchEvent(new _XObject2.XObjectEvent('update', true, true, this));
        return this;
      }
    }
    /**
     * Remove a child from this container, this function only checks the children directly belongs
     * to this container, not check recursively.
     * @param child Child to be removed, or undefined for a element is not child of this container.
     * @returns The removed child, or undefined if this element is not a child of this container.
     */

  }, {
    key: "removeChild",
    value: function removeChild(child) {
      var idx = this.children.indexOf(child);

      if (idx < 0) {
        return undefined;
      } else {
        this.children.splice(idx, 1);
        child.parent = undefined;
        child.dispatchEvent(new _XObject2.XObjectEvent('removed', false, true, child));
        this.dispatchEvent(new _XObject2.XObjectEvent('update', true, true, this));
        return child;
      }
    }
    /**
     * Remove a child from this container with a specified position.
     * @param index Position of this child to be removed.
     * @returns The removed child, or undefined for a incorrect position;
     */

  }, {
    key: "removeChildAt",
    value: function removeChildAt(index) {
      if (index < 0 || index >= this.children.length) {
        return null;
      }

      var child = this.children[index];
      this.children.splice(index, 1);
      child.dispatchEvent(new _XObject2.XObjectEvent('removed', false, true, child));
      this.dispatchEvent(new _XObject2.XObjectEvent('update', true, true, this));
      return child;
    }
    /**
     * Removes all children of this container.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "removeAllChildren",
    value: function removeAllChildren() {
      if (this.children.length === 0) {
        return this;
      }

      var _iterator3 = _createForOfIteratorHelper(this.children),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var child = _step3.value;
          child.dispatchEvent(new _XObject2.XObjectEvent('removed', false, true, child));
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      this.children.length = 0;
      this.dispatchEvent(new _XObject2.XObjectEvent('update', true, true, this));
      return this;
    }
    /**
     * Returns a child object by a specified position.
     * @param index the position of returned child.
     */

  }, {
    key: "getChildAt",
    value: function getChildAt(index) {
      return this.children[index];
    }
    /**
     * Sort the children with a comparison function.
     * @param sortFunction The comparison function used to sort children.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "sortChildren",
    value: function sortChildren(sortFunction) {
      this.children.sort(sortFunction);
      this.dispatchEvent(new _XObject2.XObjectEvent('update', true, true, this));
      return this;
    }
    /**
     * Gets the the index of the given child in current container's children list, -1 if not found.
     * @param child The child to be found.
     * @returns The index of the given child in current container's children list, -1 if not found.
     */

  }, {
    key: "getChildIndex",
    value: function getChildIndex(child) {
      return this.children.indexOf(child);
    }
    /**
     * Swap the children at 2 specified positions.
     * @param index1 first position of 2 children.
     * @param index2 second position of 2 children.
     * @returns The current instance. Useful for chaining method calls.
     */

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
      o1.dispatchEvent(new _XObject2.XObjectEvent('moved', false, true, o1));
      o2.dispatchEvent(new _XObject2.XObjectEvent('moved', false, true, o2));
      this.dispatchEvent(new _XObject2.XObjectEvent('update', true, true, this));
      return this;
    }
    /**
     * Swaps 2 specified children.
     * @param child1 first child to swap.
     * @param child2 second child to swap.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "swapChildren",
    value: function swapChildren(child1, child2) {
      return this.swapChildrenAt(this.getChildIndex(child1), this.getChildIndex(child2));
    }
    /**
     * Calculates size of current container and layout its children.
     */

  }, {
    key: "layout",
    value: function layout() {
      this.calculateSize();
      this.layoutChildren();
    }
    /**
     * Layouts current container's children.
     */

  }, {
    key: "layoutChildren",
    value: function layoutChildren() {
      // Step1, layout all children
      var absolutes = [];
      var relatives = [];
      var contentRect = this.getContentRect();
      var contentWidth = contentRect.width;
      var contentHeight = contentRect.height;

      var _iterator4 = _createForOfIteratorHelper(this.children),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _child3 = _step4.value;

          if (!_child3.isVisible()) {
            continue;
          }

          _child3.layout();

          if (_child3.style.position === _Style.Position.ABSOLUTE || _child3.style.position === _Style.Position.FIXED) {
            absolutes.push(_child3);
          } else {
            relatives.push(_child3);
            contentWidth = Math.max(contentWidth, _child3.getOuterWidth());
            contentHeight = Math.max(contentHeight, _child3.getOuterHeight());
          }
        } // Step2, break children into lines.

      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      var lineHeight = this.getLineHeight();
      var lines = [];
      var line = {
        width: 0,
        height: lineHeight,
        children: []
      };

      for (var _i2 = 0, _relatives = relatives; _i2 < _relatives.length; _i2++) {
        var child = _relatives[_i2];

        if (line.children.length > 0 && child.style.display === _Style.Display.BLOCK || line.width + child.getOuterWidth() > contentWidth) {
          // Break the current line
          lines.push(line);
          line = {
            width: 0,
            height: lineHeight,
            children: []
          };
        }

        line.children.push(child);
        line.width += child.getOuterWidth();
        line.height = Math.max(child.getOuterHeight(), line.height);
      }

      if (line.children.length > 0) {
        lines.push(line);
      } // Step 3, arrange children


      var x = contentRect.x;
      var y = contentRect.y;

      for (var _i3 = 0, _lines = lines; _i3 < _lines.length; _i3++) {
        var l = _lines[_i3];

        switch (this.style.textAlign) {
          case _Style.TextAlign.RIGHT:
            x = contentRect.x + contentWidth - l.width;
            break;

          case _Style.TextAlign.CENTER:
            x = contentRect.x + (contentWidth - l.width) / 2;
            break;

          default:
            x = contentRect.x;
        }

        var _iterator5 = _createForOfIteratorHelper(l.children),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var _child = _step5.value;
            // Calculates x position.
            _child.rect.x = x + (_child.style.marginLeft ? _child.style.marginLeft.getValue(this.rect.width) : 0);
            x += _child.getOuterWidth(); // Calculates y position.

            switch (_child.style.verticalAlign) {
              case _Style.VerticalAlign.BOTTOM:
                _child.rect.y = y + l.height - (_child.style.marginBottom ? _child.style.marginBottom.getValue(this.rect.height) : 0) - _child.getHeight();
                break;

              case _Style.VerticalAlign.MIDDLE:
                _child.rect.y = y + (l.height - _child.getOuterHeight()) / 2 + (_child.style.marginTop ? _child.style.marginTop.getValue(this.rect.height) : 0);
                break;

              default:
                _child.rect.y = y + (_child.style.marginTop ? _child.style.marginTop.getValue(this.rect.height) : 0);
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        y += l.height;
        contentHeight = Math.max(contentHeight, y);
      } // Update width/height
      // TODO: add css (min/max width) support.


      if (!this.style.width && contentWidth > contentRect.width) {
        this.rect.width += contentWidth - contentRect.width;
      }

      if (!this.style.height && contentHeight > contentRect.height) {
        this.rect.height += contentHeight - contentRect.height;
      } // Step 4, arrange absolutes


      for (var _i4 = 0, _absolutes = absolutes; _i4 < _absolutes.length; _i4++) {
        var _child2 = _absolutes[_i4];

        _LayoutUtils.LayoutUtils.updatePositionForAbsoluteElement(_child2, this.rect.width, this.rect.height);
      }
    }
    /**
     * Find a child at the specified position.
     * @param {Number} x The x position in the container to test.
     * @param {Number} y The y position in the container to test.
     * @param eventEnabled Whether to ignore the child who is disabling for pointer events.
     * @returns The child object in the specified position, undefined if there is no any child at that position.
     */

  }, {
    key: "getObjectUnderPoint",
    value: function getObjectUnderPoint(x, y, eventEnabled) {
      if (!this.isVisible()) {
        return undefined;
      }

      if (eventEnabled) {
        switch (this.style.pointerEvents) {
          case _Style.PointerEvents.NONE:
            return undefined;

          case _Style.PointerEvents.BLOCK:
            return this.hitTest(x, y) ? this : undefined;
        }

        var children = this.children;

        for (var i = children.length - 1; i >= 0; i--) {
          var child = children[i];

          if (!child.isVisible()) {
            continue;
          }

          var pt = this.localToLocal(x, y, child);

          if (child instanceof Container) {
            var result = child.getObjectUnderPoint(pt.x, pt.y, eventEnabled);

            if (result) {
              return result;
            }
          } else {
            if (child.style.pointerEvents !== _Style.PointerEvents.NONE && child.style.pointerEvents !== _Style.PointerEvents.CROSS && child.hitTest(pt.x, pt.y)) {
              return child;
            }
          }
        } // No child match, try self


        if (this.style.pointerEvents !== _Style.PointerEvents.CROSS && this.hitTest(x, y)) {
          return this;
        }

        return undefined;
      } else {
        var _children2 = this.children;

        for (var _i5 = _children2.length - 1; _i5 >= 0; _i5--) {
          var _child4 = _children2[_i5];

          if (!_child4.isVisible()) {
            continue;
          }

          var _pt = this.localToLocal(x, y, _child4);

          if (_child4 instanceof Container) {
            var _result = _child4.getObjectUnderPoint(_pt.x, _pt.y, eventEnabled);

            if (_result) {
              return _result;
            }
          } else if (_child4.hitTest(_pt.x, _pt.y)) {
            return _child4;
          } // No child match, try self


          if (this.hitTest(x, y)) {
            return this;
          }

          return undefined;
        }
      }
    }
    /**
     * Parse the input html and load as children.
     * @param html The html to be parsed and loaded.
     * @param clear If true, clear the existing children before loading.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "load",
    value: function load(html) {
      var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (clear) {
        this.removeAllChildren();
      }

      this.addChildren.apply(this, _toConsumableArray(new _HtmlParser.HtmlParser().parse(html)));
      return this;
    }
    /**
     * Returns a string representation of this object.
     * @returns a string representation of this object.
     */

  }, {
    key: "toString",
    value: function toString() {
      return "[Container (id=".concat(this.id, ")]");
    }
  }]);

  return Container;
}(_XObject2.XObject);

exports.Container = Container;

_HtmlParser.HtmlParser.registerTag('container', Container);

_HtmlParser.HtmlParser.registerTag('div', Container);