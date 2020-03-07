/**
 * A class contains static enum util methods.
 *
 * Code example:
 *
 * ```typescript
 * enum TestEnum {
 *   V1 = 'v1',
 *   V2 = 'v2'
 * }
 * EnumUtils.fromString(TestEnum, 'v1', TestEnum.V2);  // TestEnum.v1
 * EnumUtils.fromString(TestEnum, 'v', TestEnum.V2);  // TestEnum.v2
 * EnumUtils.fromStringOrUndefined(TestEnum, 'v');  // undefined
 * ```
 */
export class EnumUtils {
  /**
   * Prevent creating instance.
   */
  private constructor() {}

  /**
   * Convert a string to an enum value of a give type.
   * @param enumtype an enum type.
   * @param value the string converted from.
   * @param defaultValue if the string is not defined in this enum, return this as default value.
   * @returns an enum value convert from the string or default value if string is not defined in this enum.
   */
  public static fromString<T>(enumtype: any, value: string, defaultValue: T): T {
    for (const name in enumtype) {
      if (enumtype[name] === value) {
        return (value as unknown) as T;
      }
    }
    return defaultValue;
  }

  /**
   * Convert a string to an enum value of a give type.
   * @param enumtype an enum type.
   * @param value the string converted from.
   * @returns an enum value convert from the string or undefined if string is not defined in this enum.
   */
  public static fromStringOrUndefined<T>(enumtype: any, value: string): T | undefined {
    for (const name in enumtype) {
      if (enumtype[name] === value) {
        return (value as unknown) as T;
      }
    }
    return undefined;
  }
}
