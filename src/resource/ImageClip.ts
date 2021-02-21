import { Matrix2D, Rect } from '../base';
import { ResourceRegistry } from './ResourceRegistry';

/**
 * Rotation types for an image clip, only 0/90/180/270 deg is supported.
 */
export enum ImageClipRotation {
  Rotation0 = 0,
  Rotation90 = 90,
  Rotation180 = 180,
  Rotation270 = 270
}

const REG_IMAGE_CLIP = /^(.+)#([0-9\.]+),([0-9\.]+),([0-9\.]+),([0-9\.]+)@?(0|90|180|270)?$/;

export class ImageClip {
  private src?: string;
  private image?: HTMLImageElement;
  private rect?: Rect;
  private rotation: ImageClipRotation;
  private scale = 1;

  /**
   * Contruct an ImageClip instance from a string, the sytax is
   * ```
   * <image url>#<x>,<y>,<width>,<height>@<rotation>)
   * ```
   *
   * It can be used in Img type, i.e.
   * ```html
   * <img src='sample.png#10,20,200,300@270' />
   * <img src='sample.png#10,20,200,300' />
   * <img src='sample.png' />
   * ```
   * @param clip a encoded string presents an image clip.
   */
  public static of(clip: string, silent = false): ImageClip {
    const matched = clip.match(REG_IMAGE_CLIP);
    if (!matched) {
      if (clip.indexOf('#') < 0) {
        return new ImageClip(clip);
      } else if (!silent) {
        console.warn(`invalid image clip:${clip}`);
      }
      return undefined;
    }
    return new ImageClip(
      matched[1],
      new Rect(
        parseFloat(matched[2]),
        parseFloat(matched[3]),
        parseFloat(matched[4]),
        parseFloat(matched[5])
      ),
      (matched[6] ? parseInt(matched[6]) : 0) as ImageClipRotation
    );
  }

  public constructor(
    src: string,
    rect?: Rect,
    rotation: ImageClipRotation = ImageClipRotation.Rotation0,
    scale = 1.0
  ) {
    this.src = src;
    this.rect = rect;
    this.rotation = rotation;
    this.scale = scale;
  }

  public ready(): boolean {
    return !!this.getImage();
  }

  public getSrc(): string {
    return this.src;
  }

  public setImage(image: HTMLImageElement): ImageClip {
    this.image = image;
    return this;
  }

  public setSrc(src: string): ImageClip {
    this.src = src;
    return this;
  }

  public getRect(): Rect {
    return this.rect;
  }

  public getRotation(): ImageClipRotation {
    return this.rotation;
  }

  public getScale(): number {
    return this.scale;
  }

  public setRect(rect: Rect): ImageClip {
    this.rect = rect;
    return this;
  }

  public setRotation(rotation: ImageClipRotation): ImageClip {
    this.rotation = rotation;
    return this;
  }

  public setScale(scale: number): ImageClip {
    this.scale = scale;
    return this;
  }

  private getImage(): HTMLImageElement | undefined {
    return this.image
      ? this.image
      : (ResourceRegistry.DefaultInstance.get(this.src) as HTMLImageElement);
  }

  public getWidth(): number {
    if (!this.rect) {
      const image = this.getImage();
      return image ? (this.needChangeSize() ? image.height : image.width) * this.scale : 0;
    } else {
      return this.scale * (this.needChangeSize() ? this.rect.height : this.rect.width);
    }
  }

  private needChangeSize() {
    return (
      this.rotation === ImageClipRotation.Rotation90 ||
      this.rotation === ImageClipRotation.Rotation270
    );
  }

  public getHeight(): number {
    if (!this.rect) {
      const image = this.getImage();
      return image ? (this.needChangeSize() ? image.width : image.height) * this.scale : 0;
    } else {
      return this.scale * (this.needChangeSize() ? this.rect.width : this.rect.height);
    }
  }

  public draw(ctx: CanvasRenderingContext2D, rect: Rect, src?: Rect) {
    const image = this.getImage();
    if (!image) return;

    let x = this.rect ? this.rect.x : 0;
    let y = this.rect ? this.rect.y : 0;
    let w = this.rect ? this.rect.width : image.width;
    let h = this.rect ? this.rect.height : image.height;
    if (src) {
      switch (this.rotation) {
        case ImageClipRotation.Rotation0:
          x += src.x;
          y += src.y;
          w = src.width;
          h = src.height;
          break;
        case ImageClipRotation.Rotation90:
          x += w - src.y - src.height;
          y += src.x;
          w = src.height;
          h = src.width;
          break;
        case ImageClipRotation.Rotation180:
          x += w - src.x - src.width;
          y += h - src.y - src.height;
          w = src.width;
          h = src.height;
          break;
        case ImageClipRotation.Rotation270:
          x += src.y;
          y += h - src.x - src.width;
          w = src.height;
          h = src.width;
          break;
      }
    }

    switch (this.rotation) {
      case ImageClipRotation.Rotation0:
        ctx.drawImage(image, x, y, w, h, rect.x, rect.y, rect.width, rect.height);
        break;
      case ImageClipRotation.Rotation90:
        ctx.save();
        let mtx = new Matrix2D();
        ctx.translate(rect.x, rect.y);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(image, x, y, w, h, -rect.height, 0, rect.height, rect.width);
        ctx.restore();
        break;
      case ImageClipRotation.Rotation180:
        ctx.save();
        ctx.translate(rect.x, rect.y);
        ctx.rotate(Math.PI);
        ctx.drawImage(image, x, y, w, h, -rect.width, -rect.height, rect.width, rect.height);
        ctx.restore();
        break;
      case ImageClipRotation.Rotation270:
        ctx.save();
        ctx.translate(rect.x, rect.y);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(image, x, y, w, h, 0, -rect.width, rect.height, rect.width);
        ctx.restore();
        break;
    }
  }

  public clone(): ImageClip {
    return new ImageClip(this.src, this.rect.clone(), this.rotation, this.scale).setImage(
      this.image
    );
  }
}
