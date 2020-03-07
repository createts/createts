"use strict";

var _LineHeight = require("./LineHeight");

test('should parse line height', function () {
  expect(_LineHeight.LineHeight.of('normal').type).toEqual(_LineHeight.LineHeightType.NORMAL);
  expect(_LineHeight.LineHeight.of('10px')).toEqual({
    type: _LineHeight.LineHeightType.LENGTH,
    value: 10
  });
  expect(_LineHeight.LineHeight.of('10')).toEqual({
    type: _LineHeight.LineHeightType.NUMBER,
    value: 10
  });
  expect(_LineHeight.LineHeight.of('20%')).toEqual({
    type: _LineHeight.LineHeightType.PERCENT,
    value: 20
  });
  expect(_LineHeight.LineHeight.of('aa', true)).toBeUndefined();
});