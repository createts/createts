/**
 * A lookup table contains valid based64 characters.
 */
const STANDARD_ENCODE_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * A class that can be used to encode Uint8Array to base64 string.
 */
export class Base64 {
  /**
   * Encodes a 4 bytes integer to a base64 string.
   * @param num an integer (4 bytes) to be encoded.
   * @returns a encoded base64 string.
   */
  private static tripletToBase64(num: number) {
    return (
      STANDARD_ENCODE_TABLE[(num >> 18) & 0x3f] +
      STANDARD_ENCODE_TABLE[(num >> 12) & 0x3f] +
      STANDARD_ENCODE_TABLE[(num >> 6) & 0x3f] +
      STANDARD_ENCODE_TABLE[num & 0x3f]
    );
  }

  /**
   * Given an array of Uint8Array object and current position, returns the current uint8 value and
   * move to next position.
   * @param dataArray An array of Uint8Array object.
   * @param index Current position, will be moved to next position after calling this function.
   * @returns The uint8 value of current position.
   */
  private static next(dataArray: Uint8Array[], index: { [key: string]: number }): number {
    if (dataArray[index.i].length > index.j) {
      return dataArray[index.i][index.j++];
    } else {
      // tslint:disable-next-line: no-empty
      while (dataArray[++index.i].length === 0) {}
      index.j = 1;
      return dataArray[index.i][0];
    }
  }

  /**
   * Encodes an array of Uint8Array to a base64 string, this function is usually used to encode
   * raw image content to a base64 string which can be used to as src of an image object.
   * @param dataArray An array of Uint8Array.
   * @returns A encoded based64 string.
   */
  public static encode(dataArray: Uint8Array[]): string {
    const sizes = [];
    let len = 0;
    for (const data of dataArray) {
      len += data.length;
      sizes.push({ size: data.length, current: 0 });
    }
    const index = { i: 0, j: 0 };
    const extraBytes = len % 3;
    const parts: string[] = [];
    const times = Math.floor(len / 3);

    for (let i = 0; i < times; ++i) {
      parts.push(
        this.tripletToBase64(
          ((this.next(dataArray, index) << 16) & 0xff0000) +
            ((this.next(dataArray, index) << 8) & 0xff00) +
            (this.next(dataArray, index) & 0xff)
        )
      );
    }

    if (extraBytes === 1) {
      const tmp = this.next(dataArray, index);
      parts.push(STANDARD_ENCODE_TABLE[tmp >> 2] + STANDARD_ENCODE_TABLE[(tmp << 4) & 0x3f] + '==');
    } else if (extraBytes === 2) {
      const tmp = (this.next(dataArray, index) << 8) + this.next(dataArray, index);
      parts.push(
        STANDARD_ENCODE_TABLE[tmp >> 10] +
          STANDARD_ENCODE_TABLE[(tmp >> 4) & 0x3f] +
          STANDARD_ENCODE_TABLE[(tmp << 2) & 0x3f] +
          '='
      );
    }

    return parts.join('');
  }
}
