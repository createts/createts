import { BaseValue } from '../base/BaseValue';
import { Color } from '../base/Color';
import { Resource, ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { Background, BackgroundClip, URLSource } from './Background';

// Disable loading image.
// TODO: move image loading while attach style to element?
ResourceRegistry.DefaultInstance.add = (url: string, type: ResourceType) => {
  return new Promise<Resource>((resolve, reject) => {
    resolve(new Image());
  });
};

test('should parse color', () => {
  const background = Background.of('#ffffff');
  expect(background.color).toEqual(Color.WHITE);
});

test('should parse image layer', () => {
  const background = Background.of('red left 5% / 15% 60% repeat-x url("./star.png")');
  expect(background.color).toEqual(Color.RED);
  expect(background.image[0]).toEqual(URLSource.of(['./star.png']));
  expect(background.repeat[0]).toEqual({ x: 'repeat', y: 'no-repeat' });
  expect(background.clip[0]).toEqual(BackgroundClip.CONTENT_BOX);
  expect(background.origin[0]).toEqual(BackgroundClip.PADDING_BOX);
  expect(background.size[0]).toEqual({
    xType: 'value',
    x: BaseValue.of('15%'),
    yType: 'value',
    y: BaseValue.of('60%')
  });
  expect(background.position[0]).toEqual({
    xDir: 'left',
    x: BaseValue.ZERO,
    yDir: 'top',
    y: BaseValue.of('5%')
  });
});

test('should parse multiple image layer', () => {
  const background = Background.of(
    'red left 5% / 15% 60% repeat-x url("./star.png"), no-repeat center/contain url("./createts.png")'
  );
  expect(background.color).toEqual(Color.RED);
  expect(background.image[0]).toEqual(URLSource.of(['./star.png']));
  expect(background.repeat[0]).toEqual({ x: 'repeat', y: 'no-repeat' });
  expect(background.clip[0]).toEqual(BackgroundClip.CONTENT_BOX);
  expect(background.origin[0]).toEqual(BackgroundClip.PADDING_BOX);
  expect(background.size[0]).toEqual({
    xType: 'value',
    x: BaseValue.of('15%'),
    yType: 'value',
    y: BaseValue.of('60%')
  });
  expect(background.position[0]).toEqual({
    xDir: 'left',
    x: BaseValue.ZERO,
    yDir: 'top',
    y: BaseValue.of('5%')
  });
  expect(background.image[1]).toEqual(URLSource.of(['./createts.png']));
  expect(background.repeat[1]).toEqual({ x: 'no-repeat', y: 'no-repeat' });
  expect(background.clip[1]).toEqual(BackgroundClip.CONTENT_BOX);
  expect(background.origin[1]).toEqual(BackgroundClip.PADDING_BOX);
  expect(background.size[1]).toEqual({
    xType: 'contain',
    x: BaseValue.ZERO,
    yType: 'contain',
    y: BaseValue.ZERO
  });
  expect(background.position[1]).toEqual({
    xDir: 'center',
    x: BaseValue.ZERO,
    yDir: 'center',
    y: BaseValue.ZERO
  });
});
