declare type Func = {
    name: string;
    arguments: string[];
};
export declare class FunctionParser {
    private static isBlank;
    static parse(content: string, silent?: boolean): Func | undefined;
}
export {};
//# sourceMappingURL=FunctionParser.d.ts.map