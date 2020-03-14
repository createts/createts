import { any, eq, MockCanvas, MockCanvasRenderingContext2D } from '../utils/MockCanvas';
import { Container } from './Container';
import { Stage } from './Stage';
import { XObject } from './XObject';

test('should calculate size of object', () => {
  const canvas = new MockCanvas();
  const stage = new Stage(canvas.asCanvas());
  const obj = new XObject();
  stage.addChild(obj);
  obj.css({ width: 100, height: 200, padding: 2, border: '5px solid red', margin: '10 20' });
  obj.layout();
  expect(obj.getWidth()).toBe(114);
  expect(obj.getHeight()).toBe(214);
  expect(obj.getContentWidth()).toBe(100);
  expect(obj.getContentHeight()).toBe(200);
  expect(obj.getPaddingWidth()).toBe(104);
  expect(obj.getPaddingHeight()).toBe(204);
  expect(obj.getOuterWidth()).toBe(154);
  expect(obj.getOuterHeight()).toBe(234);
});

test('object can be added or removed', () => {
  const obj = new XObject();
  const container = new Container();

  expect(obj.parent).toBeUndefined();
  container.addChild(obj);
  expect(obj.parent).toBe(container);
  obj.remove();
  expect(obj.parent).toBeUndefined();
});

test('object can be visible/invisible', () => {
  expect(new XObject().isVisible()).toBe(true);
  expect(new XObject().css({ display: 'none' }).isVisible()).toBe(false);
  expect(new XObject().css({ alpha: 0 }).isVisible()).toBe(false);
  expect(new XObject().css({ scale: 0 }).isVisible()).toBe(false);
  expect(new XObject().css({ scaleX: 0 }).isVisible()).toBe(false);
  expect(new XObject().css({ scaleY: 0 }).isVisible()).toBe(false);
});

test('object can transform location between spaces', () => {
  const obj = new XObject();
  obj.rect.x = 100;
  obj.rect.y = 200;
  expect(obj.globalToLocal(150, 150)).toEqual({ x: 50, y: -50 });
  const obj2 = new XObject();
  obj2.rect.x = 200;
  obj2.rect.y = 100;
  expect(obj.localToLocal(10, 10, obj2)).toEqual({ x: -90, y: 110 });
});

test('hit test should work', () => {
  const obj = new XObject();
  obj.rect.x = 100;
  obj.rect.y = 200;
  obj.rect.width = 50;
  obj.rect.height = 50;
  expect(obj.hitTest(20, 20)).toBe(true);
  expect(obj.hitTest(-10, 20)).toBe(false);
  expect(obj.hitTest(120, 20)).toBe(false);
});
