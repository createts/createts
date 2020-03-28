"use strict";

var _Base = require("./Base64");

function toArray(data) {
  var result = [];

  for (var i = 0; i < data.length; ++i) {
    result.push(data.charCodeAt(i));
  }

  return new Uint8Array(result);
}

test('should encode base64', function () {
  expect(_Base.Base64.encode([toArray('hello world')])).toEqual('aGVsbG8gd29ybGQ=');
  expect(_Base.Base64.encode([toArray('hello'), toArray(' '), toArray('world')])).toEqual('aGVsbG8gd29ybGQ=');
  expect(_Base.Base64.encode([toArray('h'), toArray('e'), toArray('l'), toArray('l'), toArray(''), toArray('o'), toArray(' '), toArray('w'), toArray('o'), toArray('r'), toArray('l'), toArray('d'), toArray('')])).toEqual('aGVsbG8gd29ybGQ=');
});