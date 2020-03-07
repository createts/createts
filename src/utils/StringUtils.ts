/**
 * A class contains static string util methods.
 */
export class StringUtils {
  /**
   * Prevent creating instance.
   */
  private constructor() {}

  /**
   * Returns an list of all results matching a string against a regular expression, including capturing groups.
   * @param str string used to be matched.
   * @param regex Regular expression used to match the input string.
   * @returns list of matched results.
   */
  public static matchAll(str: string, regex: RegExp): RegExpExecArray[] {
    const result: RegExpExecArray[] = [];
    const localCopy = new RegExp(
      regex,
      regex.flags.includes('g') ? regex.flags : regex.flags + 'g'
    );
    let match = localCopy.exec(str);
    while (match) {
      result.push(match);
      match = localCopy.exec(str);
    }
    return result;
  }
}
