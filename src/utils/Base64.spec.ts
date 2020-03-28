import { Base64 } from './Base64';

function toArray(data: string): Uint8Array {
  const result: number[] = [];
  for (let i = 0; i < data.length; ++i) {
    result.push(data.charCodeAt(i));
  }
  return new Uint8Array(result);
}

test('should encode base64', () => {
  expect(Base64.encode([toArray('hello world')])).toEqual('aGVsbG8gd29ybGQ=');
  expect(Base64.encode([toArray('hello'), toArray(' '), toArray('world')])).toEqual(
    'aGVsbG8gd29ybGQ='
  );
  expect(
    Base64.encode([
      toArray('h'),
      toArray('e'),
      toArray('l'),
      toArray('l'),
      toArray(''),
      toArray('o'),
      toArray(' '),
      toArray('w'),
      toArray('o'),
      toArray('r'),
      toArray('l'),
      toArray('d'),
      toArray('')
    ])
  ).toEqual('aGVsbG8gd29ybGQ=');
});
