import { ContainerUtils } from './ContainerUtils';
test('should check empty map', function () {
  expect(ContainerUtils.isEmpty(undefined)).toBe(true);
  expect(ContainerUtils.isEmpty({})).toBe(true);
  expect(ContainerUtils.isEmpty({
    a: 1
  })).toBe(false);
});