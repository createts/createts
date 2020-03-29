import { Event, EventDispatcher } from '../base/Event';
import { SpriteSheet } from '../components/Sprite';
import { ApngParser } from '../parser/ApngParser';
import { Runtime } from '../runtime/Runtime';

/**
 * Resource load state.
 */
export enum LoadState {
  LOADING = 1,
  LOADED = 2,
  ERROR = 3
}

/**
 * Resource types.
 */
export enum ResourceType {
  IMAGE = 'image',
  APNG = 'apng'
}

export type Resource = HTMLImageElement | SpriteSheet;
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

/**
 * This event is triggered when resource was added, loaded, or loading progress was changed.
 */
export class ResourceRegistryEvent extends Event {
  progress?: number;
  currentTarget?: ResourceItem;
  constructor(type: string, progress?: number, currentTarget?: ResourceItem) {
    super(type);
    this.progress = progress;
    this.currentTarget = currentTarget;
  }
}

export class ResourceRegistry extends EventDispatcher<ResourceRegistryEvent> {
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
    Runtime.get().loadImage({
      url: item.url,
      onLoad: image => {
        item.resource = image;
        this.onLoad(item);
      },
      onError: error => {
        item.error = error;
        this.onError(item);
      },
      onProgress: event => {
        item.loadedBytes = event.loadedBytes;
        item.totalBytes = event.totalBytes;
        this.onProgress(item);
      }
    });
  }

  private loadApng(item: ResourceItem) {
    Runtime.get().loadArrayBuffer({
      url: item.url,
      onLoad: data => {
        const apng = ApngParser.parse(data);
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
      },
      onError: error => {
        console.warn('error while loading apng', error);
        item.error = error;
        this.onError(item);
      },
      onProgress: event => {
        item.loadedBytes = event.loadedBytes;
        item.totalBytes = event.totalBytes;
        this.onProgress(item);
      }
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
    if (item.state === LoadState.LOADING && item.totalBytes > 0) {
      item.progress = item.loadedBytes / item.totalBytes;
    }
    this.dispatchEvent(new ResourceRegistryEvent('progress', this.getTotalProgress()));
    this.dispatchEvent(
      new ResourceRegistryEvent(
        'itemprogress',
        item.totalBytes > 0 ? item.loadedBytes / item.totalBytes : 0,
        item
      )
    );
  }

  private onLoad(item: ResourceItem) {
    item.state = LoadState.LOADED;
    item.loadedBytes = item.totalBytes;
    if (item.progress < 1) {
      item.progress = 1;
      this.onProgress(item);
    }
    for (const handler of item.promiseHandlers) {
      handler.resolve(item.resource);
    }
    item.promiseHandlers = [];
    this.dispatchEvent(new ResourceRegistryEvent('load', 1, item));
    let done = true;
    for (const i of this.items) {
      if (i.state !== LoadState.LOADED) {
        done = false;
        break;
      }
    }
    if (done) {
      this.dispatchEvent(new ResourceRegistryEvent('done', 1));
    }
  }

  private onError(item: ResourceItem) {
    item.state = LoadState.ERROR;
    for (const handler of item.promiseHandlers) {
      handler.reject(item.error);
    }
    item.promiseHandlers = [];
    this.dispatchEvent(new ResourceRegistryEvent('error', this.getTotalProgress(), item));
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
