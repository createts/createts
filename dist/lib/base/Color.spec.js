"use strict";

var _Color = require("./Color");

test('should parse hex value', function () {
  expect(_Color.Color.of('#fff')).toEqual(_Color.Color.WHITE);
  expect(_Color.Color.of('#000')).toEqual(_Color.Color.BLACK);
  expect(_Color.Color.of('#ffffff')).toEqual(_Color.Color.WHITE);
  expect(_Color.Color.of('#000000')).toEqual(_Color.Color.BLACK);
  expect(_Color.Color.of('#ffff')).toEqual(_Color.Color.WHITE);
  expect(_Color.Color.of('#000f')).toEqual(_Color.Color.BLACK);
  expect(_Color.Color.of('#ffffffff')).toEqual(_Color.Color.WHITE);
  expect(_Color.Color.of('#000000ff')).toEqual(_Color.Color.BLACK);
  expect(_Color.Color.of('#000000fff', true)).toBeUndefined();
  expect(_Color.Color.of('#00000', true)).toBeUndefined();
  expect(_Color.Color.of('#xxx', true)).toBeUndefined();
});
test('should convert by color name', function () {
  expect(_Color.Color.of('black')).toEqual(_Color.Color.BLACK);
  expect(_Color.Color.of('WHITE')).toEqual(_Color.Color.WHITE);
  expect(_Color.Color.of('White')).toEqual(_Color.Color.WHITE);
  expect(_Color.Color.of('badcolor', true)).toBeUndefined();
});
test('should convert rgb function', function () {
  expect(_Color.Color.of('rgb(0,0,0)')).toEqual(_Color.Color.BLACK);
  expect(_Color.Color.of('rgba(0,0,0,1)')).toEqual(_Color.Color.BLACK);
  expect(_Color.Color.of('rgba(0%,0,0,1)')).toEqual(_Color.Color.BLACK);
  expect(_Color.Color.of('rgba(0%,0%,0%,100%)')).toEqual(_Color.Color.BLACK);
  expect(_Color.Color.of('rgba("0%","0%",0%,100%)')).toEqual(_Color.Color.BLACK);
  expect(_Color.Color.of('rgba(0,0,0,.5)').a).toEqual(0.5);
  expect(_Color.Color.of('rgb()', true)).toBeUndefined();
  expect(_Color.Color.of('rgb(.,255,255), true', true)).toBeUndefined();
  expect(_Color.Color.of('rgb(.5x,255,255), true', true)).toBeUndefined();
  expect(_Color.Color.of('rgba(0%,0%,0%,88%)').a).toBe(0.88);
  expect(_Color.Color.of('rgba(0%,0%,0%,.88)').a).toBe(0.88);
});