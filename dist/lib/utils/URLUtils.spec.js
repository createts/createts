"use strict";

var _URLUtils = require("./URLUtils");

test('should check url types', function () {
  expect(_URLUtils.URLUtils.isAbsolute('https://a.com/')).toBe(true);
  expect(_URLUtils.URLUtils.isAbsolute('/a.com/')).toBe(false);
});
test('should get domain', function () {
  expect(_URLUtils.URLUtils.getDomain('https://a.com/hello')).toEqual('a.com');
  expect(_URLUtils.URLUtils.getDomain('http://a.com/index.html')).toEqual('a.com');
  expect(_URLUtils.URLUtils.getDomain('//a.com/index.html')).toEqual('a.com');
  expect(_URLUtils.URLUtils.getDomain('//a.com:8080/index.html')).toEqual('a.com');
  expect(_URLUtils.URLUtils.getDomain('/a.com/')).toBeUndefined();
});
test('should get origin', function () {
  expect(_URLUtils.URLUtils.getOrigin('https://a.com/hello')).toEqual('https://a.com');
  expect(_URLUtils.URLUtils.getOrigin('http://a.com/index.html')).toEqual('http://a.com');
  expect(_URLUtils.URLUtils.getOrigin('//a.com/index.html')).toEqual('//a.com');
  expect(_URLUtils.URLUtils.getOrigin('//a.com:8080/index.html')).toEqual('//a.com:8080');
  expect(_URLUtils.URLUtils.getOrigin('/a.com/')).toBeUndefined();
});