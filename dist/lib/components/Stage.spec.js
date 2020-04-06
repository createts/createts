"use strict";

var _MockCanvas = require("../utils/MockCanvas");

var _Stage = require("./Stage");

var _TouchItem = require("./TouchItem");

var _XObject = require("./XObject");

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
test('should dispatch mouse events', function () {
  var canvas = new _MockCanvas.MockCanvas();
  canvas.width = 400;
  canvas.height = 300;
  var stage = new _Stage.Stage(canvas.asCanvas());
  var child = new _XObject.XObject();
  child.css({
    width: 100,
    height: 200,
    position: 'absolute',
    left: 100,
    top: 50
  });
  stage.addChild(child);
  stage.layout();
  var childTouchDownTimes = 0;
  var childTouchUpTimes = 0;
  var childPressUpTimes = 0;
  var childClickTimes = 0;
  child.on('touchdown', function (e) {
    ++childTouchDownTimes;
  }).on('touchup', function (e) {
    ++childTouchUpTimes;
  }).on('pressup', function (e) {
    ++childPressUpTimes;
  }).on('click', function (e) {
    ++childClickTimes;
  });
  var stageTouchDownTimes = 0;
  var stageTouchUpTimes = 0;
  var stagePressUpTimes = 0;
  var stageClickTimes = 0;
  stage.on('touchdown', function (e) {
    ++stageTouchDownTimes;
  }).on('touchup', function (e) {
    ++stageTouchUpTimes;
  }).on('pressup', function (e) {
    ++stagePressUpTimes;
  }).on('click', function (e) {
    ++stageClickTimes;
  }); // Inside child.

  stage.handleMouseOrTouchEvent('mousedown', [new _TouchItem.TouchItem(0, undefined, 110, 100, Date.now())], undefined); // Outside child.

  stage.handleMouseOrTouchEvent('mouseup', [new _TouchItem.TouchItem(0, undefined, 80, 100, Date.now())], undefined); // Outside child.

  stage.handleMouseOrTouchEvent('mousedown', [new _TouchItem.TouchItem(0, undefined, 90, 100, Date.now())], undefined);
  expect(childTouchDownTimes).toBe(1);
  expect(childTouchUpTimes).toBe(0);
  expect(childPressUpTimes).toBe(1);
  expect(childClickTimes).toBe(0);
  expect(stageTouchDownTimes).toBe(2);
  expect(stageTouchUpTimes).toBe(1);
  expect(stagePressUpTimes).toBe(1);
  expect(stageClickTimes).toBe(1);
});