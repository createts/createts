import { URLUtils } from './URLUtils';
test('should check url types', function () {
  expect(URLUtils.isAbsolute('https://a.com/')).toBe(true);
  expect(URLUtils.isAbsolute('/a.com/')).toBe(false);
});
test('should get domain', function () {
  expect(URLUtils.getDomain('https://a.com/hello')).toEqual('a.com');
  expect(URLUtils.getDomain('http://a.com/index.html')).toEqual('a.com');
  expect(URLUtils.getDomain('//a.com/index.html')).toEqual('a.com');
  expect(URLUtils.getDomain('//a.com:8080/index.html')).toEqual('a.com');
  expect(URLUtils.getDomain('/a.com/')).toBeUndefined();
});
test('should get origin', function () {
  expect(URLUtils.getOrigin('https://a.com/hello')).toEqual('https://a.com');
  expect(URLUtils.getOrigin('http://a.com/index.html')).toEqual('http://a.com');
  expect(URLUtils.getOrigin('//a.com/index.html')).toEqual('//a.com');
  expect(URLUtils.getOrigin('//a.com:8080/index.html')).toEqual('//a.com:8080');
  expect(URLUtils.getOrigin('/a.com/')).toBeUndefined();
});