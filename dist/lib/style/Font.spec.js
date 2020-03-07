"use strict";

var _Font = require("./Font");

var _LineHeight = require("./LineHeight");

test('should parse border', function () {
  expect(_Font.Font.of('10px')).toEqual(new _Font.Font(_Font.FontStyle.NORMAL, _Font.FontVariant.NORMAL, _Font.FontWeight.NORMAL, 10, undefined, ''));
  expect(_Font.Font.of('bold italic 10px/16px Tahoma')).toEqual(new _Font.Font(_Font.FontStyle.ITALIC, _Font.FontVariant.NORMAL, _Font.FontWeight.BOLD, 10, _LineHeight.LineHeight.of('16px'), 'Tahoma'));
  expect(_Font.Font.of('', true)).toBeUndefined();
});