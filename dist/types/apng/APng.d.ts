export declare class APng {
    width: number;
    height: number;
    duration: number;
    numPlays: number;
    frames: Frame[];
}
export declare class Frame {
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
//# sourceMappingURL=APng.d.ts.map