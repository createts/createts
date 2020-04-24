import { HtmlParser } from '../parser/HtmlParser';
import { Display, Overflow, Position, TextAlign } from '../style/Style';
import { LayoutUtils } from '../utils/LayoutUtils';
import { XObject, XObjectEvent } from './XObject';

/**
 * A Container is a nestable display list that allows you to work with compound objects, it can be
 * use to build the tree structure of all the objects like DOM tree, and itself is also a XObject
 * so that it also supports style, event handling, etc.
 *
 * Code example:
 *
 * ```typescript
 * const container  = new Container();
 * container.css({width:100, height:200, display:'absolute', left:50});
 * const obj  = new XObject();
 * container.addChild(obj);
 * ```
 */
export class Container extends XObject {
  /**
   * A list of children elements.
   */
  public readonly children: XObject[] = [];

  /**
   * Finds the first child of this Container object by id.
   * @param id id to identify the child, undefined if not found.
   */
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

  /**
   * Draw content of this object and its children.
   * @param ctx The canvas rendering context of targeted canvas.
   */
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

  /**
   * Append child to this container.
   * @param child Child element to add the this container.
   * @returns The current instance. Useful for chaining method calls.
   */
  public addChild(child: XObject): Container {
    const parent = child.parent;
    if (parent === this) {
      if (this.children.length > 0 && this.children[this.children.length - 1] === child) {
        return this;
      }
      const idx = this.children.indexOf(child);
      this.children.splice(idx, 1);
      this.children.push(child);
      child.dispatchEvent(new XObjectEvent('moved', false, true, child));
      return this;
    } else {
      if (parent) {
        parent.removeChild(child);
      }
      child.parent = this;
      this.children.push(child);
      child.dispatchEvent(new XObjectEvent('added', false, true, child));
      return this;
    }
  }

  /**
   * Append a list of child to this container.
   * @param children List of child element to add the this container.
   * @returns The current instance. Useful for chaining method calls.
   */
  public addChildren(...children: XObject[]): Container {
    for (const child of children) {
      this.addChild(child);
    }
    return this;
  }

  /**
   * Append a child to this container with a specified position.
   * @param child Child element to add the this container.
   * @param index Position of this child to be added.
   * @returns The current instance. Useful for chaining method calls.
   */
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
      child.dispatchEvent(new XObjectEvent('moved', false, true, child));
      return this;
    } else {
      if (parent) {
        parent.removeChild(child);
      }
      child.parent = this;
      this.children.splice(index, 0, child);
      child.dispatchEvent(new XObjectEvent('added', false, true, child));
      return this;
    }
  }

  /**
   * Remove a child from this container, this function only checks the children directly belongs
   * to this container, not check recursively.
   * @param child Child to be removed, or undefined for a element is not child of this container.
   * @returns The removed child, or undefined if this element is not a child of this container.
   */
  public removeChild(child: XObject): XObject | undefined {
    const idx = this.children.indexOf(child);
    if (idx < 0) {
      return undefined;
    } else {
      this.children.splice(idx, 1);
      child.parent = undefined;
      child.dispatchEvent(new XObjectEvent('removed', false, true, child));
      return child;
    }
  }

  /**
   * Remove a child from this container with a specified position.
   * @param index Position of this child to be removed.
   * @returns The removed child, or undefined for a incorrect position;
   */
  public removeChildAt(index: number): XObject | null {
    if (index < 0 || index >= this.children.length) {
      return null;
    }
    const child = this.children[index];
    this.children.splice(index, 1);
    child.dispatchEvent(new XObjectEvent('removed', false, true, child));
    return child;
  }

  /**
   * Removes all children of this container.
   * @returns The current instance. Useful for chaining method calls.
   */
  public removeAllChildren(): Container {
    while (this.children.length > 0) {
      this.removeChildAt(0);
    }
    return this;
  }

  /**
   * Returns a child object by a specified position.
   * @param index the position of returned child.
   */
  public getChildAt(index: number): XObject {
    return this.children[index];
  }

  /**
   * Sort the children with a comparison function.
   * @param sortFunction The comparison function used to sort children.
   * @returns The current instance. Useful for chaining method calls.
   */
  public sortChildren(sortFunction: (a: XObject, b: XObject) => number): Container {
    this.children.sort(sortFunction);
    return this;
  }

  /**
   * Gets the the index of the given child in current container's children list, -1 if not found.
   * @param child The child to be found.
   * @returns The index of the given child in current container's children list, -1 if not found.
   */
  public getChildIndex(child: XObject): number {
    return this.children.indexOf(child);
  }

  /**
   * Swap the children at 2 specified positions.
   * @param index1 first position of 2 children.
   * @param index2 second position of 2 children.
   * @returns The current instance. Useful for chaining method calls.
   */
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
    o1.dispatchEvent(new XObjectEvent('moved', false, true, o1));
    o2.dispatchEvent(new XObjectEvent('moved', false, true, o2));
    return this;
  }

  /**
   * Swaps 2 specified children.
   * @param child1 first child to swap.
   * @param child2 second child to swap.
   * @returns The current instance. Useful for chaining method calls.
   */
  public swapChildren(child1: XObject, child2: XObject): Container {
    return this.swapChildrenAt(this.getChildIndex(child1), this.getChildIndex(child2));
  }

  /**
   * Calculates size of current container and layout its children.
   */
  public layout() {
    this.calculateSize();
    this.layoutChildren();
  }

  /**
   * Layouts current container's children.
   */
  public layoutChildren() {
    // Step1, layout all children
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

    // Step2, break children into lines
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

    // Step 3, arrange children
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
    // TODO: add css (min/max width) support.
    if (!this.style.width && contentWidth > contentRect.width) {
      this.rect.width += contentWidth - contentRect.width;
    }
    if (!this.style.height && contentHeight > contentRect.height) {
      this.rect.height += contentHeight - contentRect.height;
    }
    // Step 4, arrange absolutes
    for (const child of absolutes) {
      LayoutUtils.updatePositionForAbsoluteElement(child, this.rect.width, this.rect.height);
    }
  }

  /**
   * Find a child at the specified position.
   * @param {Number} x The x position in the container to test.
   * @param {Number} y The y position in the container to test.
   * @param eventEnabled Whether to ignore the child who is disabling for pointer events.
   * @returns The child object in the specified position, undefined if there is no any child at that position.
   */
  public getObjectUnderPoint(x: number, y: number, eventEnabled: boolean): XObject | undefined {
    const children = this.children;
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      if (!child.isVisible() || (eventEnabled && !child.isPointerEventsEnabled())) {
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

  /**
   * Parse the input html and load as children.
   * @param html The html to be parsed and loaded.
   * @param clear If true, clear the existing children before loading.
   * @returns The current instance. Useful for chaining method calls.
   */
  public load(html: string, clear: boolean = true): Container {
    if (clear) {
      this.removeAllChildren();
    }
    this.addChildren(...new HtmlParser().parse(html));
    return this;
  }

  /**
   * Returns a string representation of this object.
   * @returns a string representation of this object.
   */
  public toString() {
    return `[Container (id=${this.id})]`;
  }
}

HtmlParser.registerTag('container', Container);
HtmlParser.registerTag('div', Container);
