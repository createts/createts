import { Event, EventDispatcher } from '../base/Event';
import { SpriteSheet } from '../components/Sprite';
import { ApngParser } from '../parser/ApngParser';
import { Loader } from './Loader';

export enum LoadState {
  LOADING = 1,
  LOADED = 2,
  ERROR = 3
}

export enum ResourceType {
  IMAGE = 1,
  APNG = 2
}

type Resource = HTMLImageElement | SpriteSheet;
type Resolve = (resource: Resource) => void;
type Reject = (error: any) => void;

interface IPromiseHandler {
  resolve: Resolve;
  reject: Reject;
}

export type ResourceItem = {
  url: string;
  type: ResourceType;
  resource?: Resource;
  state: LoadState;
  loadedBytes: number;
  totalBytes: number;
  error?: any;
  progress: number;
  promiseHandlers: IPromiseHandler[];
};

class RegistryEvent extends Event {
  progress: number;
  constructor(type: string, progress: number) {
    super(type);
    this.progress = progress;
  }
}

export class ResourceRegistry extends EventDispatcher<RegistryEvent> {
  public add(url: string, type: ResourceType): Promise<Resource> {
    return new Promise<Resource>((resolve, reject) => {
      for (const item of this.items) {
        if (item.url === url) {
          if (item.state === LoadState.LOADED) {
            resolve(item.resource);
          } else if (item.state === LoadState.ERROR) {
            reject(item.error);
          } else {
            item.promiseHandlers.push({
              resolve,
              reject
            });
          }
          return;
        }
      }

      const newItem: ResourceItem = {
        url,
        type,
        resource: undefined,
        state: LoadState.LOADING,
        progress: 0,
        loadedBytes: 0,
        totalBytes: 0,
        promiseHandlers: [{ resolve, reject }]
      };
      this.items.push(newItem);
      this.load(newItem);
    });
  }

  private load(item: ResourceItem) {
    switch (item.type) {
      case ResourceType.IMAGE:
        this.loadImage(item);
        break;
      case ResourceType.APNG:
        this.loadApng(item);
        break;
    }
  }

  private loadImage(item: ResourceItem) {
    const loader = new Loader(item.url, 'GET', 'blob');
    loader
      .on('load', e => {
        const url = URL.createObjectURL(e.response);
        item.resource = new Image();
        item.resource.src = url;
        item.resource.onload = () => {
          URL.revokeObjectURL(url);
          this.onLoad(item);
        };
      })
      .on('progress', e => {
        item.loadedBytes = e.target.loadedBytes;
        item.totalBytes = e.target.totalBytes;
        this.onProgress(item);
      })
      .on('error', e => {
        item.error = e;
        this.onError(item);
      });
  }

  private loadApng(item: ResourceItem) {
    const loader = new Loader(item.url, 'GET', 'arraybuffer');
    loader
      .on('load', e => {
        const apng = ApngParser.parse(e.response);
        const opt: SpriteSheet = {
          width: apng.width,
          height: apng.height,
          fps: (apng.frames.length * 1000) / apng.duration,
          frames: [],
          url: undefined,
          image: undefined
        };
        for (const frame of apng.frames) {
          opt.frames.push({
            destX: frame.left,
            destY: frame.top,
            destWidth: frame.width,
            destHeight: frame.height,
            image: frame.image
          });
        }
        item.resource = opt;
        this.onLoad(item);
      })
      .on('progress', e => {
        item.loadedBytes = e.target.loadedBytes;
        item.totalBytes = e.target.totalBytes;
        this.onProgress(item);
      })
      .on('error', e => {
        item.error = e;
        this.onError(item);
      });
  }

  private getTotalProgress(): number {
    let progress = 0;
    for (const item of this.items) {
      progress += item.progress;
    }
    return progress / this.items.length;
  }

  private onProgress(item: ResourceItem) {
    item.progress = item.totalBytes > 0 ? item.loadedBytes / item.totalBytes : 0;
    this.dispatchEvent(new RegistryEvent('progress', this.getTotalProgress()));
  }

  private onLoad(item: ResourceItem) {
    item.state = LoadState.LOADED;
    item.progress = 1;
    item.loadedBytes = item.totalBytes;
    for (const handler of item.promiseHandlers) {
      handler.resolve(item.resource);
    }
    item.promiseHandlers = [];
    let done = true;
    for (const i of this.items) {
      if (i.state !== LoadState.LOADED) {
        done = false;
        break;
      }
    }
    if (done) {
      this.dispatchEvent(new RegistryEvent('done', 1));
    }
  }

  private onError(item: ResourceItem) {
    item.state = LoadState.ERROR;
    for (const handler of item.promiseHandlers) {
      handler.reject(item.error);
    }
    item.promiseHandlers = [];
    this.dispatchEvent(new RegistryEvent('error', this.getTotalProgress()));
  }

  public get(url: string): Resource | undefined {
    for (const item of this.items) {
      if (item.url === url) {
        if (item.state === LoadState.LOADED) {
          return item.resource;
        } else {
          return undefined;
        }
      }
    }
    return undefined;
  }

  public release(url: string): ResourceItem | undefined {
    for (let i = 0; i < this.items.length; ++i) {
      const item = this.items[i];
      if (item.url === url) {
        this.items.splice(i, 1);
        return item;
      }
    }
    return undefined;
  }

  private items: ResourceItem[] = [];

  static readonly DefaultInstance: ResourceRegistry = new ResourceRegistry();
}
