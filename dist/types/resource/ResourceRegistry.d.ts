import { Event, EventDispatcher } from '../base/Event';
import { SpriteSheet } from '../components/Sprite';
export declare enum LoadState {
    LOADING = 1,
    LOADED = 2,
    ERROR = 3
}
export declare enum ResourceType {
    IMAGE = "image",
    APNG = "apng"
}
export declare type Resource = HTMLImageElement | SpriteSheet;
declare type Resolve = (resource: Resource) => void;
declare type Reject = (error: any) => void;
interface IPromiseHandler {
    resolve: Resolve;
    reject: Reject;
}
export declare type ResourceItem = {
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
export declare class ResourceRegistryEvent extends Event {
    progress?: number;
    currentTarget?: ResourceItem;
    constructor(type: string, progress?: number, currentTarget?: ResourceItem);
}
export declare class ResourceRegistry extends EventDispatcher<ResourceRegistryEvent> {
    add(url: string, type: ResourceType): Promise<Resource>;
    private load;
    private loadImage;
    private loadApng;
    private getTotalProgress;
    private onProgress;
    private onLoad;
    private onError;
    get(url: string): Resource | undefined;
    release(url: string): ResourceItem | undefined;
    private items;
    static readonly DefaultInstance: ResourceRegistry;
}
export {};
//# sourceMappingURL=ResourceRegistry.d.ts.map