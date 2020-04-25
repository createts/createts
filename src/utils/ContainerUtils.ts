export class ContainerUtils {
  /**
   * Prevent creating instance.
   */
  private constructor() {}

  /**
   * Checks a map is empty.
   * @param map a map to be checked.
   * @returns True if the map is undefined or empty.
   */
  public static isEmpty(map: { [key: string]: any } | undefined): boolean {
    if (!map) return true;
    for (const key in map) {
      if (map.hasOwnProperty(key)) return false;
    }
    return true;
  }
}
