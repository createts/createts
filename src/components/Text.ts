import { HtmlParser } from '../parser/HtmlParser';
import { TextAlign, TextBorderPosition } from '../style/Style';
import { IXObjectOptions, XObject } from './XObject';

export class Text extends XObject {
  private text: string = '';

  constructor(options?: IXObjectOptions) {
    super(options);
    this.text = (options && options.text) || '';
  }

  public setText(text: string) {
    this.text = text;
  }

  public getText(): string {
    return this.text;
  }

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
