import { Matrix2D, Rect } from '../base';

/**
 * Rotation types for an image clip, only 0/90/180/270 deg is supported.
 */
export enum ImageClipRotation {
  Rotation0 = 0,
  Rotation90 = 90,
  Rotation180 = 180,
  Rotation270 = 270
}

export class ImageClip {
  private rect: Rect;
  private rotation: ImageClipRotation;

  public static of(clip: string): ImageClip {
    const pieces = clip.split(/\s+/);
    if (pieces.length != 4 && pieces.length != 5) {
      console.warn('invalid clip value:', clip);
      return undefined;
    }
    const x = parseFloat(pieces[0]);
    if (isNaN(x)) {
      console.warn('invalid clip value:', clip);
      return undefined;
    }
    const y = parseFloat(pieces[1]);
    if (isNaN(y)) {
      console.warn('invalid clip value:', clip);
      return undefined;
    }
    const width = parseFloat(pieces[2]);
    if (isNaN(width)) {
      console.warn('invalid clip value:', clip);
      return undefined;
    }
    const height = parseFloat(pieces[3]);
    if (isNaN(height)) {
      console.warn('invalid clip value:', clip);
      return undefined;
    }
    let rotation = 0;
    if (pieces.length > 4) {
      rotation = parseInt(pieces[4]);
      if (rotation !== 0 && rotation !== 90 && rotation !== 180 && rotation != 270) {
        console.warn('invalid clip value:', clip);
        return undefined;
      }
    }
    return new ImageClip(new Rect(x, y, width, height), rotation);
  }

  public constructor(rect: Rect, rotation: ImageClipRotation = ImageClipRotation.Rotation0) {
    this.rect = rect;
    this.rotation = rotation;
  }

  public setRect(rect: Rect) {
    this.rect = rect;
  }

  public setRotation(rotation: ImageClipRotation) {
    this.rotation = rotation;
  }

  public getWidth(): number {
    return this.rotation === ImageClipRotation.Rotation90 ||
      this.rotation === ImageClipRotation.Rotation270
      ? this.rect.height
      : this.rect.width;
  }

  public getHeight(): number {
    return this.rotation === ImageClipRotation.Rotation90 ||
      this.rotation === ImageClipRotation.Rotation270
      ? this.rect.width
      : this.rect.height;
  }

  public draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement, rect: Rect) {
    switch (this.rotation) {
      case ImageClipRotation.Rotation0:
        ctx.drawImage(
          image,
          this.rect.x,
          this.rect.y,
          this.rect.width,
          this.rect.height,
          rect.x,
          rect.y,
          rect.width,
          rect.height
        );
        break;
      case ImageClipRotation.Rotation90:
        ctx.save();
        let mtx = new Matrix2D().appendTransform(0, rect.height, 1, 1, 270, 0, 0, 0, 0);
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
        ctx.drawImage(
          image,
          this.rect.x,
          this.rect.y,
          this.rect.width,
          this.rect.height,
          rect.x,
          rect.y,
          rect.height,
          rect.width
        );
        ctx.restore();
        break;
      case ImageClipRotation.Rotation180:
        ctx.save();
        mtx = new Matrix2D().appendTransform(rect.width, rect.height, 1, 1, 180, 0, 0, 0, 0);
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
        ctx.drawImage(
          image,
          this.rect.x,
          this.rect.y,
          this.rect.width,
          this.rect.height,
          rect.x,
          rect.y,
          rect.width,
          rect.height
        );
        ctx.restore();
        break;
      case ImageClipRotation.Rotation270:
        ctx.save();
        mtx = new Matrix2D().appendTransform(rect.width, 0, 1, 1, 90, 0, 0, 0, 0);
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
        ctx.drawImage(
          image,
          this.rect.x,
          this.rect.y,
          this.rect.width,
          this.rect.height,
          rect.x,
          rect.y,
          rect.height,
          rect.width
        );
        ctx.restore();
        break;
    }
  }
}
