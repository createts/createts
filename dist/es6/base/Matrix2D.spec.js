import { Matrix2D } from './Matrix2D';
test('should hold values', function () {
  expect(new Matrix2D()).toEqual(new Matrix2D(1, 0, 0, 1, 0, 0));
});
test('should clone a new object', function () {
  var point = new Matrix2D(100, 200);
  expect(point.clone()).toEqual(point);
});