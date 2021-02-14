class MethodCall {
  method: string;
  args: IArguments;
  timestamp: number;
  constructor(method: string, args: IArguments) {
    this.method = method;
    this.args = args;
    this.timestamp = Date.now();
  }
}

class Expectation {
  method: string;
  args: IArguments;
  returnValue?: any;
  constructor(method: string, args: IArguments, returnValue?: any) {
    this.method = method;
    this.args = args;
    this.returnValue = returnValue;
  }
}

export function any(): (_?: any) => boolean {
  return () => {
    return true;
  };
}

export function eq(value: any): (_?: any) => boolean {
  return (input) => {
    if (input.equals) {
      return input.equals(value);
    }
    return input === value;
  };
}

class Mocked {
  private calls: MethodCall[] = [];
  private expectations: Expectation[] = [];

  onCall(method: string, args: any): any {
    this.calls.push(new MethodCall(method, args));
    for (const expectation of this.expectations) {
      if (expectation.method === method && expectation.args.length === args.length) {
        let matched = true;
        for (let i = 0; i < args.length; ++i) {
          if (!expectation.args[i](args[i])) {
            matched = false;
            break;
          }
        }
        if (matched) {
          return expectation.returnValue;
        }
      }
    }
  }

  times(method: string, ...args: any) {
    let times = 0;
    for (const call of this.calls) {
      if (call.method === method && call.args.length === args.length) {
        let matched = true;
        for (let i = 0; i < args.length; ++i) {
          if (!args[i](call.args[i])) {
            matched = false;
            break;
          }
        }
        if (matched) {
          ++times;
        }
      }
    }
    return times;
  }

  reset() {
    this.calls.length = 0;
    this.expectations.length = 0;
  }

  resetTimes() {
    this.calls.length = 0;
  }

  on(method: string, ...args: any): { returns: (_: any) => void } {
    return {
      returns: (value) => {
        this.expectations.push(new Expectation(method, args, value));
      }
    };
  }
}

/**
 * A mock class of HTMLCanvas for test purpose. This class does not
 */
export class MockCanvasRenderingContext2D extends Mocked implements CanvasRenderingContext2D {
  canvas: HTMLCanvasElement;
  globalAlpha: number;
  globalCompositeOperation: string;

  drawImage(
    image: any,
    sx: any,
    sy: any,
    sw?: any,
    sh?: any,
    dx?: any,
    dy?: any,
    dw?: any,
    dh?: any
  ) {
    return this.onCall('drawImage', arguments);
  }

  beginPath(): void {
    return this.onCall('beginPath', arguments);
  }

  clip(path?: any, fillRule?: any) {
    return this.onCall('clip', arguments);
  }

  fill(path?: any, fillRule?: any) {
    return this.onCall('fill', arguments);
  }

  isPointInPath(path: any, x: any, y?: any, fillRule?: any) {
    return this.onCall('isPointInPath', arguments);
  }

  isPointInStroke(path: any, x: any, y?: any) {
    return this.onCall('isPointInStroke', arguments);
  }

  stroke(path?: any) {
    return this.onCall('stroke', arguments);
  }

  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;

  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    return this.onCall('createLinearGradient', arguments);
  }

  createPattern(image: CanvasImageSource, repetition: string): CanvasPattern {
    return this.onCall('createPattern', arguments);
  }

  createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number
  ): CanvasGradient {
    return this.onCall('createRadialGradient', arguments);
  }

  filter: string;
  createImageData(sw: any, sh?: any) {
    return this.onCall('createImageData', arguments);
  }

  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
    return this.onCall('getImageData', arguments);
  }

  putImageData(
    imagedata: any,
    dx: any,
    dy: any,
    dirtyX?: any,
    dirtyY?: any,
    dirtyWidth?: any,
    dirtyHeight?: any
  ) {
    return this.onCall('putImageData', arguments);
  }
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: ImageSmoothingQuality;
  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ): void {
    return this.onCall('arc', arguments);
  }
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    return this.onCall('arcTo', arguments);
  }
  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ): void {
    return this.onCall('bezierCurveTo', arguments);
  }
  closePath(): void {
    return this.onCall('closePath', arguments);
  }
  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ): void {
    return this.onCall('ellipse', arguments);
  }
  lineTo(x: number, y: number): void {
    return this.onCall('lineTo', arguments);
  }
  moveTo(x: number, y: number): void {
    return this.onCall('moveTo', arguments);
  }
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    return this.onCall('quadraticCurveTo', arguments);
  }
  rect(x: number, y: number, w: number, h: number): void {
    return this.onCall('rect', arguments);
  }
  lineCap: CanvasLineCap;
  lineDashOffset: number;
  lineJoin: CanvasLineJoin;
  lineWidth: number;
  miterLimit: number;
  getLineDash(): number[] {
    return this.onCall('getLineDash', arguments);
  }
  setLineDash(segments: any) {
    return this.onCall('setLineDash', arguments);
  }
  clearRect(x: number, y: number, w: number, h: number): void {
    return this.onCall('clearRect', arguments);
  }
  fillRect(x: number, y: number, w: number, h: number): void {
    return this.onCall('fillRect', arguments);
  }
  strokeRect(x: number, y: number, w: number, h: number): void {
    return this.onCall('strokeRect', arguments);
  }
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  restore(): void {
    return this.onCall('restore', arguments);
  }
  save(): void {
    return this.onCall('save', arguments);
  }
  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    return this.onCall('fillText', arguments);
  }
  measureText(text: string): TextMetrics {
    return this.onCall('measureText', arguments);
  }
  strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    return this.onCall('strokeText', arguments);
  }
  direction: CanvasDirection;
  font: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  getTransform(): DOMMatrix {
    return this.onCall('getTransform', arguments);
  }
  resetTransform(): void {
    return this.onCall('resetTransform', arguments);
  }
  rotate(angle: number): void {
    return this.onCall('rotate', arguments);
  }
  scale(x: number, y: number): void {
    return this.onCall('scale', arguments);
  }
  setTransform(a?: any, b?: any, c?: any, d?: any, e?: any, f?: any) {
    return this.onCall('setTransform', arguments);
  }
  transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    return this.onCall('transform', arguments);
  }
  translate(x: number, y: number): void {
    return this.onCall('translate', arguments);
  }
  drawFocusIfNeeded(path: any, element?: any) {
    return this.onCall('drawFocusIfNeeded', arguments);
  }
  scrollPathIntoView(path?: any) {
    return this.onCall('scrollPathIntoView', arguments);
  }
}

/**
 * A mock class of HTMLCanvas for test purpose.
 */
export class MockCanvas extends Mocked {
  public width: number;
  public height: number;

  getContext(type: string) {
    return this.onCall('getContext', arguments);
  }

  addEventListener(type: string, callback: any) {
    return this.onCall('addEventListener', arguments);
  }

  public asCanvas(): HTMLCanvasElement {
    return (this as any) as HTMLCanvasElement;
  }
}
