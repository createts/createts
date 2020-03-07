import { Point } from './Point';

test('should hold values', () => {
  expect(new Point(0, 0).x).toEqual(0);
  expect(new Point(0, 100).y).toEqual(100);
});

test('should clone a new object', () => {
  const point = new Point(100, 200);
  expect(point.clone()).toEqual(point);
});
