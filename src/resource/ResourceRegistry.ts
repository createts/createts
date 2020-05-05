import { Event, EventDispatcher } from '../base/Event';
import { SpriteSheet } from '../components/Sprite';
import { ApngParser } from '../parser/ApngParser';
import { Runtime } from '../runtime/Runtime';

/**
 * Resource load state.
 */
enum LoadState {
  LOADING = 1,
  LOADED = 2,
  ERROR = 3
}

/**
 * Resource types.
 */
export enum ResourceType {
  IMAGE = 'image',
  APNG = 'apng',
  JSON = 'json'
}

export type Resource = HTMLImageElement | SpriteSheet | any; // `any` for json.

/**
 * Defines a resource item type contains source url, type, download stats, etc.
 */
type ResourceItem = {
  url: string;
  type: ResourceType;
  resource?: Resource;
  state: LoadState;
  loadedBytes: number;
  totalBytes: number;
  error?: any;
  progress: number;
  promiseHandlers: { resolve: (resource: Resource) => void; reject: (error: any) => void }[];
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

/**
 * The ResourceRegistry instance is used to load and manage image resources.
 *
 * Load an image programmatically:
 * ```typescript
 * const img = new Img();
 * ResourceRegistry.DefaultInstance.add('/image.jpg', ResourceType.IMAGE)
 * .then(image => {
 *   img.setImage(image);
 * });
 * ```
 *
 * By default Img instance use ResourceRegistry.DefaultInstance to load image, you can simplify the
 * code above as:
 * ```typescript
 * const img = new Img();
 * img.setSrc('/image.jpg');
 * ```
 *
 * Or
 * ```typescript
 * container.load(`<img src='/image.jpg'>`);
 * ```
 */
export class ResourceRegistry extends EventDispatcher<ResourceRegistryEvent> {
  /**
   * Load the resource.
   * @param item The resource item to be loaded.
   */
  private load(item: ResourceItem) {
    switch (item.type) {
      case ResourceType.IMAGE:
        this.loadImage(item);
        break;
      case ResourceType.APNG:
        this.loadApng(item);
        break;
      case ResourceType.JSON:
        this.loadJson(item);
        break;
    }
  }

  /**
   * Calls current runtime to load the image resource.
   * @param item The image resource item to be loaded.
   */
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

  /**
   * Calls current runtime to load the json resource.
   * @param item The json resource item to be loaded.
   */
  private loadJson(item: ResourceItem) {
    Runtime.get().loadText({
      url: item.url,
      onLoad: data => {
        item.resource = JSON.parse(data);
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

  /**
   * Calls current runtime to load the apng resource.
   * @param item The apng resource item to be loaded.
   */
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

  /**
   * Calculate the current total loading progress.
   * @returns the total progress of current loading status.
   */
  private getTotalProgress(): number {
    let progress = 0;
    for (const item of this.items) {
      progress += item.progress;
    }
    return progress / this.items.length;
  }

  /**
   * Callback while loading progress changes.
   * @param item the loading item who changes the progress.
   */
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

  /**
   * Callback while a resource is loaded successfully.
   * @param item the loaded resource.
   */
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

  /**
   * Callback while a resource is failed to been loaded.
   * @param item the resource is failed to been loaded.
   */
  private onError(item: ResourceItem) {
    item.state = LoadState.ERROR;
    for (const handler of item.promiseHandlers) {
      handler.reject(item.error);
    }
    item.promiseHandlers = [];
    this.dispatchEvent(new ResourceRegistryEvent('error', this.getTotalProgress(), item));
  }

  /**
   * Load the resource by url, please note that the resource with same url will be loaded once.
   * @param url Resource of this url to be loaded.
   * @returns A promise object od the loaded resource.
   */
  public add(url: string, type: ResourceType = ResourceType.IMAGE): Promise<Resource> {
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

  /**
   * Get a loaded resource by url, or undefined in case of url is not loaded.
   * @param url the url of resource.
   * @returns The loaded resource of this url, or undefined for unloaded resource.
   */
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

  /**
   * Release the resource by url.
   * @param url Resource of this url to be released.
   * @returns the released resource or undefined for a unloaded resource.
   */
  public release(url: string): Resource | undefined {
    for (let i = 0; i < this.items.length; ++i) {
      const item = this.items[i];
      if (item.url === url) {
        this.items.splice(i, 1);
        item.promiseHandlers.length = 0;
        return item.resource;
      }
    }
    return undefined;
  }

  /**
   * The resources in this registry.
   */
  private items: ResourceItem[] = [];

  /**
   * The default ResourceRegistry instance.
   */
  public static readonly DefaultInstance: ResourceRegistry = new ResourceRegistry();
}
