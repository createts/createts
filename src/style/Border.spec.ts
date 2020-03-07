import { Color } from '../base/Color';
import { Border, BorderStyle } from './Border';

test('should parse border', () => {
  expect(Border.of('10px solid black')).toEqual(new Border(10, BorderStyle.SOLID, Color.BLACK));
  expect(Border.of('10px solid #fff')).toEqual(new Border(10, BorderStyle.SOLID, Color.WHITE));
  expect(Border.of('10px  solid   black')).toEqual(new Border(10, BorderStyle.SOLID, Color.BLACK));
  expect(Border.of('10px ', true)).toBeUndefined();
});
