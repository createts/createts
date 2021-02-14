import { IContainer, XObject } from '../components/XObject';

type Node = {
  tag: string;
  attributes: { [key: string]: string };
  children: Node[];
  text?: string;
  parent?: Node;
};

enum ParseState {
  START = 1,
  TAG = 2,
  TEXT = 3
}

enum AttrState {
  PENDING = 0,
  START = 1,
  NAME = 2,
  EQ = 3,
  VALUE = 4,
  VALUE_STARTED = 5
}

export class HtmlParser {
  public static registerTag(tag: string, componentClass: typeof XObject) {
    this.tagMap[tag.toLowerCase()] = componentClass;
  }

  private static tagMap: { [key: string]: typeof XObject } = {};

  public parse(content: string): XObject[] {
    const result: XObject[] = [];
    const nodes = this.parseHtml(content);
    for (const node of nodes) {
      const child = this.node2Component(node);
      if (child) {
        result.push(child);
      }
    }
    return result;
  }

  private parseHtml(content: string): Node[] {
    const nodes: Node[] = [];
    const queue: Node[] = [];
    const len = content.length;
    let state = ParseState.START;
    let tagStart = 0;
    let tag: string | null = null;
    let inQuota = false;
    let quota: string | null = null;
    let attrState = AttrState.PENDING;
    let attrStart = 0;
    let attrName: string = '';
    let attrQuota: string | null = null;
    let attr = {};

    let i = 0;
    for (; i < len; ++i) {
      const ch = content[i];
      switch (state) {
        case ParseState.START:
          if (ch === '<') {
            tagStart = i;
            tag = null;
            state = ParseState.TAG;
            attrState = AttrState.PENDING;
            attrStart = 0;
            attrName = '';
            attrQuota = null;
            attr = {};
          } else {
            tagStart = i;
            state = ParseState.TEXT;
          }
          break;
        case ParseState.TAG:
          if (
            !tag &&
            (this.isSplitter(ch) || ch === '>' || ch === '/' || ch === '"' || ch === "'")
          ) {
            tag = content.substring(tagStart + 1, i);
            attrState = AttrState.START;
          }
          if (tag === null) {
            break;
          }
          if (inQuota) {
            if (ch === quota) {
              inQuota = false;
            }
          } else {
            if (ch === "'" || ch === '"') {
              inQuota = true;
              quota = ch;
            }
          }
          if (ch === '>' && !inQuota) {
            switch (attrState) {
              case AttrState.NAME:
                attrName = content.substring(attrStart, i);
                this.addAttr(attr, attrName, '');
                break;
              case AttrState.EQ:
                this.addAttr(attr, attrName, '');
                break;
              case AttrState.VALUE:
              case AttrState.VALUE_STARTED:
                this.addAttr(attr, attrName, content.substring(attrStart, i));
                break;
            }
            if (tag.substring(0, 3) === '!--') {
              if (i - tagStart >= 6 && content.substring(i - 2, i) === '--') {
                state = ParseState.START;
              }
              break;
            }
            if (tag && tag[0] === '/') {
              tag = tag.substring(1);
              let find = false;
              for (const n of queue) {
                if (n.tag === tag) {
                  find = true;
                }
              }
              if (find) {
                while (queue.length > 0) {
                  const node = queue.pop();
                  if (!node || node.tag === tag) {
                    break;
                  }
                }
              }
              state = ParseState.START;
            } else {
              const node: Node = {
                children: [],
                tag,
                attributes: attr
              };
              attr = {};
              if (queue.length > 0) {
                node.parent = queue[queue.length - 1];
                queue[queue.length - 1].children.push(node);
              } else {
                nodes.push(node);
              }
              if (!this.isCloseTag(tag)) {
                queue.push(node);
              }
              state = ParseState.START;
            }
          } else {
            switch (attrState) {
              case AttrState.START:
                if (!this.isSplitter(ch) && ch !== '/') {
                  attrStart = i;
                  attrState = AttrState.NAME;
                }
                attrQuota = null;
                break;
              case AttrState.NAME:
                if (this.isSplitter(ch)) {
                  attrName = content.substring(attrStart, i);
                  attrState = AttrState.EQ;
                } else if (ch === '=') {
                  attrName = content.substring(attrStart, i);
                  attrStart = i + 1;
                  attrState = AttrState.VALUE;
                }
                break;
              case AttrState.EQ:
                if (this.isSplitter(ch)) {
                  break;
                }
                if (ch === '=') {
                  attrState = AttrState.VALUE;
                  attrStart = i + 1;
                } else {
                  this.addAttr(attr, attrName, '');
                  attrState = AttrState.START;
                }
                break;
              case AttrState.VALUE:
                if (this.isSplitter(ch)) {
                  break;
                }
                if (ch === '"' || ch === "'") {
                  attrQuota = ch;
                  attrStart = i + 1;
                } else {
                  attrQuota = null;
                  attrStart = i;
                }
                attrState = AttrState.VALUE_STARTED;
                break;
              case AttrState.VALUE_STARTED:
                let end = false;
                const attrEnd = i;
                if (attrQuota) {
                  if (ch === attrQuota) {
                    end = true;
                  }
                } else if (!attrQuota && this.isSplitter(ch)) {
                  end = true;
                }
                if (end) {
                  this.addAttr(attr, attrName, content.substring(attrStart, attrEnd));
                  attrName = '';
                  attrState = AttrState.START;
                }
                break;
            }
          }
          break;
        case ParseState.TEXT:
          if (ch === '<') {
            if (tagStart < i) {
              const text = content.substring(tagStart, i).trim();
              if (text.length > 0) {
                const node: Node = {
                  children: [],
                  tag: 'TEXT',
                  text,
                  attributes: {}
                };
                if (queue.length > 0) {
                  node.parent = queue[queue.length - 1];
                  queue[queue.length - 1].children.push(node);
                } else {
                  nodes.push(node);
                }
              }
            }
            state = ParseState.TAG;
            tag = null;
            tagStart = i;
            attrState = AttrState.PENDING;
            attrStart = 0;
            attrName = '';
            attrQuota = null;
            attr = {};
          }
          break;
      }
    }
    switch (state) {
      case ParseState.TEXT:
        if (tagStart < i) {
          const text = content.substring(tagStart, i).trim();
          if (text.length > 0) {
            const node: Node = {
              children: [],
              tag: 'TEXT',
              text,
              attributes: {}
            };
            if (queue.length > 0) {
              node.parent = queue[queue.length - 1];
              queue[queue.length - 1].children.push(node);
            } else {
              nodes.push(node);
            }
          }
        }
        break;
    }
    for (const node of nodes) {
      this.trimTextNode(node);
    }
    return nodes;
  }

  private trimTextNode(node: Node) {
    if (node.children.length === 1 && node.children[0].tag === 'TEXT') {
      node.text = node.children[0].text;
      node.children.length = 0;
    } else {
      for (const child of node.children) {
        this.trimTextNode(child);
      }
    }
  }

  private node2Component(node: Node): XObject | undefined {
    const type = HtmlParser.tagMap[node.tag.toLowerCase()];
    if (!type) {
      console.warn('unknown tag:' + node.tag.toLowerCase());
      return undefined;
    }

    const options = {
      attributes: node.attributes,
      text: node.text
    };
    const component = new type(options);
    if (node.children.length > 0) {
      if (component instanceof IContainer) {
        for (const child of node.children) {
          const childComponent = this.node2Component(child);
          if (childComponent) {
            (component as IContainer).addChild(childComponent);
          }
        }
      } else {
        console.warn('component is not a container:' + component);
      }
    }
    return component;
  }

  private isSplitter(ch: string): boolean {
    return ch === ' ' || ch === '\r' || ch === '\n' || ch === '\t';
  }

  private isCloseTag(tag: string): boolean {
    return tag === 'img';
  }

  private addAttr(attr: any, name: string, value: any) {
    attr[name.toLowerCase()] = value;
  }
}
