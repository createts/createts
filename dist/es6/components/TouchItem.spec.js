import { TouchItem } from './TouchItem';
test('should hold values', function () {
  var touchItem = new TouchItem(1, undefined, 100, 200, 10, 20);
  expect(touchItem).toEqual({
    identifier: 1,
    srcElement: undefined,
    stageX: 100,
    stageY: 200,
    x: 10,
    y: 20
  });
});
test('should clone a new object', function () {
  var touchItem = new TouchItem(1, undefined, 100, 200, 10, 20);
  expect(touchItem.clone()).toEqual(touchItem);
});