import { HtmlParser } from '../parser/HtmlParser';
import { TextAlign, TextBorderPosition } from '../style/Style';
import { IXObjectOptions, XObject, XObjectEvent } from './XObject';

/**
 * A Text object is used to display text with specified styles like font size, font family, color,
 * etc.
 *
 * Text in this element can not be wrapped automatically, you must add '\n' by yourself in case of
 * wrapping the text; and Text element can not be 'inline' either, which means text siblings are
 * displayed block by block.
 *
 * Code example:
 *
 * ```typescript
 * const html = "<text style='color:red'>hello</text><text style='color:green'>world</text>";
 * container.load(html);
 * ```
 */
export class Text extends XObject {
  /**
   * The text of this element.
   */
  private text: string = '';

  /**
   * Create a text element with given options.
   * @param options 'text' attribute of this option will be the 'text' of this element.
   */
  constructor(options?: IXObjectOptions) {
    super(options);
    this.text = (options && options.text) || '';
  }

  /**
   * Returns the default text style:
   * 1. **color**: black.
   * 1. **font-size**: 26px.
   * @returns the default text style.
   */
  getDefaultStyle(): { [key: string]: string | number } | undefined {
    return {
      color: 'black',
      fontSize: 26
    };
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
    if (this.text === '' || !this.style.font) {
      return;
    }

    const rect = this.getContentRect();

    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = this.style.textAlign;
    ctx.fillStyle = this.style.color.toString();
    ctx.font = this.style.font.toString();

    // Set border.
    const hasBorder = this.style.textBorder && this.style.textBorder.isEnable();
    if (hasBorder) {
      ctx.strokeStyle = this.style.textBorder.color.toString();
      ctx.lineWidth = this.style.textBorder.width;
    }

    // Set shadow
    if (this.style.textShadow && this.style.textShadow.isEnable()) {
      ctx.shadowBlur = this.style.textShadow.blur;
      ctx.shadowColor = this.style.textShadow.color.toString();
      ctx.shadowOffsetX = this.style.textShadow.offsetX;
      ctx.shadowOffsetY = this.style.textShadow.offsetY;
    }

    let x;
    if (this.style.textAlign === TextAlign.RIGHT) {
      x = rect.x + rect.width;
    } else if (this.style.textAlign === TextAlign.CENTER) {
      x = rect.x + rect.width / 2;
    } else {
      x = rect.x;
    }

    let y = rect.y;
    const lines = this.text.split('\n');
    const lineHeight = this.getLineHeight();
    y += lineHeight / 2;

    for (const line of lines) {
      if (line.trim() !== '') {
        if (hasBorder) {
          if (this.style.textBorderPosition === TextBorderPosition.OUTER) {
            ctx.strokeText(line, x, y);
            ctx.fillText(line, x, y);
          } else {
            ctx.fillText(line, x, y);
            ctx.strokeText(line, x, y);
          }
        } else {
          ctx.fillText(line, x, y);
        }
      }
      y += lineHeight;
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
    if (this.style.font) {
      const lines = this.text.split('\n');
      const contentRect = this.getContentRect();
      let textWidth = 0;
      for (const line of lines) {
        textWidth = Math.max(textWidth, this.style.font.measureTextWidth(line));
      }
      if (textWidth > contentRect.width) {
        this.rect.width += textWidth - contentRect.width;
      }

      const textHeight = this.getLineHeight() * lines.length;
      if (textHeight > contentRect.height) {
        this.rect.height += textHeight - contentRect.height;
      }
    }
  }
}

HtmlParser.registerTag('text', Text);
