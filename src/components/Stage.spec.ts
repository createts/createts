import { any, eq, MockCanvas, MockCanvasRenderingContext2D } from '../utils/MockCanvas';
import { Stage } from './Stage';
import { TouchItem } from './TouchItem';
import { XObject } from './XObject';

test('should construct Stage', () => {
  const canvas = new MockCanvas();
  canvas.width = 400;
  canvas.height = 300;
  const stage = new Stage(canvas.asCanvas(), { fps: 45, style: { background: '#fff' } });
  stage.layout();
  expect(stage.rect.width).toBe(400);
  expect(stage.rect.height).toBe(300);

  const ctx = new MockCanvasRenderingContext2D();
  canvas.on('getContext', eq('2d')).returns(ctx);
  stage.update();

  expect(canvas.times('getContext', eq('2d'))).toBe(1);
  expect(ctx.times('clearRect', eq(0), eq(0), eq(400), eq(300))).toBe(1);
  expect(ctx.times('fillRect', eq(0), eq(0), eq(400), eq(300))).toBe(1);
});

test('should update stage in ticker', () => {
  const canvas = new MockCanvas();
  canvas.width = 400;
  canvas.height = 300;
  const ctx = new MockCanvasRenderingContext2D();
  canvas.on('getContext', eq('2d')).returns(ctx);

  const stage = new Stage(canvas.asCanvas(), { fps: 45, style: { background: '#fff' } });
  stage.start();

  canvas.resetTimes();
  ctx.resetTimes();

  stage.updateOnce();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      expect(ctx.times('clearRect', eq(0), eq(0), eq(400), eq(300))).toBe(1);
      expect(ctx.times('fillRect', eq(0), eq(0), eq(400), eq(300))).toBe(1);
      resolve();
    }, 20);
  });
});

test('should dispatch mouse events', () => {
  const canvas = new MockCanvas();
  canvas.width = 400;
  canvas.height = 300;
  const stage = new Stage(canvas.asCanvas());

  const child = new XObject();
  child.css({ width: 100, height: 200, position: 'absolute', left: 100, top: 50 });
  stage.addChild(child);
  stage.layout();

  let childTouchDownTimes = 0;
  let childTouchUpTimes = 0;
  let childPressUpTimes = 0;
  let childClickTimes = 0;
  child
    .on('touchdown', e => {
      ++childTouchDownTimes;
    })
    .on('touchup', e => {
      ++childTouchUpTimes;
    })
    .on('pressup', e => {
      ++childPressUpTimes;
    })
    .on('click', e => {
      ++childClickTimes;
    });
  let stageTouchDownTimes = 0;
  let stageTouchUpTimes = 0;
  let stagePressUpTimes = 0;
  let stageClickTimes = 0;
  stage
    .on('touchdown', e => {
      ++stageTouchDownTimes;
    })
    .on('touchup', e => {
      ++stageTouchUpTimes;
    })
    .on('pressup', e => {
      ++stagePressUpTimes;
    })
    .on('click', e => {
      ++stageClickTimes;
    });

  // Inside child.
  stage.handleMouseOrTouchEvent('mousedown', [new TouchItem(0, undefined, 110, 100)], undefined);
  // Outside child.
  stage.handleMouseOrTouchEvent('mouseup', [new TouchItem(0, undefined, 80, 100)], undefined);
  // Outside child.
  stage.handleMouseOrTouchEvent('mousedown', [new TouchItem(0, undefined, 90, 100)], undefined);

  expect(childTouchDownTimes).toBe(1);
  expect(childTouchUpTimes).toBe(0);
  expect(childPressUpTimes).toBe(1);
  expect(childClickTimes).toBe(0);
  expect(stageTouchDownTimes).toBe(2);
  expect(stageTouchUpTimes).toBe(1);
  expect(stagePressUpTimes).toBe(1);
  expect(stageClickTimes).toBe(1);
});
