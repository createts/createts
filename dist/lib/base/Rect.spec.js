"use strict";

var _Rect = require("./Rect");

test('should hold values', function () {
  expect(new _Rect.Rect(0, 1, 100, 200).x).toEqual(0);
  expect(new _Rect.Rect(0, 1, 100, 200).y).toEqual(1);
  expect(new _Rect.Rect(0, 1, 100, 200).width).toEqual(100);
  expect(new _Rect.Rect(0, 1, 100, 200).height).toEqual(200);
});
test('should convert from a string', function () {
  expect(_Rect.Rect.of('0 1  100    200')).toEqual(new _Rect.Rect(0, 1, 100, 200));
  expect(_Rect.Rect.of('0, 1, 100, 200')).toBe(undefined);
});
test('should clone a new object', function () {
  var rect = _Rect.Rect.of('0 1 100 200');

  expect(rect.clone()).toEqual(rect);
});