import { TouchItem } from './TouchItem';
import { XObject } from './XObject';
test('should hold values', function () {
  var now = Date.now();
  var touchItem = new TouchItem(1, undefined, 100, 200, now);
  expect(touchItem).toEqual({
    identifier: 1,
    srcElement: undefined,
    srcStageX: 100,
    srcStageY: 200,
    srcTimestamp: now,
    currentTarget: undefined,
    stageX: 100,
    stageY: 200,
    timestamp: now,
    speed: 0,
    direction: 0,
    pressed: false,
    x: 0,
    y: 0
  });
});
test('should switch srcElement', function () {
  var now = Date.now();
  var srcElement = new XObject();
  var touchItem = new TouchItem(1, undefined, 100, 200, now).switchSourceElement(srcElement);
  expect(touchItem).toEqual({
    identifier: 1,
    srcElement: srcElement,
    srcStageX: 100,
    srcStageY: 200,
    srcTimestamp: now,
    currentTarget: undefined,
    stageX: 100,
    stageY: 200,
    timestamp: now,
    speed: 0,
    direction: 0,
    pressed: false,
    x: 0,
    y: 0
  });
});
test('should be updated', function () {
  var now = Date.now();
  var touchItem = new TouchItem(1, undefined, 100, 200, now);
  touchItem.onUpdate(new TouchItem(1, undefined, 200, 200, now + 100));
  expect(touchItem.speed).toEqual(1);
  expect(touchItem.direction).toEqual(0);
  expect(touchItem.stageX).toEqual(200);
  expect(touchItem.stageY).toEqual(200);
  touchItem.onUpdate(new TouchItem(1, undefined, 200, 300, now + 200));
  expect(touchItem.speed).toEqual(1);
  expect(touchItem.direction).toEqual(270);
  expect(touchItem.stageX).toEqual(200);
  expect(touchItem.stageY).toEqual(300);
  touchItem.onUpdate(new TouchItem(1, undefined, 100, 200, now + 300));
  expect(touchItem.speed).toEqual(Math.sqrt(100 * 100 + 100 * 100) / 100);
  expect(touchItem.direction).toEqual(135);
  expect(touchItem.stageX).toEqual(100);
  expect(touchItem.stageY).toEqual(200);
});
test('should clone a new object', function () {
  var touchItem = new TouchItem(1, undefined, 100, 200, Date.now());
  expect(touchItem.clone()).toEqual(touchItem);
});