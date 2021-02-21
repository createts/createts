import { BaseValue } from '../base/BaseValue';

/**
 * A class contains static style util methods.
 */
export class StyleUtils {
  public static parse4Dirs(value: string): BaseValue[] | undefined {
    const pieces = value.trim().split(/\s+/);
    if (pieces.length === 1) {
      return [
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[0])
      ];
    } else if (pieces.length === 2) {
      return [
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[1]),
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[1])
      ];
    } else if (pieces.length === 3) {
      return [
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[1]),
        BaseValue.of(pieces[2]),
        BaseValue.of(pieces[1])
      ];
    } else if (pieces.length === 4) {
      return [
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[1]),
        BaseValue.of(pieces[2]),
        BaseValue.of(pieces[3])
      ];
    } else {
      return undefined;
    }
  }
}
