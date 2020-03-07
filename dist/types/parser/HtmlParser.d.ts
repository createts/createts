import { XObject } from '../components/XObject';
export declare class HtmlParser {
    static registerTag(tag: string, componentClass: typeof XObject): void;
    private static tagMap;
    parse(content: string): XObject[];
    private parseHtml;
    private trimTextNode;
    private node2Component;
    private isSplitter;
    private isCloseTag;
    private addAttr;
}
//# sourceMappingURL=HtmlParser.d.ts.map