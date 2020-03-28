"use strict";

var _BaseValue = require("../base/BaseValue");

var _Style = require("./Style");

test('should apply new styles', function () {
  var style = new _Style.Style();
  style.apply({
    width: 100,
    height: '100%'
  });
  expect(style.width).toEqual(_BaseValue.BaseValue.of('100'));
  expect(style.height).toEqual(_BaseValue.BaseValue.of('100%'));
});
test('should be cloned', function () {
  var style = new _Style.Style();
  style.apply({
    width: 100,
    height: '100%'
  });
  expect(style).toEqual(style.clone());
});