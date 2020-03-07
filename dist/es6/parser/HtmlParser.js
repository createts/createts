function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { Apng } from '../components/Apng';
import { Container } from '../components/Container';
import { Img } from '../components/Img';
import { Sprite } from '../components/Sprite';
import { Text } from '../components/Text';
import { Style } from '../style/Style';
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

export var HtmlParser =
/*#__PURE__*/
function () {
  function HtmlParser() {
    _classCallCheck(this, HtmlParser);
  }

  _createClass(HtmlParser, [{
    key: "parse",
    value: function parse(content) {
      var result = [];
      var nodes = this.parseHtml(content);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var node = _step.value;
          var child = this.node2Component(node);

          if (child) {
            result.push(child);
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
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = queue[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var n = _step2.value;

                    if (n.tag === tag) {
                      find = true;
                    }
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
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = node.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var child = _step3.value;
            this.trimTextNode(child);
          }
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
      }
    }
  }, {
    key: "node2Component",
    value: function node2Component(node) {
      var type = HtmlParser.tagMap[node.tag.toLowerCase()];

      if (!type) {
        console.warn('unknow tag:' + node.tag.toLowerCase());
        return undefined;
      }

      var style = Style.of(node.attributes.style || '');
      var options = {
        attributes: node.attributes,
        style: style,
        text: node.text
      };
      var component = new type(options);

      if (node.children.length > 0) {
        if (component instanceof Container) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = node.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var child = _step4.value;
              var childComponent = this.node2Component(child);

              if (childComponent) {
                component.addChild(childComponent);
              }
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
HtmlParser.registerTag('text', Text);
HtmlParser.registerTag('container', Container);
HtmlParser.registerTag('div', Container);
HtmlParser.registerTag('img', Img);
HtmlParser.registerTag('sprite', Sprite);
HtmlParser.registerTag('apng', Apng);