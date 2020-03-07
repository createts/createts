import { ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { IXObjectOptions, XActionEvent, XObject } from './XObject';

export type SpriteFrame = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  image: HTMLImageElement | undefined;
};

export type SpriteOption = {
  width: number;
  height: number;
  fps: number;
  url: string;
  image: HTMLImageElement | undefined;
  frames: SpriteFrame[];
};

enum SpriteState {
  STOPPED = 0,
  PLAYING = 1,
  PAUSED = 2
}

export class Sprite extends XObject {
  private option?: SpriteOption;
  private currentFrame: number = 0;
  private startTime: number = 0;
  private pauseTime: number = 0;
  private state: SpriteState = SpriteState.STOPPED;
  private playTimes: number = 0;

  constructor(options?: IXObjectOptions) {
    super(options);
  }

  public setOption(option: SpriteOption) {
    this.option = option;
    if (this.option && this.option.url) {
      ResourceRegistry.DefaultInstance.add(this.option.url, ResourceType.IMAGE);
    }
    return this;
  }

  public play(times = -1): Sprite {
    this.playTimes = times;
    this.startTime = Date.now();
    this.currentFrame = 0;
    this.state = SpriteState.PLAYING;
    this.dispatchEvent(new XActionEvent(this, 'play'));
    return this;
  }

  public pause(): Sprite {
    if (this.state === SpriteState.PLAYING) {
      this.state = SpriteState.PAUSED;
      this.pauseTime = Date.now();
      this.dispatchEvent(new XActionEvent(this, 'pause'));
    }
    return this;
  }

  public resume(): Sprite {
    if (this.state === SpriteState.PAUSED) {
      this.state = SpriteState.PLAYING;
      this.startTime = this.startTime + Date.now() - this.pauseTime;
      this.dispatchEvent(new XActionEvent(this, 'resume'));
    }
    return this;
  }

  public stop(): Sprite {
    if (this.state !== SpriteState.STOPPED) {
      this.state = SpriteState.STOPPED;
      this.dispatchEvent(new XActionEvent(this, 'stop'));
    }
    return this;
  }

  public times(times: number): Sprite {
    return this.play(times);
  }

  public setCurrentFrame(currentFrame: number): Sprite {
    this.currentFrame = currentFrame;
    return this;
  }

  public toNextFrame(): Sprite {
    this.currentFrame = (this.currentFrame + 1) % this.option.frames.length;
    return this;
  }

  public toPreviousFrame(): Sprite {
    this.currentFrame =
      (this.currentFrame - 1 + this.option.frames.length) % this.option.frames.length;
    return this;
  }

  private updateFramePosition(): boolean {
    if (
      this.state !== SpriteState.PLAYING ||
      this.playTimes === 0 ||
      !this.option ||
      this.option.fps <= 0 ||
      this.option.frames.length === 0
    ) {
      return false;
    }
    const now = Date.now();
    if (now < this.startTime) {
      this.startTime = now;
      this.currentFrame = 0;
      return false;
    }

    const interval = 1000 / this.option.fps;
    const pass = Math.floor((now - this.startTime) / interval);
    this.currentFrame = pass % this.option.frames.length;
    if (this.playTimes > 0 && pass >= this.option.frames.length * this.playTimes) {
      this.currentFrame = this.option.frames.length - 1;
      this.state = SpriteState.STOPPED;
      return true;
    }
  }

  public drawContent(ctx: CanvasRenderingContext2D) {
    if (!this.option || this.option.frames.length === 0) {
      return;
    }
    const end = this.updateFramePosition();
    const frame = this.option.frames[this.currentFrame];

    // Get image
    const rect = this.getContentRect();
    let image: any;
    let srcX = 0;
    let srcY = 0;
    let srcWidth = this.option.width;
    let srcHeight = this.option.height;
    let destX = rect.x;
    let destY = rect.y;
    let destWidth = rect.width;
    let destHeight = rect.height;
    const scaleX = rect.width / this.option.width;
    const scaleY = rect.height / this.option.height;

    if (frame.image) {
      image = frame.image;
      destX += frame.x * scaleX;
      destY += frame.y * scaleY;
      destWidth = frame.width * scaleX;
      destHeight = frame.height * scaleY;
      srcX = 0;
      srcY = 0;
      srcWidth = frame.width;
      srcHeight = frame.height;
    } else {
      image =
        this.option.image ||
        (this.option.url && ResourceRegistry.DefaultInstance.get(this.option.url));
      if (!image) {
        return;
      }
      srcX = frame.x;
      srcY = frame.y;
      srcWidth = frame.width || this.option.width;
      srcHeight = frame.height || this.option.height;
    }
    if (!image) {
      return;
    }

    try {
      ctx.drawImage(image, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth, destHeight);
    } catch (e) {
      console.warn(this.currentFrame, e);
    }
    if (end) {
      this.dispatchEvent(new XActionEvent(this, 'stop'));
    }
  }
}
