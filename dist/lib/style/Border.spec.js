"use strict";

var _Color = require("../base/Color");

var _Border = require("./Border");

test('should parse border', function () {
  expect(_Border.Border.of('10px solid black')).toEqual(new _Border.Border(10, _Border.BorderStyle.SOLID, _Color.Color.BLACK));
  expect(_Border.Border.of('10px solid #fff')).toEqual(new _Border.Border(10, _Border.BorderStyle.SOLID, _Color.Color.WHITE));
  expect(_Border.Border.of('10px  solid   black')).toEqual(new _Border.Border(10, _Border.BorderStyle.SOLID, _Color.Color.BLACK));
  expect(_Border.Border.of('10px ', true)).toBeUndefined();
});