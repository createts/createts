export declare class ApngData {
    width: number;
    height: number;
    duration: number;
    numPlays: number;
    frames: ApngFrame[];
}
export declare class ApngFrame {
    left: number;
    top: number;
    width: number;
    height: number;
    delay: number;
    disposeOp: number;
    blendOp: number;
    dataParts: Uint8Array[];
    imageData: Blob | undefined;
    imageElement: HTMLImageElement | undefined;
}
export declare class ApngParser {
    static parse(buffer: ArrayBuffer, silent?: boolean): ApngData | undefined;
    private static toChunks;
    private static makeChunk;
    private static makeDWordArray;
}
//# sourceMappingURL=ApngParser.d.ts.map