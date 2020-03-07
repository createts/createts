import { BaseValue, BaseValueUnit } from './BaseValue';
test('should parse value', function () {
  expect(BaseValue.of('50%')).toEqual(new BaseValue(50, BaseValueUnit.PERCENTAGE));
  expect(BaseValue.of('BADVALUE', true)).toBe(undefined);
  expect(BaseValue.of('50')).toEqual(new BaseValue(50, BaseValueUnit.PX));
  expect(BaseValue.of(50)).toEqual(new BaseValue(50, BaseValueUnit.PX));
});
test('should convert to absolute value', function () {
  expect(BaseValue.of('50%').toAbsolute(10).numberValue).toEqual(5);
  expect(BaseValue.of('100').toAbsolute(10).numberValue).toEqual(100);
});
test('should convert to percentage value', function () {
  expect(BaseValue.of('50%').toPercentage(10)).toEqual(new BaseValue(50, BaseValueUnit.PERCENTAGE));
  expect(BaseValue.of('50').toPercentage(100)).toEqual(new BaseValue(50, BaseValueUnit.PERCENTAGE));
});
test('should convert to percentage value', function () {
  expect(BaseValue.of('50%').clone()).toEqual(BaseValue.of('50%'));
  expect(BaseValue.of('5').clone()).toEqual(BaseValue.of('5'));
});