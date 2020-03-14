import { Display, Position, TextAlign } from '../style/Style';
import { LayoutUtils } from '../utils/LayoutUtils';
import { IXObjectOptions, TouchEvent, XObject } from './XObject';

export class Container extends XObject {
  public readonly children: XObject[] = [];

  constructor(opt?: IXObjectOptions) {
    super(opt);
  }

  public findById(id: string): XObject | undefined {
    if (this.id === id) {
      return this;
    }
    for (const child of this.children) {
      if (child.id === id) {
        return child;
      }
      if (child instanceof Container) {
        const find = child.findById(id);
        if (find) {
          return find;
        }
      }
    }

    return undefined;
  }

  public drawContent(ctx: CanvasRenderingContext2D) {
    const list = this.children.slice();
    for (const child of list) {
      if (!child.isVisible()) {
        continue;
      }
      ctx.save();
      child.updateContext(ctx);
      child.draw(ctx);
      ctx.restore();
    }
  }

  public addChild(child: XObject): Container {
    const parent = child.parent;
    if (parent === this) {
      if (this.children.length > 0 && this.children[this.children.length - 1] === child) {
        return this;
      }
      const idx = this.children.indexOf(child);
      this.children.splice(idx, 1);
      this.children.push(child);
      child.dispatchEvent(new TouchEvent(child, 'moved', false));
      return this;
    } else {
      if (parent) {
        parent.removeChild(child);
      }
      child.parent = this;
      this.children.push(child);
      child.dispatchEvent(new TouchEvent(child, 'added', false));
      return this;
    }
  }

  public addChildren(...children: XObject[]): Container {
    for (const child of children) {
      this.addChild(child);
    }
    return this;
  }

  public addChildAt(child: XObject, index: number): Container {
    const parent = child.parent;
    if (parent === this) {
      if (this.children[index] === child) {
        return this;
      }
      const current = this.children.indexOf(child);
      if (current > index) {
        this.children.splice(current, 1);
        this.children.splice(index, 0, child);
      } else {
        this.children.splice(index, 0, child);
        this.children.splice(current, 1);
      }
      child.dispatchEvent(new TouchEvent(child, 'moved', false));
      return this;
    } else {
      if (parent) {
        parent.removeChild(child);
      }
      child.parent = this;
      this.children.splice(index, 0, child);
      child.dispatchEvent(new TouchEvent(child, 'added', false));
      return this;
    }
  }

  public removeChild(child: XObject): XObject | null {
    const idx = this.children.indexOf(child);
    if (idx < 0) {
      return null;
    } else {
      this.children.splice(idx, 1);
      child.parent = undefined;
      child.dispatchEvent(new TouchEvent(child, 'removed', false));
      return child;
    }
  }

  public removeChildAt(index: number): XObject | null {
    if (index < 0 || index >= this.children.length) {
      return null;
    }
    const child = this.children[index];
    this.children.splice(index, 1);
    child.dispatchEvent(new TouchEvent(child, 'removed', false));
    return child;
  }

  public removeAllChildren(): Container {
    while (this.children.length > 0) {
      this.removeChildAt(0);
    }
    return this;
  }

  public getChildAt(index: number): XObject {
    return this.children[index];
  }

  public sortChildren(sortFunction: (a: XObject, b: XObject) => number): Container {
    this.children.sort(sortFunction);
    return this;
  }

  public getChildIndex(child: XObject): number {
    return this.children.indexOf(child);
  }

  public swapChildrenAt(index1: number, index2: number): Container {
    if (index1 < 0 || index1 >= this.children.length) {
      throw new Error('invalid index:' + index1);
    }
    if (index2 < 0 || index2 >= this.children.length) {
      throw new Error('invalid index:' + index2);
    }
    if (index1 === index2) {
      return this;
    }
    const o1 = this.children[index1];
    const o2 = this.children[index2];
    this.children[index1] = o2;
    this.children[index2] = o1;
    o1.dispatchEvent(new TouchEvent(o1, 'moved', false));
    o2.dispatchEvent(new TouchEvent(o2, 'moved', false));
    return this;
  }

  public swapChildren(child1: XObject, child2: XObject): Container {
    return this.swapChildrenAt(this.getChildIndex(child1), this.getChildIndex(child2));
  }

  public contains(child: XObject): boolean {
    while (child) {
      if (child === this) {
        return true;
      }
      if (!child.parent) {
        return false;
      }
      child = child.parent;
    }
    return false;
  }

  public layout() {
    this.calculateSize();
    this.layoutChildren();
  }

  public layoutChildren() {
    // Step1, calculate size
    this.calculateSize();

    // Step2, layout all children
    const absolutes = [];
    const relatives = [];

    const contentRect = this.getContentRect();
    let contentWidth = contentRect.width;

    for (const child of this.children) {
      if (!child.isVisible()) {
        continue;
      }
      child.layout();
      if (child.style.position === Position.ABSOLUTE || child.style.position === Position.FIXED) {
        absolutes.push(child);
      } else {
        relatives.push(child);
        contentWidth = Math.max(contentWidth, child.getOuterWidth());
      }
    }

    // Step3, break children into lines
    const lines: XObject[][] = [];
    let line: XObject[] = [];
    let lineWidth = 0;

    for (const child of relatives) {
      if (
        (line.length > 0 && child.style.display === Display.BLOCK) ||
        lineWidth + child.getOuterWidth() > contentWidth
      ) {
        // Break the current line
        lines.push(line);
        line = [];
        lineWidth = 0;
      }
      line.push(child);
      lineWidth += child.getOuterWidth();
    }
    if (line.length > 0) {
      lines.push(line);
    }

    // Step 4, arrange children
    const lineHeight = this.getLineHeight();
    let contentHeight = 0;
    for (const l of lines) {
      let lineMaxHeight = 0;
      lineWidth = 0;
      for (const child of l) {
        // Align to top
        child.rect.y =
          contentHeight +
          contentRect.y +
          (child.style.marginTop ? child.style.marginTop.getValue(this.rect.height) : 0);
        lineMaxHeight = Math.max(lineMaxHeight, child.getOuterHeight());
        lineWidth += child.getOuterWidth();
      }
      contentHeight += Math.max(lineHeight, lineMaxHeight);

      let x = contentRect.x;
      switch (this.style.textAlign) {
        case TextAlign.RIGHT:
          x = contentRect.x + contentWidth - lineWidth;
          break;
        case TextAlign.CENTER:
          x = contentRect.x + (contentWidth - lineWidth) / 2;
          break;
        default:
          x = contentRect.x;
      }
      for (const child of l) {
        child.rect.x =
          x + (child.style.marginLeft ? child.style.marginLeft.getValue(this.rect.width) : 0);
        x += child.getOuterWidth();
      }
    }

    // Update width/height
    // TODO: add css (min/max width, overflow) support.
    if (contentWidth > contentRect.width) {
      this.rect.width += contentWidth - contentRect.width;
    }
    if (contentHeight > contentRect.height) {
      this.rect.height += contentHeight - contentRect.height;
    }
    // Step 5, arrange absolutes
    for (const child of absolutes) {
      LayoutUtils.updatePositionForAbsoluteElement(child, this.rect.width, this.rect.height);
    }
  }

  public getObjectUnderPoint(x: number, y: number, eventEnabled: boolean): XObject | undefined {
    const children = this.children;
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      if (!child.isVisible() || (eventEnabled && !child.eventEnabled)) {
        continue;
      }
      const pt = this.localToLocal(x, y, child);
      if (child instanceof Container) {
        const result = child.getObjectUnderPoint(pt.x, pt.y, eventEnabled);
        if (result) {
          return result;
        }
      } else {
        if (child.hitTest(pt.x, pt.y)) {
          return child;
        }
      }
    }

    // No child match, try self
    if (this.hitTest(x, y)) {
      return this;
    }
    return undefined;
  }

  toString() {
    return `[Container (id=${this.id})]`;
  }
}
