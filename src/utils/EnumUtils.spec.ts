import { EnumUtils } from './EnumUtils';

enum TestEnum {
  V1 = 'v1',
  V2 = 'v2'
}

test('should convert string to TestEnum', () => {
  expect(EnumUtils.fromString(TestEnum, 'v1', TestEnum.V2)).toEqual(TestEnum.V1);
  expect(EnumUtils.fromString(TestEnum, 'v2', TestEnum.V2)).toEqual(TestEnum.V2);
  expect(EnumUtils.fromString(TestEnum, 'v', TestEnum.V2)).toEqual(TestEnum.V2);
});

test('should convert string to TestEnum or undefined', () => {
  expect(EnumUtils.fromStringOrUndefined(TestEnum, 'v1')).toEqual(TestEnum.V1);
  expect(EnumUtils.fromStringOrUndefined(TestEnum, 'v2')).toEqual(TestEnum.V2);
  expect(EnumUtils.fromStringOrUndefined(TestEnum, 'v')).toBeUndefined();
});
