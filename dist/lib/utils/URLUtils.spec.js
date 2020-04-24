"use strict";

var _URLUtils = require("./URLUtils");

test('should check url types', function () {
  expect(_URLUtils.URLUtils.isAbsolute('https://a.com/')).toBe(true);
  expect(_URLUtils.URLUtils.isAbsolute('/a.com/')).toBe(false);
});