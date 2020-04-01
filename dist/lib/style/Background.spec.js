"use strict";

var _BaseValue = require("../base/BaseValue");

var _Color = require("../base/Color");

var _ResourceRegistry = require("../resource/ResourceRegistry");

var _Background = require("./Background");

// Disable loading image.
// TODO: move image loading while attach style to element?
_ResourceRegistry.ResourceRegistry.DefaultInstance.add = function (url, type) {
  return new Promise(function (resolve, reject) {
    resolve(new Image());
  });
};

test('should parse color', function () {
  var background = _Background.Background.of('#ffffff');

  expect(background.color).toEqual(_Color.Color.WHITE);
});
test('should parse image layer', function () {
  var background = _Background.Background.of('red left 5% / 15% 60% repeat-x url("./star.png")');

  expect(background.color).toEqual(_Color.Color.RED);
  expect(background.image[0]).toEqual({
    url: './star.png'
  });
  expect(background.repeat[0]).toEqual({
    x: 'repeat',
    y: 'no-repeat'
  });
  expect(background.clip[0]).toEqual(_Background.BackgroundClip.CONTENT_BOX);
  expect(background.origin[0]).toEqual(_Background.BackgroundClip.PADDING_BOX);
  expect(background.size[0]).toEqual({
    xType: 'value',
    x: _BaseValue.BaseValue.of('15%'),
    yType: 'value',
    y: _BaseValue.BaseValue.of('60%')
  });
  expect(background.position[0]).toEqual({
    xDir: 'left',
    x: _BaseValue.BaseValue.ZERO,
    yDir: 'top',
    y: _BaseValue.BaseValue.of('5%')
  });
});
test('should parse multiple image layer', function () {
  var background = _Background.Background.of('red left 5% / 15% 60% repeat-x url("./star.png"), no-repeat center/contain url("./createts.png")');

  expect(background.color).toEqual(_Color.Color.RED);
  expect(background.image[0]).toEqual({
    url: './star.png'
  });
  expect(background.repeat[0]).toEqual({
    x: 'repeat',
    y: 'no-repeat'
  });
  expect(background.clip[0]).toEqual(_Background.BackgroundClip.CONTENT_BOX);
  expect(background.origin[0]).toEqual(_Background.BackgroundClip.PADDING_BOX);
  expect(background.size[0]).toEqual({
    xType: 'value',
    x: _BaseValue.BaseValue.of('15%'),
    yType: 'value',
    y: _BaseValue.BaseValue.of('60%')
  });
  expect(background.position[0]).toEqual({
    xDir: 'left',
    x: _BaseValue.BaseValue.ZERO,
    yDir: 'top',
    y: _BaseValue.BaseValue.of('5%')
  });
  expect(background.image[1]).toEqual({
    url: './createts.png'
  });
  expect(background.repeat[1]).toEqual({
    x: 'no-repeat',
    y: 'no-repeat'
  });
  expect(background.clip[1]).toEqual(_Background.BackgroundClip.CONTENT_BOX);
  expect(background.origin[1]).toEqual(_Background.BackgroundClip.PADDING_BOX);
  expect(background.size[1]).toEqual({
    xType: 'contain',
    x: _BaseValue.BaseValue.ZERO,
    yType: 'contain',
    y: _BaseValue.BaseValue.ZERO
  });
  expect(background.position[1]).toEqual({
    xDir: 'center',
    x: _BaseValue.BaseValue.ZERO,
    yDir: 'center',
    y: _BaseValue.BaseValue.ZERO
  });
});