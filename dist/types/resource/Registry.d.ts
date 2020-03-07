import { Event, EventDispatcher } from '../base/Event';
import { SpriteOption } from '../components/Sprite';
export declare enum LoadState {
    LOADING = 1,
    LOADED = 2,
    ERROR = 3
}
export declare enum ResourceType {
    IMAGE = 1,
    APNG = 2
}
declare type Resource = HTMLImageElement | SpriteOption;
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
declare class RegistryEvent extends Event {
    progress: number;
    constructor(type: string, progress: number);
}
export declare class Registry extends EventDispatcher<RegistryEvent> {
    add(url: string, type: ResourceType): Promise<Resource>;
    private load;
    private loadImage;
    private loadApng;
    private getTotalProgress;
    onProgress(item: ResourceItem): void;
    onLoad(item: ResourceItem): void;
    onError(item: ResourceItem): void;
    getByUrl(url: string): Resource | undefined;
    private items;
    static readonly DefaultInstance: Registry;
}
export {};
//# sourceMappingURL=Registry.d.ts.map