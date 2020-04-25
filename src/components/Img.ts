import { Rect } from '../base/Rect';
import { HtmlParser } from '../parser/HtmlParser';
import { ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { IXObjectOptions, XObject, XObjectEvent } from './XObject';

export class Img extends XObject {
  private src?: string;
  private image?: HTMLImageElement;
  private sourceRect?: Rect;

  constructor(options?: IXObjectOptions) {
    super(options);
    if (options && options.attributes) {
      if (options.attributes.src) {
        this.setSrc(options.attributes.src);
      }
      if (options.attributes.sourcerect) {
        this.sourceRect = Rect.of(options.attributes.sourcerect);
      }
    }
  }

  public setSrc(src: string): Img {
    if (this.src !== src) {
      this.src = src;
      ResourceRegistry.DefaultInstance.add(this.src, ResourceType.IMAGE).then(image => {
        this.dispatchEvent(new XObjectEvent('update', true, true, this));
      });
    }
    return this;
  }

  public setImage(image: HTMLImageElement): Img {
    if (this.image !== image) {
      this.image = image;
      this.dispatchEvent(new XObjectEvent('update', true, true, this));
    }
    return this;
  }

  public setSourceRect(sourceRect: Rect): Img {
    this.sourceRect = sourceRect;
    return this;
  }

  /**
   * Calculates size of current object.
   */
  public calculateSize() {
    super.calculateSize();
    if (!this.style.width) {
      if (this.sourceRect) {
        this.rect.width = this.sourceRect.width;
      } else if (this.image) {
        this.rect.width = this.image.width;
      } else if (this.src) {
        const image = ResourceRegistry.DefaultInstance.get(this.src) as HTMLImageElement;
        if (image) {
          this.rect.width = image.width;
        }
      }
    }
    if (!this.style.height) {
      if (this.sourceRect) {
        this.rect.height = this.sourceRect.height;
      } else if (this.image) {
        this.rect.height = this.image.height;
      } else if (this.src) {
        const image = ResourceRegistry.DefaultInstance.get(this.src) as HTMLImageElement;
        if (image) {
          this.rect.height = image.height;
        }
      }
    }
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

HtmlParser.registerTag('img', Img);
HtmlParser.registerTag('image', Img);
