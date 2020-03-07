import { Event, EventDispatcher } from '../base/Event';
declare class LoaderEvent extends Event {
    readonly target: Loader;
    response: any;
    constructor(target: Loader, type: string, response?: any);
}
export declare class Loader extends EventDispatcher<LoaderEvent> {
    private url;
    private method;
    private responseType;
    private xhr;
    totalBytes: number;
    loadedBytes: number;
    constructor(url: string, method?: string, responseType?: XMLHttpRequestResponseType);
    download(): void;
}
export {};
//# sourceMappingURL=Loader.d.ts.map