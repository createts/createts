import { XObject } from '../components/XObject';
interface IAttributes {
    [key: string]: string;
}
interface INode {
    tag: string;
    attributes: IAttributes;
    children: INode[];
    text?: string;
    parent?: INode;
}
export declare class Parser {
    static registerTag(tag: string, componentClass: typeof XObject): void;
    private static tagMap;
    parse(content: string): XObject[];
    parseHtml(content: string): INode[];
    private trimTextNode;
    private node2Component;
    private isSplitter;
    private isCloseTag;
    private addAttr;
}
export {};
//# sourceMappingURL=Parser.d.ts.map