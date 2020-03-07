import { Font, FontStyle, FontVariant, FontWeight } from './Font';
import { LineHeight } from './LineHeight';

test('should parse border', () => {
  expect(Font.of('10px')).toEqual(
    new Font(FontStyle.NORMAL, FontVariant.NORMAL, FontWeight.NORMAL, 10, undefined, '')
  );
  expect(Font.of('bold italic 10px/16px Tahoma')).toEqual(
    new Font(
      FontStyle.ITALIC,
      FontVariant.NORMAL,
      FontWeight.BOLD,
      10,
      LineHeight.of('16px'),
      'Tahoma'
    )
  );
  expect(Font.of('', true)).toBeUndefined();
});
