"use strict";

var _base = require("../base");

var _StyleUtils = require("./StyleUtils");

test('should parse single value', function () {
  expect(_StyleUtils.StyleUtils.parse4Dirs('10')).toEqual([_base.BaseValue.of(10), _base.BaseValue.of(10), _base.BaseValue.of(10), _base.BaseValue.of(10)]);
  expect(_StyleUtils.StyleUtils.parse4Dirs('10%')).toEqual([_base.BaseValue.of('10%'), _base.BaseValue.of('10%'), _base.BaseValue.of('10%'), _base.BaseValue.of('10%')]);
});
test('should parse 2 values', function () {
  expect(_StyleUtils.StyleUtils.parse4Dirs('10 20')).toEqual([_base.BaseValue.of(10), _base.BaseValue.of(20), _base.BaseValue.of(10), _base.BaseValue.of(20)]);
  expect(_StyleUtils.StyleUtils.parse4Dirs('10% 20%')).toEqual([_base.BaseValue.of('10%'), _base.BaseValue.of('20%'), _base.BaseValue.of('10%'), _base.BaseValue.of('20%')]);
});
test('should parse 3 values', function () {
  expect(_StyleUtils.StyleUtils.parse4Dirs('10 20 30')).toEqual([_base.BaseValue.of(10), _base.BaseValue.of(20), _base.BaseValue.of(30), _base.BaseValue.of(20)]);
  expect(_StyleUtils.StyleUtils.parse4Dirs('10% 20% 30%')).toEqual([_base.BaseValue.of('10%'), _base.BaseValue.of('20%'), _base.BaseValue.of('30%'), _base.BaseValue.of('20%')]);
});
test('should parse 4 values', function () {
  expect(_StyleUtils.StyleUtils.parse4Dirs('10 20 30 40')).toEqual([_base.BaseValue.of(10), _base.BaseValue.of(20), _base.BaseValue.of(30), _base.BaseValue.of(40)]);
  expect(_StyleUtils.StyleUtils.parse4Dirs('10% 20% 30% 40%')).toEqual([_base.BaseValue.of('10%'), _base.BaseValue.of('20%'), _base.BaseValue.of('30%'), _base.BaseValue.of('40%')]);
});
test('should ignore bad values', function () {
  expect(_StyleUtils.StyleUtils.parse4Dirs('a b c d e')).toBeUndefined();
});