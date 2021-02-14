function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { IContainer } from '../components/XObject';
var ParseState;

(function (ParseState) {
  ParseState[ParseState["START"] = 1] = "START";
  ParseState[ParseState["TAG"] = 2] = "TAG";
  ParseState[ParseState["TEXT"] = 3] = "TEXT";
})(ParseState || (ParseState = {}));

var AttrState;

(function (AttrState) {
  AttrState[AttrState["PENDING"] = 0] = "PENDING";
  AttrState[AttrState["START"] = 1] = "START";
  AttrState[AttrState["NAME"] = 2] = "NAME";
  AttrState[AttrState["EQ"] = 3] = "EQ";
  AttrState[AttrState["VALUE"] = 4] = "VALUE";
  AttrState[AttrState["VALUE_STARTED"] = 5] = "VALUE_STARTED";
})(AttrState || (AttrState = {}));

export var HtmlParser = /*#__PURE__*/function () {
  function HtmlParser() {
    _classCallCheck(this, HtmlParser);
  }

  _createClass(HtmlParser, [{
    key: "parse",
    value: function parse(content) {
      var result = [];
      var nodes = this.parseHtml(content);

      var _iterator = _createForOfIteratorHelper(nodes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var node = _step.value;
          var child = this.node2Component(node);

          if (child) {
            result.push(child);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return result;
    }
  }, {
    key: "parseHtml",
    value: function parseHtml(content) {
      var nodes = [];
      var queue = [];
      var len = content.length;
      var state = ParseState.START;
      var tagStart = 0;
      var tag = null;
      var inQuota = false;
      var quota = null;
      var attrState = AttrState.PENDING;
      var attrStart = 0;
      var attrName = '';
      var attrQuota = null;
      var attr = {};
      var i = 0;

      for (; i < len; ++i) {
        var ch = content[i];

        switch (state) {
          case ParseState.START:
            if (ch === '<') {
              tagStart = i;
              tag = null;
              state = ParseState.TAG;
              attrState = AttrState.PENDING;
              attrStart = 0;
              attrName = '';
              attrQuota = null;
              attr = {};
            } else {
              tagStart = i;
              state = ParseState.TEXT;
            }

            break;

          case ParseState.TAG:
            if (!tag && (this.isSplitter(ch) || ch === '>' || ch === '/' || ch === '"' || ch === "'")) {
              tag = content.substring(tagStart + 1, i);
              attrState = AttrState.START;
            }

            if (tag === null) {
              break;
            }

            if (inQuota) {
              if (ch === quota) {
                inQuota = false;
              }
            } else {
              if (ch === "'" || ch === '"') {
                inQuota = true;
                quota = ch;
              }
            }

            if (ch === '>' && !inQuota) {
              switch (attrState) {
                case AttrState.NAME:
                  attrName = content.substring(attrStart, i);
                  this.addAttr(attr, attrName, '');
                  break;

                case AttrState.EQ:
                  this.addAttr(attr, attrName, '');
                  break;

                case AttrState.VALUE:
                case AttrState.VALUE_STARTED:
                  this.addAttr(attr, attrName, content.substring(attrStart, i));
                  break;
              }

              if (tag.substring(0, 3) === '!--') {
                if (i - tagStart >= 6 && content.substring(i - 2, i) === '--') {
                  state = ParseState.START;
                }

                break;
              }

              if (tag && tag[0] === '/') {
                tag = tag.substring(1);
                var find = false;

                var _iterator2 = _createForOfIteratorHelper(queue),
                    _step2;

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    var n = _step2.value;

                    if (n.tag === tag) {
                      find = true;
                    }
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }

                if (find) {
                  while (queue.length > 0) {
                    var node = queue.pop();

                    if (!node || node.tag === tag) {
                      break;
                    }
                  }
                }

                state = ParseState.START;
              } else {
                var _node = {
                  children: [],
                  tag: tag,
                  attributes: attr
                };
                attr = {};

                if (queue.length > 0) {
                  _node.parent = queue[queue.length - 1];
                  queue[queue.length - 1].children.push(_node);
                } else {
                  nodes.push(_node);
                }

                if (!this.isCloseTag(tag)) {
                  queue.push(_node);
                }

                state = ParseState.START;
              }
            } else {
              switch (attrState) {
                case AttrState.START:
                  if (!this.isSplitter(ch) && ch !== '/') {
                    attrStart = i;
                    attrState = AttrState.NAME;
                  }

                  attrQuota = null;
                  break;

                case AttrState.NAME:
                  if (this.isSplitter(ch)) {
                    attrName = content.substring(attrStart, i);
                    attrState = AttrState.EQ;
                  } else if (ch === '=') {
                    attrName = content.substring(attrStart, i);
                    attrStart = i + 1;
                    attrState = AttrState.VALUE;
                  }

                  break;

                case AttrState.EQ:
                  if (this.isSplitter(ch)) {
                    break;
                  }

                  if (ch === '=') {
                    attrState = AttrState.VALUE;
                    attrStart = i + 1;
                  } else {
                    this.addAttr(attr, attrName, '');
                    attrState = AttrState.START;
                  }

                  break;

                case AttrState.VALUE:
                  if (this.isSplitter(ch)) {
                    break;
                  }

                  if (ch === '"' || ch === "'") {
                    attrQuota = ch;
                    attrStart = i + 1;
                  } else {
                    attrQuota = null;
                    attrStart = i;
                  }

                  attrState = AttrState.VALUE_STARTED;
                  break;

                case AttrState.VALUE_STARTED:
                  var end = false;
                  var attrEnd = i;

                  if (attrQuota) {
                    if (ch === attrQuota) {
                      end = true;
                    }
                  } else if (!attrQuota && this.isSplitter(ch)) {
                    end = true;
                  }

                  if (end) {
                    this.addAttr(attr, attrName, content.substring(attrStart, attrEnd));
                    attrName = '';
                    attrState = AttrState.START;
                  }

                  break;
              }
            }

            break;

          case ParseState.TEXT:
            if (ch === '<') {
              if (tagStart < i) {
                var text = content.substring(tagStart, i).trim();

                if (text.length > 0) {
                  var _node2 = {
                    children: [],
                    tag: 'TEXT',
                    text: text,
                    attributes: {}
                  };

                  if (queue.length > 0) {
                    _node2.parent = queue[queue.length - 1];
                    queue[queue.length - 1].children.push(_node2);
                  } else {
                    nodes.push(_node2);
                  }
                }
              }

              state = ParseState.TAG;
              tag = null;
              tagStart = i;
              attrState = AttrState.PENDING;
              attrStart = 0;
              attrName = '';
              attrQuota = null;
              attr = {};
            }

            break;
        }
      }

      switch (state) {
        case ParseState.TEXT:
          if (tagStart < i) {
            var _text = content.substring(tagStart, i).trim();

            if (_text.length > 0) {
              var _node3 = {
                children: [],
                tag: 'TEXT',
                text: _text,
                attributes: {}
              };

              if (queue.length > 0) {
                _node3.parent = queue[queue.length - 1];
                queue[queue.length - 1].children.push(_node3);
              } else {
                nodes.push(_node3);
              }
            }
          }

          break;
      }

      for (var _i = 0, _nodes = nodes; _i < _nodes.length; _i++) {
        var _node4 = _nodes[_i];
        this.trimTextNode(_node4);
      }

      return nodes;
    }
  }, {
    key: "trimTextNode",
    value: function trimTextNode(node) {
      if (node.children.length === 1 && node.children[0].tag === 'TEXT') {
        node.text = node.children[0].text;
        node.children.length = 0;
      } else {
        var _iterator3 = _createForOfIteratorHelper(node.children),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var child = _step3.value;
            this.trimTextNode(child);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }
  }, {
    key: "node2Component",
    value: function node2Component(node) {
      var type = HtmlParser.tagMap[node.tag.toLowerCase()];

      if (!type) {
        console.warn('unknown tag:' + node.tag.toLowerCase());
        return undefined;
      }

      var options = {
        attributes: node.attributes,
        text: node.text
      };
      var component = new type(options);

      if (node.children.length > 0) {
        if (component instanceof IContainer) {
          var _iterator4 = _createForOfIteratorHelper(node.children),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var child = _step4.value;
              var childComponent = this.node2Component(child);

              if (childComponent) {
                component.addChild(childComponent);
              }
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
        } else {
          console.warn('component is not a container:' + component);
        }
      }

      return component;
    }
  }, {
    key: "isSplitter",
    value: function isSplitter(ch) {
      return ch === ' ' || ch === '\r' || ch === '\n' || ch === '\t';
    }
  }, {
    key: "isCloseTag",
    value: function isCloseTag(tag) {
      return tag === 'img';
    }
  }, {
    key: "addAttr",
    value: function addAttr(attr, name, value) {
      attr[name.toLowerCase()] = value;
    }
  }], [{
    key: "registerTag",
    value: function registerTag(tag, componentClass) {
      this.tagMap[tag.toLowerCase()] = componentClass;
    }
  }]);

  return HtmlParser;
}();
HtmlParser.tagMap = {};