import { Rect } from '../base/Rect';
import { HtmlParser } from '../parser/HtmlParser';
import { ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { TextAlign, TextBorderPosition } from '../style/Style';
import { DrawUtils } from '../utils/DrawUtils';
import { SpriteFrame } from './Sprite';
import { IXObjectOptions, XObject, XObjectEvent } from './XObject';

/**
 * The definition of BitmapTextSheet, a BitmapTextSheet contains the mapping between characters and
 * images, including character size, image position, render target, etc.
 */
export type BitmapTextSheet = {
  /**
   * If set, it means width of each character.
   */
  width?: number;
  /**
   * If set, it means height of each character.
   */
  height?: number;
  /**
   * The source of image which contains pictures of each text, it is optional, the image can be
   * defined at each text instead of have one big image contains all.
   */
  url?: string;
  /**
   * The image to draw into the context.
   */
  image?: HTMLImageElement;
  /**
   * A list of texts definitions.
   */
  texts: { [key: string]: SpriteFrame };
  /**
   * The gap between characters.
   */
  gapX?: number;
  /**
   * The gap between lines.
   */
  gapY?: number;
};

/**
 * A BitmapText object is used to display text with specified image, it is used to render the text
 * by a pre-rendered picture, and no font needed.
 *
 * Before using BitmapText, you need to create a JSON file contains the information of each
 * character.
 *
 * Code example:
 *
 * ```json
 * {
 *   "url": "./numbers.png",
 *   "texts": {
 *     "0": { "srcX": 0, "srcY": 0, "srcWidth": 28, "srcHeight": 34 },
 *     "1": { "srcX": 28, "srcY": 0, "srcWidth": 15, "srcHeight": 34 },
 *     "2": { "srcX": 43, "srcY": 0, "srcWidth": 21, "srcHeight": 34 },
 *     "3": { "srcX": 64, "srcY": 0, "srcWidth": 18, "srcHeight": 34 },
 *     "4": { "srcX": 82, "srcY": 0, "srcWidth": 23, "srcHeight": 34 },
 *     "5": { "srcX": 105, "srcY": 0, "srcWidth": 20, "srcHeight": 34 },
 *     "6": { "srcX": 125, "srcY": 0, "srcWidth": 26, "srcHeight": 34 },
 *     "7": { "srcX": 151, "srcY": 0, "srcWidth": 21, "srcHeight": 34 },
 *     "8": { "srcX": 172, "srcY": 0, "srcWidth": 24, "srcHeight": 34 },
 *     "9": { "srcX": 196, "srcY": 0, "srcWidth": 24, "srcHeight": 34 },
 *     ".": { "srcX": 220, "srcY": 0, "srcWidth": 10, "srcHeight": 34 }
 *   }
 * }
 * ```
 *
 * ```typescript
 * const html = "<bitmaptext src='numbers.json'>12.34</bitmaptext>";
 * container.load(html);
 * ```
 */
export class BitmapText extends XObject {
  /**
   * The text of this element.
   */
  private text: string = '';

  private bitmapTextSheet?: BitmapTextSheet;

  /**
   * Create a BitmapText element with given options.
   * @param options 'text' attribute of this option will be the 'text' of this element; if there is
   * a 'src' attribute in the option, the bitmapTextSheet attribute will be loaded from here.
   */
  constructor(options?: IXObjectOptions) {
    super(options);
    if (options) {
      this.text = options.text || '';
      if (options.attributes && options.attributes.src) {
        ResourceRegistry.DefaultInstance.add(options.attributes.src, ResourceType.JSON).then(
          (json) => {
            this.setBitmapTextSheet(json);
          }
        );
      }
    }
  }

  /**
   * Update the bitmapTextSheet of this element, and any image url in this bitmapTextSheet will be
   * loaded automatically.
   * @param bitmapTextSheet the new BitmapTextSheet.
   */
  public setBitmapTextSheet(bitmapTextSheet?: BitmapTextSheet) {
    this.bitmapTextSheet = bitmapTextSheet;
    if (this.bitmapTextSheet) {
      if (this.bitmapTextSheet.url) {
        ResourceRegistry.DefaultInstance.add(this.bitmapTextSheet.url, ResourceType.IMAGE).then(
          () => {
            this.dispatchEvent(new XObjectEvent('update', true, true, this));
          }
        );
      }
      for (const text in this.bitmapTextSheet.texts) {
        const frame = this.bitmapTextSheet.texts[text];
        if (frame.url) {
          ResourceRegistry.DefaultInstance.add(frame.url, ResourceType.IMAGE).then(() => {
            this.dispatchEvent(new XObjectEvent('update', true, true, this));
          });
        }
      }
    }
  }

  /**
   * Update the text of this element, if the new text is different with current text, update the
   * text and dispatch an 'update' event.
   * @param text the new text.
   */
  public setText(text: string) {
    if (this.text !== text) {
      this.text = text;
      this.dispatchEvent(new XObjectEvent('update', true, true, this));
    }
  }

  /**
   * Returns the text of this element.
   * @returns Text of this element.
   */
  public getText(): string {
    return this.text;
  }

  /**
   * Draw the text into given canvas context.
   * @param ctx The canvas rendering context of stage canvas.
   */
  public drawContent(ctx: CanvasRenderingContext2D) {
    if (
      this.text === '' ||
      !this.bitmapTextSheet ||
      this.rect.width <= 0 ||
      this.rect.height <= 0
    ) {
      return;
    }

    const contentRect = this.getContentRect();
    const lines = this.text.split('\n');

    ctx.save();
    for (const line of lines) {
      let height = this.bitmapTextSheet.height || 0;
      let w = 0;
      for (const ch of line) {
        const text = this.bitmapTextSheet.texts[ch];
        if (text) {
          const size = DrawUtils.getFrameSize(text, this.bitmapTextSheet);
          w += size.width + (this.bitmapTextSheet.gapX || 0);
        }
      }
      let x = contentRect.x;
      switch (this.style.textAlign) {
        case TextAlign.CENTER:
          x += Math.max(0, (contentRect.width - w) / 2);
          break;
        case TextAlign.RIGHT:
          x += contentRect.width - w;
      }
      let y = contentRect.y;
      for (const ch of line) {
        const text = this.bitmapTextSheet.texts[ch];
        if (text) {
          const size = DrawUtils.getFrameSize(text, this.bitmapTextSheet);
          const rect = new Rect(x, y, size.width, size.height);
          DrawUtils.drawFrame(ctx, rect, text, this.bitmapTextSheet);
          x += rect.width + (this.bitmapTextSheet.gapX || 0);
          height = Math.max(height, size.height);
        }
      }
      y += height + (this.bitmapTextSheet.gapY || 0);
    }
    ctx.restore();
    return true;
  }

  /**
   * Calculates size of current object, if there is no width or height specified in element style,
   * system will calculate the text width and height by text and font size.
   */
  public layout() {
    super.layout();
    if (this.bitmapTextSheet) {
      const lines = this.text.split('\n');
      const contentRect = this.getContentRect();
      let maxWidth = 0;
      let maxHeight = 0;
      for (const line of lines) {
        let width = 0;
        let height = this.bitmapTextSheet.height || 0;
        for (const ch of line) {
          const text = this.bitmapTextSheet.texts[ch];
          const size = DrawUtils.getFrameSize(text, this.bitmapTextSheet);
          if (width > 0 && !isNaN(this.bitmapTextSheet.gapX)) width += this.bitmapTextSheet.gapX;
          width += size.width;
          height = Math.max(height, size.height);
        }
        if (maxHeight > 0 && !isNaN(this.bitmapTextSheet.gapY)) {
          maxHeight += this.bitmapTextSheet.gapY;
        }
        maxHeight += height;
        maxWidth = Math.max(maxWidth, width);
      }

      if (maxWidth > contentRect.width) {
        this.rect.width += maxWidth - contentRect.width;
      }
      if (maxHeight > contentRect.height) {
        this.rect.height += maxHeight - contentRect.height;
      }
    }
  }
}

HtmlParser.registerTag('bitmaptext', BitmapText);
