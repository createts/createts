import { Event, EventDispatcher } from '../base/Event';
declare class LoaderEvent extends Event {
    readonly target: Downloader;
    response: any;
    constructor(target: Downloader, type: string, response?: any);
}
export declare class Downloader extends EventDispatcher<LoaderEvent> {
    private url;
    private method;
    totalBytes: number;
    loadedBytes: number;
    constructor(url: string, method?: string);
    download(): void;
}
export {};
//# sourceMappingURL=Downloader.d.ts.map