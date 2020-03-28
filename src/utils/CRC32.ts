/**
 * Lookup table.
 */
const TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  TABLE[i] = c;
}

/**
 * A class that can be used to compute the CRC-32 of an Uint8Array.
 */
export class CRC32 {
  /**
   * Calculate the CRC-32 checksum with the specified array of bytes.
   * @param bytes the byte array to update the checksum with.
   * @param start the start offset of the data.
   * @param length the number of bytes to use for the update.
   * @returns a number whose lowest 4 bytes presents CRC-32 checksum.
   */
  public static calculate(
    bytes: Uint8Array,
    start: number = 0,
    length = bytes.length - start
  ): number {
    let crc = -1;
    for (let i = start, l = start + length; i < l; i++) {
      crc = (crc >>> 8) ^ TABLE[(crc ^ bytes[i]) & 0xff];
    }
    return crc ^ -1;
  }
}
