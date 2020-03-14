"use strict";

var _MockCanvas = require("../utils/MockCanvas");

var _Stage = require("./Stage");

test('should construct Stage', function () {
  var canvas = new _MockCanvas.MockCanvas();
  canvas.width = 400;
  canvas.height = 300;
  var stage = new _Stage.Stage(canvas.asCanvas(), {
    fps: 45,
    style: {
      background: '#fff'
    }
  });
  stage.layout();
  expect(stage.rect.width).toBe(400);
  expect(stage.rect.height).toBe(300);
  var ctx = new _MockCanvas.MockCanvasRenderingContext2D();
  canvas.on('getContext', (0, _MockCanvas.eq)('2d')).returns(ctx);
  stage.update();
  expect(canvas.times('getContext', (0, _MockCanvas.eq)('2d'))).toBe(1);
  expect(ctx.times('clearRect', (0, _MockCanvas.eq)(0), (0, _MockCanvas.eq)(0), (0, _MockCanvas.eq)(400), (0, _MockCanvas.eq)(300))).toBe(1);
  expect(ctx.times('fillRect', (0, _MockCanvas.eq)(0), (0, _MockCanvas.eq)(0), (0, _MockCanvas.eq)(400), (0, _MockCanvas.eq)(300))).toBe(1);
});
test('should update stage in ticker', function () {
  var canvas = new _MockCanvas.MockCanvas();
  canvas.width = 400;
  canvas.height = 300;
  var ctx = new _MockCanvas.MockCanvasRenderingContext2D();
  canvas.on('getContext', (0, _MockCanvas.eq)('2d')).returns(ctx);
  var stage = new _Stage.Stage(canvas.asCanvas(), {
    fps: 45,
    style: {
      background: '#fff'
    }
  });
  stage.start();
  canvas.resetTimes();
  ctx.resetTimes();
  stage.updateOnce();
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      expect(ctx.times('clearRect', (0, _MockCanvas.eq)(0), (0, _MockCanvas.eq)(0), (0, _MockCanvas.eq)(400), (0, _MockCanvas.eq)(300))).toBe(1);
      expect(ctx.times('fillRect', (0, _MockCanvas.eq)(0), (0, _MockCanvas.eq)(0), (0, _MockCanvas.eq)(400), (0, _MockCanvas.eq)(300))).toBe(1);
      resolve();
    }, 20);
  });
});