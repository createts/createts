/**
 * A class contains static url util methods.
 */
export class URLUtils {
  /**
   * Prevent creating instance.
   */
  private constructor() {}

  /**
   * Checks an url is absolute url or not.
   * @param url an url to be checked.
   */
  public static isAbsolute(url: string): boolean {
    return url.indexOf('://') > 0 || url.startsWith('//');
  }
}
