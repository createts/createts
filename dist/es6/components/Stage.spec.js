import { eq, MockCanvas, MockCanvasRenderingContext2D } from '../utils/MockCanvas';
import { Stage } from './Stage';
test('should construct Stage', function () {
  var canvas = new MockCanvas();
  canvas.width = 400;
  canvas.height = 300;
  var stage = new Stage(canvas.asCanvas(), {
    fps: 45,
    style: {
      background: '#fff'
    }
  });
  stage.layout();
  expect(stage.rect.width).toBe(400);
  expect(stage.rect.height).toBe(300);
  var ctx = new MockCanvasRenderingContext2D();
  canvas.on('getContext', eq('2d')).returns(ctx);
  stage.update();
  expect(canvas.times('getContext', eq('2d'))).toBe(1);
  expect(ctx.times('clearRect', eq(0), eq(0), eq(400), eq(300))).toBe(1);
  expect(ctx.times('fillRect', eq(0), eq(0), eq(400), eq(300))).toBe(1);
});
test('should update stage in ticker', function () {
  var canvas = new MockCanvas();
  canvas.width = 400;
  canvas.height = 300;
  var ctx = new MockCanvasRenderingContext2D();
  canvas.on('getContext', eq('2d')).returns(ctx);
  var stage = new Stage(canvas.asCanvas(), {
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
      expect(ctx.times('clearRect', eq(0), eq(0), eq(400), eq(300))).toBe(1);
      expect(ctx.times('fillRect', eq(0), eq(0), eq(400), eq(300))).toBe(1);
      resolve();
    }, 20);
  });
});