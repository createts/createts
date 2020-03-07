import { Rect } from './Rect';

test('should hold values', () => {
  expect(new Rect(0, 1, 100, 200).x).toEqual(0);
  expect(new Rect(0, 1, 100, 200).y).toEqual(1);
  expect(new Rect(0, 1, 100, 200).width).toEqual(100);
  expect(new Rect(0, 1, 100, 200).height).toEqual(200);
});

test('should convert from a string', () => {
  expect(Rect.of('0 1  100    200')).toEqual(new Rect(0, 1, 100, 200));
  expect(Rect.of('0, 1, 100, 200')).toBe(undefined);
});

test('should clone a new object', () => {
  const rect = Rect.of('0 1 100 200');
  expect(rect.clone()).toEqual(rect);
});
