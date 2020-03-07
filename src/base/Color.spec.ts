import { Color } from './Color';

test('should parse hex value', () => {
  expect(Color.of('#fff')).toEqual(Color.WHITE);
  expect(Color.of('#000')).toEqual(Color.BLACK);
  expect(Color.of('#ffffff')).toEqual(Color.WHITE);
  expect(Color.of('#000000')).toEqual(Color.BLACK);
  expect(Color.of('#ffff')).toEqual(Color.WHITE);
  expect(Color.of('#000f')).toEqual(Color.BLACK);
  expect(Color.of('#ffffffff')).toEqual(Color.WHITE);
  expect(Color.of('#000000ff')).toEqual(Color.BLACK);
  expect(Color.of('#000000fff', true)).toBeUndefined();
  expect(Color.of('#00000', true)).toBeUndefined();
  expect(Color.of('#xxx', true)).toBeUndefined();
});

test('should convert by color name', () => {
  expect(Color.of('black')).toEqual(Color.BLACK);
  expect(Color.of('WHITE')).toEqual(Color.WHITE);
  expect(Color.of('White')).toEqual(Color.WHITE);
  expect(Color.of('badcolor', true)).toBeUndefined();
});

test('should convert rgb function', () => {
  expect(Color.of('rgb(0,0,0)')).toEqual(Color.BLACK);
  expect(Color.of('rgba(0,0,0,1)')).toEqual(Color.BLACK);
  expect(Color.of('rgba(0%,0,0,1)')).toEqual(Color.BLACK);
  expect(Color.of('rgba(0%,0%,0%,100%)')).toEqual(Color.BLACK);
  expect(Color.of('rgba("0%","0%",0%,100%)')).toEqual(Color.BLACK);
  expect(Color.of('rgba(0,0,0,.5)').a).toEqual(0.5);
  expect(Color.of('rgb()', true)).toBeUndefined();
  expect(Color.of('rgb(.,255,255), true', true)).toBeUndefined();
  expect(Color.of('rgb(.5x,255,255), true', true)).toBeUndefined();
  expect(Color.of('rgba(0%,0%,0%,88%)').a).toBe(0.88);
  expect(Color.of('rgba(0%,0%,0%,.88)').a).toBe(0.88);
});
