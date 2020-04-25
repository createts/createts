import { IXObjectOptions, XObject } from './XObject';
export declare class Text extends XObject {
    private text;
    constructor(options?: IXObjectOptions);
    getDefaultStyle(): {
        [key: string]: string | number;
    } | undefined;
    setText(text: string): void;
    getText(): string;
    drawContent(ctx: CanvasRenderingContext2D): boolean;
    layout(): void;
}
//# sourceMappingURL=Text.d.ts.map