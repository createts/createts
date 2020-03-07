"use strict";

var _Point = require("./Point");

test('should hold values', function () {
  expect(new _Point.Point(0, 0).x).toEqual(0);
  expect(new _Point.Point(0, 100).y).toEqual(100);
});
test('should clone a new object', function () {
  var point = new _Point.Point(100, 200);
  expect(point.clone()).toEqual(point);
});