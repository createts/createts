import { Event, EventDispatcher } from '../base/Event';

class LoaderEvent extends Event {
  public readonly target: Loader;
  public response: any;
  constructor(target: Loader, type: string, response?: any) {
    super(type);
    this.target = target;
    this.response = response;
  }
}

export class Loader extends EventDispatcher<LoaderEvent> {
  private url: string;
  private method: string;
  private responseType: XMLHttpRequestResponseType;
  private xhr: XMLHttpRequest;
  public totalBytes: number;
  public loadedBytes: number;

  constructor(url: string, method: string = 'GET', responseType: XMLHttpRequestResponseType = '') {
    super();
    this.url = url;
    this.method = method;
    this.responseType = responseType;
    this.totalBytes = 0;
    this.loadedBytes = 0;
    this.download();
  }

  download() {
    if (this.xhr) {
      return;
    }
    this.xhr = new XMLHttpRequest();
    this.xhr.responseType = this.responseType;
    this.xhr.open(this.method, this.url, true);

    this.xhr.onload = () => {
      if (this.xhr.status === 200) {
        this.dispatchEvent(new LoaderEvent(this, 'load', this.xhr.response));
      }
    };

    this.xhr.onerror = event => {
      this.dispatchEvent(new LoaderEvent(this, 'error'));
    };

    this.xhr.onprogress = event => {
      if (event.lengthComputable) {
        this.loadedBytes = event.loaded;
        this.totalBytes = event.total;
        this.dispatchEvent(new LoaderEvent(this, 'progress'));
      }
    };
    this.xhr.send();
  }
}
