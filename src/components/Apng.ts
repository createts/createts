import { ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { Sprite, SpriteOption } from './Sprite';
import { IXObjectOptions } from './XObject';

export class Apng extends Sprite {
  constructor(options?: IXObjectOptions) {
    super(options);
    if (options && options.attributes) {
      if (options.attributes.src) {
        ResourceRegistry.DefaultInstance.add(options.attributes.src, ResourceType.APNG).then(
          (opt: SpriteOption) => {
            this.setOption(opt).play();
          }
        );
      }
    }
  }
}
