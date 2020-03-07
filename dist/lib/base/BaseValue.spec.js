"use strict";

var _BaseValue = require("./BaseValue");

test('should parse value', function () {
  expect(_BaseValue.BaseValue.of('50%')).toEqual(new _BaseValue.BaseValue(50, _BaseValue.BaseValueUnit.PERCENTAGE));
  expect(_BaseValue.BaseValue.of('BADVALUE', true)).toBe(undefined);
  expect(_BaseValue.BaseValue.of('50')).toEqual(new _BaseValue.BaseValue(50, _BaseValue.BaseValueUnit.PX));
  expect(_BaseValue.BaseValue.of(50)).toEqual(new _BaseValue.BaseValue(50, _BaseValue.BaseValueUnit.PX));
});
test('should convert to absolute value', function () {
  expect(_BaseValue.BaseValue.of('50%').toAbsolute(10).numberValue).toEqual(5);
  expect(_BaseValue.BaseValue.of('100').toAbsolute(10).numberValue).toEqual(100);
});
test('should convert to percentage value', function () {
  expect(_BaseValue.BaseValue.of('50%').toPercentage(10)).toEqual(new _BaseValue.BaseValue(50, _BaseValue.BaseValueUnit.PERCENTAGE));
  expect(_BaseValue.BaseValue.of('50').toPercentage(100)).toEqual(new _BaseValue.BaseValue(50, _BaseValue.BaseValueUnit.PERCENTAGE));
});
test('should convert to percentage value', function () {
  expect(_BaseValue.BaseValue.of('50%').clone()).toEqual(_BaseValue.BaseValue.of('50%'));
  expect(_BaseValue.BaseValue.of('5').clone()).toEqual(_BaseValue.BaseValue.of('5'));
});