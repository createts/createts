import { Event, EventDispatcher } from '../base/Event';
import { SpriteSheet } from '../components/Sprite';
declare enum LoadState {
    LOADING = 1,
    LOADED = 2,
    ERROR = 3
}
export declare enum ResourceType {
    IMAGE = "image",
    APNG = "apng",
    JSON = "json"
}
export declare type Resource = HTMLImageElement | SpriteSheet | any;
declare type ResourceItem = {
    url: string;
    type: ResourceType;
    resource?: Resource;
    state: LoadState;
    loadedBytes: number;
    totalBytes: number;
    error?: any;
    progress: number;
    promiseHandlers: {
        resolve: (resource: Resource) => void;
        reject: (error: any) => void;
    }[];
};
export declare class ResourceRegistryEvent extends Event {
    progress?: number;
    currentTarget?: ResourceItem;
    constructor(type: string, progress?: number, currentTarget?: ResourceItem);
}
export declare class ResourceRegistry extends EventDispatcher<ResourceRegistryEvent> {
    private allowOriginPattern?;
    private load;
    setAllowOriginPattern(pattern?: RegExp): void;
    isAllowOrigin(url: string): boolean;
    private loadImage;
    private loadJson;
    private loadApng;
    private getTotalProgress;
    private onProgress;
    private onLoad;
    private onError;
    add(url: string, type?: ResourceType): Promise<Resource>;
    get(url: string): Resource | undefined;
    release(url: string): Resource | undefined;
    private items;
    static readonly DefaultInstance: ResourceRegistry;
}
export {};
//# sourceMappingURL=ResourceRegistry.d.ts.map