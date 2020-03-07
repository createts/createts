"use strict";

var _CRC = require("./CRC32");

function toArray(data) {
  var result = [];

  for (var i = 0; i < data.length; ++i) {
    result.push(data.charCodeAt(i));
  }

  return new Uint8Array(result);
}

test('should calculate CRC32', function () {
  // Verified at https://crccalc.com/
  expect(_CRC.CRC32.calculate(new Uint8Array([]))).toEqual(0x00000000); // tslint:disable-next-line: no-bitwise

  expect(_CRC.CRC32.calculate(toArray('a'))).toEqual(0xe8b7be43 & 0xffffffff); // tslint:disable-next-line: no-bitwise

  expect(_CRC.CRC32.calculate(toArray('abcdefghijklmnopqrstuvwxyz'))).toEqual(0x4c2750bd & 0xffffffff); // tslint:disable-next-line: no-bitwise

  expect(_CRC.CRC32.calculate(toArray('hello world'))).toEqual(0x0d4a1185 & 0xffffffff);
});