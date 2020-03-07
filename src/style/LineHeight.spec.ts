import { LineHeight, LineHeightType } from './LineHeight';

test('should parse line height', () => {
  expect(LineHeight.of('normal').type).toEqual(LineHeightType.NORMAL);
  expect(LineHeight.of('10px')).toEqual({ type: LineHeightType.LENGTH, value: 10 });
  expect(LineHeight.of('10')).toEqual({ type: LineHeightType.NUMBER, value: 10 });
  expect(LineHeight.of('20%')).toEqual({ type: LineHeightType.PERCENT, value: 20 });
  expect(LineHeight.of('aa', true)).toBeUndefined();
});
