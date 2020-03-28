import { Rect } from '../base/Rect';
import { ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { IXObjectOptions, XObject } from './XObject';

export class Img extends XObject {
  private src?: string;
  private image?: HTMLImageElement;
  private sourceRect?: Rect;

  constructor(options?: IXObjectOptions) {
    super(options);
    if (options && options.attributes) {
      if (options.attributes.src) {
        this.src = options.attributes.src;
        ResourceRegistry.DefaultInstance.add(this.src, ResourceType.IMAGE);
      }
      if (options.attributes.sourcerect) {
        this.sourceRect = Rect.of(options.attributes.sourcerect);
      }
    }
  }

  public setSrc(src: string): Img {
    this.src = src;
    return this;
  }

  public setImage(image: HTMLImageElement): Img {
    this.image = image;
    return this;
  }

  public setSourceRect(sourceRect: Rect): Img {
    this.sourceRect = sourceRect;
    return this;
  }

  public drawContent(ctx: CanvasRenderingContext2D) {
    let image: HTMLImageElement;
    if (this.image) {
      image = this.image;
    } else if (this.src) {
      image = ResourceRegistry.DefaultInstance.get(this.src) as HTMLImageElement;
    }

    if (!image) {
      return;
    }
    const rect = this.getContentRect();
    if (this.sourceRect) {
      ctx.drawImage(
        image,
        this.sourceRect.x,
        this.sourceRect.y,
        this.sourceRect.width,
        this.sourceRect.height,
        rect.x,
        rect.y,
        rect.width,
        rect.height
      );
    } else {
      ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);
    }
  }
}
