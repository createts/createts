import { Rect } from '../base/Rect';
import { HtmlParser } from '../parser/HtmlParser';
import { ImageClip } from '../resource/ImageClip';
import { ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { IXObjectOptions, XObject, XObjectEvent } from './XObject';

export class Img extends XObject {
  private imageClip: ImageClip;

  constructor(options?: IXObjectOptions) {
    super(options);
    if (options && options.attributes) {
      if (options.attributes.src) {
        this.setSrc(options.attributes.src);
      }
      if (options.attributes.sourcerect) {
        this.setSourceRect(Rect.of(options.attributes.sourcerect));
      }
    }
    if (!this.imageClip) {
      this.imageClip = ImageClip.of('');
    }
  }

  public setSrc(src: string): Img {
    this.imageClip = ImageClip.of(src);
    ResourceRegistry.DefaultInstance.add(this.imageClip.getSrc(), ResourceType.IMAGE).then(
      (image) => {
        this.dispatchEvent(new XObjectEvent('update', true, true, this));
      }
    );
    return this;
  }

  public setImage(image?: HTMLImageElement): Img {
    this.imageClip.setImage(image);
    return this;
  }

  public setSourceRect(sourceRect: Rect): Img {
    this.imageClip.setRect(sourceRect);
    return this;
  }

  /**
   * Calculates size of current object.
   */
  public calculateSize() {
    super.calculateSize();
    if (!this.style.width) {
      this.rect.width = this.imageClip.getWidth();
    }
    if (!this.style.height) {
      this.rect.height = this.imageClip.getHeight();
    }
  }

  public drawContent(ctx: CanvasRenderingContext2D) {
    this.imageClip.draw(ctx, this.getContentRect());
  }
}

HtmlParser.registerTag('img', Img);
HtmlParser.registerTag('image', Img);
