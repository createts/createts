export declare function any(): (_?: any) => boolean;
export declare function eq(value: any): (_?: any) => boolean;
declare class Mocked {
    private calls;
    private expections;
    onCall(method: string, args: any): any;
    times(method: string, ...args: any): number;
    reset(): void;
    resetTimes(): void;
    on(method: string, ...args: any): {
        returns: (_: any) => void;
    };
}
export declare class MockCanvasRenderingContext2D extends Mocked implements CanvasRenderingContext2D {
    canvas: HTMLCanvasElement;
    globalAlpha: number;
    globalCompositeOperation: string;
    drawImage(image: any, sx: any, sy: any, sw?: any, sh?: any, dx?: any, dy?: any, dw?: any, dh?: any): any;
    beginPath(): void;
    clip(path?: any, fillRule?: any): any;
    fill(path?: any, fillRule?: any): any;
    isPointInPath(path: any, x: any, y?: any, fillRule?: any): any;
    isPointInStroke(path: any, x: any, y?: any): any;
    stroke(path?: any): any;
    fillStyle: string | CanvasGradient | CanvasPattern;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
    createPattern(image: CanvasImageSource, repetition: string): CanvasPattern;
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
    filter: string;
    createImageData(sw: any, sh?: any): any;
    getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
    putImageData(imagedata: any, dx: any, dy: any, dirtyX?: any, dirtyY?: any, dirtyWidth?: any, dirtyHeight?: any): any;
    imageSmoothingEnabled: boolean;
    imageSmoothingQuality: ImageSmoothingQuality;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    closePath(): void;
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
    lineTo(x: number, y: number): void;
    moveTo(x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    rect(x: number, y: number, w: number, h: number): void;
    lineCap: CanvasLineCap;
    lineDashOffset: number;
    lineJoin: CanvasLineJoin;
    lineWidth: number;
    miterLimit: number;
    getLineDash(): number[];
    setLineDash(segments: any): any;
    clearRect(x: number, y: number, w: number, h: number): void;
    fillRect(x: number, y: number, w: number, h: number): void;
    strokeRect(x: number, y: number, w: number, h: number): void;
    shadowBlur: number;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    restore(): void;
    save(): void;
    fillText(text: string, x: number, y: number, maxWidth?: number): void;
    measureText(text: string): TextMetrics;
    strokeText(text: string, x: number, y: number, maxWidth?: number): void;
    direction: CanvasDirection;
    font: string;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
    getTransform(): DOMMatrix;
    resetTransform(): void;
    rotate(angle: number): void;
    scale(x: number, y: number): void;
    setTransform(a?: any, b?: any, c?: any, d?: any, e?: any, f?: any): any;
    transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    translate(x: number, y: number): void;
    drawFocusIfNeeded(path: any, element?: any): any;
    scrollPathIntoView(path?: any): any;
}
export declare class MockCanvas extends Mocked {
    width: number;
    height: number;
    getContext(type: string): any;
    addEventListener(type: string, callback: any): any;
    asCanvas(): HTMLCanvasElement;
}
export {};
//# sourceMappingURL=MockCanvas.d.ts.map