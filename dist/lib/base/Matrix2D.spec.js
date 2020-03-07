"use strict";

var _Matrix2D = require("./Matrix2D");

test('should hold values', function () {
  expect(new _Matrix2D.Matrix2D()).toEqual(new _Matrix2D.Matrix2D(1, 0, 0, 1, 0, 0));
});
test('should clone a new object', function () {
  var point = new _Matrix2D.Matrix2D(100, 200);
  expect(point.clone()).toEqual(point);
});