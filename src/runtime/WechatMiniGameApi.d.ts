//-----------------------------------------------------------------------------
// This is a sub set of wechat mini game api definition, visit
// https://developers.weixin.qq.com/minigame/dev/guide/
// for full apis.
//-----------------------------------------------------------------------------

declare function requestAnimationFrame(callback: Function): number;

declare interface WXSystemInfo {
  windowWidth: number;
  windowHeight: number;
}

declare interface RequestTask {
  abort(): void;
}

declare interface WX {
  createCanvas(): HTMLCanvasElement;
  onTouchStart(handler: Function): void;
  onTouchMove(handler: Function): void;
  onTouchEnd(handler: Function): void;
  onTouchCancel(handler: Function): void;
  getSystemInfoSync(): WXSystemInfo;
  request(object: Object): RequestTask;
  createImage(): any;
  downloadFile(object: Object): any;
  getFileSystemManager(): FileSystemManager;
  createOffscreenCanvas(): HTMLCanvasElement;
}

declare var wx: WX;

declare interface FileSystemManager {
  readFile(obj: {
    filePath?: string;
    encoding?: string;
    success?: Function;
    fail?: Function;
    complete?: Function;
  }): void;
  writeFile(obj: {
    filePath?: string;
    data?: string | ArrayBuffer;
    encoding?: string;
    success?: Function;
    fail?: Function;
    complete?: Function;
  }): void;
}

declare var FileSystemManager: FileSystemManager;
