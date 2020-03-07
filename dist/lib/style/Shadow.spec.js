"use strict";

var _Color = require("../base/Color");

var _Shadow = require("./Shadow");

test('should parse shadow', function () {
  expect(_Shadow.Shadow.of('10 20 30 red')).toEqual({
    offsetX: 10,
    offsetY: 20,
    blur: 30,
    color: _Color.Color.RED
  });
  expect(_Shadow.Shadow.of('10 20 30 rgb(255,0,0 ) ')).toEqual({
    offsetX: 10,
    offsetY: 20,
    blur: 30,
    color: _Color.Color.RED
  });
  expect(_Shadow.Shadow.of('10 20 red', true)).toBeUndefined();
});