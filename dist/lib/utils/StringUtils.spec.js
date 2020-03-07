"use strict";

var _StringUtils = require("./StringUtils");

test('should match all results', function () {
  var matched = _StringUtils.StringUtils.matchAll('10px solid black', /([^\s]+)/);

  expect(matched.length).toEqual(3);
  expect(matched[0][1]).toEqual('10px');
  expect(matched[1][1]).toEqual('solid');
  expect(matched[2][1]).toEqual('black');
  expect(_StringUtils.StringUtils.matchAll('10px solid black', /(abc)/)).toEqual([]);
});