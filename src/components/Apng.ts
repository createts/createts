import { HtmlParser } from '../parser/HtmlParser';
import { ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { Sprite, SpriteSheet } from './Sprite';
import { IXObjectOptions } from './XObject';

export class Apng extends Sprite {
  constructor(options?: IXObjectOptions) {
    super(options);
    if (options && options.attributes) {
      if (options.attributes.src) {
        ResourceRegistry.DefaultInstance.add(options.attributes.src, ResourceType.APNG)
          .then((opt: SpriteSheet) => {
            this.setSpriteSheet(opt).play();
          })
          .catch(e => {
            console.warn('failed to load:' + options.attributes.src, e);
          });
      }
    }
  }
}

HtmlParser.registerTag('apng', Apng);
