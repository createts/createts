"use strict";

var _ContainerUtils = require("./ContainerUtils");

test('should check empty map', function () {
  expect(_ContainerUtils.ContainerUtils.isEmpty(undefined)).toBe(true);
  expect(_ContainerUtils.ContainerUtils.isEmpty({})).toBe(true);
  expect(_ContainerUtils.ContainerUtils.isEmpty({
    a: 1
  })).toBe(false);
});