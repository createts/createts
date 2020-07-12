/**
 * A class contains static url util methods.
 */
export class URLUtils {
  /**
   * Prevent creating instance.
   */
  private constructor() { }

  /**
   * Checks an url is absolute url or not.
   * @param url an url to be checked.
   */
  public static isAbsolute(url: string): boolean {
    return url.indexOf('://') > 0 || url.startsWith('//');
  }

  /**
   * Returns the domain of a given url, undefined for absolute url.
   * @param url an url to be checked.
   */
  public static getDomain(url: string): string | undefined {
    let s;
    if (url.startsWith('//')) {
      s = 2;
    } else {
      s = url.indexOf('://');
      if (s <= 0) return undefined;
      s += 3;
    }
    let e = url.indexOf(':', s);
    if (e < 0) {
      e = url.indexOf('/', s);
    }
    if (e < 0) {
      return url.substring(s);
    } else {
      return url.substring(s, e);
    }
  }

  /**
   * Returns the origin of a given url, undefined for absolute url.
   * @param url an url to be checked.
   */
  public static getOrigin(url: string): string | undefined {
    let s;
    if (url.startsWith('//')) {
      s = 2;
    } else {
      s = url.indexOf('://');
      if (s <= 0) return undefined;
      s += 3;
    }
    const e = url.indexOf('/', s);
    if (e < 0) {
      return url;
    } else {
      return url.substring(0, e);
    }
  }
}
