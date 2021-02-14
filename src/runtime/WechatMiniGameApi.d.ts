// -------------------------------------------------------------
// This is a sub set of wechat mini game api definition, visit
// https://developers.weixin.qq.com/minigame/dev/guide/
// for full apis.
// -------------------------------------------------------------

declare function requestAnimationFrame(callback: () => void): number;

declare interface WXSystemInfo {
  windowWidth: number;
  windowHeight: number;
}

declare interface RequestTask {
  abort(): void;
}

declare interface WX {
  createCanvas(): HTMLCanvasElement;
  onTouchStart(handler: (e?: any) => void): void;
  onTouchMove(handler: (e?: any) => void): void;
  onTouchEnd(handler: (e?: any) => void): void;
  onTouchCancel(handler: (e?: any) => void): void;
  getSystemInfoSync(): WXSystemInfo;
  request(object: any): RequestTask;
  createImage(): any;
  downloadFile(object: any): any;
  getFileSystemManager(): FileSystemManager;
  createOffscreenCanvas(): HTMLCanvasElement;
}

declare var wx: WX;

declare interface FileSystemManager {
  readFile(obj: {
    filePath?: string;
    encoding?: string;
    success?: (e?: any) => void;
    fail?: (e?: any) => void;
    complete?: (e?: any) => void;
  }): void;
  writeFile(obj: {
    filePath?: string;
    data?: string | ArrayBuffer;
    encoding?: string;
    success?: (e?: any) => void;
    fail?: (e?: any) => void;
    complete?: (e?: any) => void;
  }): void;
}

declare var FileSystemManager: FileSystemManager;
