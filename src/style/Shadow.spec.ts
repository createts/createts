import { Color } from '../base/Color';
import { Shadow } from './Shadow';

test('should parse shadow', () => {
  expect(Shadow.of('10 20 30 red')).toEqual({
    offsetX: 10,
    offsetY: 20,
    blur: 30,
    color: Color.RED
  });
  expect(Shadow.of('10 20 30 rgb(255,0,0 ) ')).toEqual({
    offsetX: 10,
    offsetY: 20,
    blur: 30,
    color: Color.RED
  });
  expect(Shadow.of('10 20 red', true)).toBeUndefined();
});
