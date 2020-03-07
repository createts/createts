"use strict";

var _BaseValue = require("./BaseValue");

var _RoundRect = require("./RoundRect");

test('should hold values', function () {
  var roundRect = new _RoundRect.RoundRect(5, 5, 10, 10);
  expect(roundRect.x1).toEqual(5);
  expect(roundRect.x1).toEqual(5);
  expect(roundRect.x2).toEqual(10);
  expect(roundRect.x2).toEqual(10);
});
test('should resize', function () {
  var roundRect = new _RoundRect.RoundRect(5, 5, 10, 10);
  roundRect.applySize(20, 30);
  expect(roundRect.x1).toEqual(5);
  expect(roundRect.x1).toEqual(5);
  expect(roundRect.x2).toEqual(24);
  expect(roundRect.y2).toEqual(34);
});
test('should apply radius', function () {
  var roundRect = new _RoundRect.RoundRect(5, 5, 40, 50);
  roundRect.applyRadius(_BaseValue.BaseValue.of(4), _BaseValue.BaseValue.of(5), _BaseValue.BaseValue.of(6), _BaseValue.BaseValue.of(7));
  expect(roundRect.leftTopRadiusX).toEqual(4);
  expect(roundRect.leftTopRadiusY).toEqual(4);
  expect(roundRect.rightTopRadiusX).toEqual(5);
  expect(roundRect.rightTopRadiusY).toEqual(5);
  expect(roundRect.rightBottomRadiusX).toEqual(6);
  expect(roundRect.rightBottomRadiusY).toEqual(6);
  expect(roundRect.leftBottomRadiusX).toEqual(7);
  expect(roundRect.leftBottomRadiusY).toEqual(7);
});
test('should apply radius by percentage', function () {
  var roundRect = new _RoundRect.RoundRect(5, 5, 104, 54);
  roundRect.applyRadius(_BaseValue.BaseValue.of('10%'), _BaseValue.BaseValue.of('20%'), _BaseValue.BaseValue.of('30%'), _BaseValue.BaseValue.of('40%'));
  expect(roundRect.leftTopRadiusX).toEqual(10);
  expect(roundRect.leftTopRadiusY).toEqual(5);
  expect(roundRect.rightTopRadiusX).toEqual(20);
  expect(roundRect.rightTopRadiusY).toEqual(10);
  expect(roundRect.rightBottomRadiusX).toEqual(30);
  expect(roundRect.rightBottomRadiusY).toEqual(15);
  expect(roundRect.leftBottomRadiusX).toEqual(40);
  expect(roundRect.leftBottomRadiusY).toEqual(20);
});
test('should apply border', function () {
  var roundRect = new _RoundRect.RoundRect(5, 5, 104, 54);
  roundRect.applyRadius(_BaseValue.BaseValue.of('10%'), _BaseValue.BaseValue.of('20%'), _BaseValue.BaseValue.of('30%'), _BaseValue.BaseValue.of('40%'));
  var newRoundRect = roundRect.applyBorder(5, 6, 7, 8);
  expect(newRoundRect.x1).toEqual(13);
  expect(newRoundRect.y1).toEqual(10);
  expect(newRoundRect.x2).toEqual(98);
  expect(newRoundRect.y2).toEqual(47);
  expect(newRoundRect.leftTopRadiusX).toEqual(0);
  expect(newRoundRect.leftTopRadiusY).toEqual(0);
  expect(newRoundRect.rightTopRadiusX).toEqual(14);
  expect(newRoundRect.rightTopRadiusY).toEqual(5);
  expect(newRoundRect.rightBottomRadiusX).toEqual(24);
  expect(newRoundRect.rightBottomRadiusY).toEqual(8);
  expect(newRoundRect.leftBottomRadiusX).toEqual(32);
  expect(newRoundRect.leftBottomRadiusY).toEqual(13);
  var rect = newRoundRect.toRect();
  expect(rect.x).toEqual(13);
  expect(rect.y).toEqual(10);
  expect(rect.width).toEqual(86);
  expect(rect.height).toEqual(38);
});