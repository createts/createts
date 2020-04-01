import { Runtime, RuntimeType } from '../runtime/Runtime';
import { Base64 } from '../utils/Base64';
import { CRC32 } from '../utils/CRC32';

export class ApngData {
  width: number;
  height: number;
  duration: number = 0;
  numPlays: number = 0;
  frames: ApngFrame[] = [];
}

export class ApngFrame {
  left: number = 0;
  top: number = 0;
  width: number = 0;
  height: number = 0;
  delay: number = 0;
  disposeOp: number = 0;
  blendOp: number = 0;
  dataParts: Uint8Array[] = [];
  image: HTMLImageElement | undefined;
}

// '\x89PNG\x0d\x0a\x1a\x0a'
const PNG_SIGNATURE = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function toUint32(data: string): number {
  return (
    (data.charCodeAt(0) << 24) |
    (data.charCodeAt(1) << 16) |
    (data.charCodeAt(2) << 8) |
    data.charCodeAt(3)
  );
}

function toDWordArray(x: number): number[] {
  return [(x >>> 24) & 0xff, (x >>> 16) & 0xff, (x >>> 8) & 0xff, x & 0xff];
}

const IHDR = toUint32('IHDR');
const acTL = toUint32('acTL');
const IDAT = toUint32('IDAT');
const fcTL = toUint32('fcTL');
const fdAT = toUint32('fdAT');
const IEND = toUint32('IEND');

type Chunk = {
  type: number;
  start: number;
  end: number;
};

export class ApngParser {
  public static parse(buffer: ArrayBuffer, silent: boolean = false): ApngData | undefined {
    const bytes = new Uint8Array(buffer);

    // Check signature.
    for (let i = 0; i < PNG_SIGNATURE.length; ++i) {
      if (PNG_SIGNATURE[i] !== bytes[i]) {
        if (!silent) {
          console.warn('not a png file');
        }
        return undefined;
      }
    }

    const chunks = this.toChunks(bytes);
    const preDataParts = [];
    const postDataParts = [];
    let headerDataBytes: Uint8Array = null;
    let frame = null;

    const apng = new ApngData();
    const dataView = new DataView(bytes.buffer);
    for (const chunk of chunks) {
      switch (chunk.type) {
        case IHDR:
          headerDataBytes = bytes.subarray(chunk.start + 8, chunk.end - 4);
          apng.width = dataView.getUint32(chunk.start + 8);
          apng.height = dataView.getUint32(chunk.start + 8 + 4);
          break;
        case acTL:
          apng.numPlays = dataView.getUint32(chunk.start + 8);
          break;
        case fcTL:
          frame = new ApngFrame();
          apng.frames.push(frame);
          frame.width = dataView.getUint32(chunk.start + 8 + 4);
          frame.height = dataView.getUint32(chunk.start + 8 + 8);
          frame.left = dataView.getUint32(chunk.start + 8 + 12);
          frame.top = dataView.getUint32(chunk.start + 8 + 16);
          const delayN = dataView.getUint16(chunk.start + 8 + 20);
          let delayD = dataView.getUint16(chunk.start + 8 + 22);
          if (delayD === 0) {
            delayD = 100;
          }
          frame.delay = (1000 * delayN) / delayD;
          if (frame.delay <= 10) {
            frame.delay = 100;
          }
          apng.duration += frame.delay;
          frame.disposeOp = dataView.getUint8(chunk.start + 8 + 24);
          frame.blendOp = dataView.getUint8(chunk.start + 8 + 25);
          frame.dataParts = [];
          if (apng.frames.length === 1 && frame.disposeOp === 2) {
            frame.disposeOp = 1;
          }
          break;
        case fdAT:
          if (frame) {
            // This is an animation frame, the first 4 byte of the data contains metadata which is
            // not required for a static frame, delete it.
            frame.dataParts.push(
              this.makeChunk(IDAT, bytes.subarray(chunk.start + 12, chunk.end - 4))
            );
          } else if (!silent) {
            console.warn('invalid fdAT chunk before frame');
          }
          break;
        case IDAT:
          // This a normal PNG data frame.
          if (frame) {
            frame.dataParts.push(
              this.makeChunk(IDAT, bytes.subarray(chunk.start + 8, chunk.end - 4))
            );
          } else if (!silent) {
            console.warn('invalid IDAT chunk before frame');
          }
          break;
        case IEND:
          postDataParts.push(bytes.subarray(chunk.start, chunk.end));
          break;
        default:
          preDataParts.push(bytes.subarray(chunk.start, chunk.end));
      }
    }

    if (apng.frames.length === 0) {
      if (!silent) {
        console.warn('not a png file');
      }
      return undefined;
    }

    // Generates the static frames.
    for (const frm of apng.frames) {
      const imageData: Uint8Array[] = [];
      imageData.push(PNG_SIGNATURE);
      // Update the static frame size.
      headerDataBytes.set(toDWordArray(frm.width), 0);
      headerDataBytes.set(toDWordArray(frm.height), 4);
      imageData.push(this.makeChunk(IHDR, headerDataBytes));
      for (const part of preDataParts) {
        imageData.push(part);
      }
      for (const part of frm.dataParts) {
        imageData.push(part);
      }
      for (const part of postDataParts) {
        imageData.push(part);
      }
      delete frm.dataParts;

      switch (Runtime.getRuntimeType()) {
        case RuntimeType.WECHAT_MINI_GAME:
          {
            frm.image = Runtime.get().newImage();
            const url = 'data:image/png;base64,' + Base64.encode(imageData);
            frm.image.src = url;
          }
          break;
        case RuntimeType.WEBPAGE:
          {
            const url = URL.createObjectURL(new Blob(imageData, { type: 'image/png' }));
            const image = new Image();
            frm.image = image;
            image.src = url;
            image.onload = () => {
              URL.revokeObjectURL(url);
            };
            image.onerror = e => {
              URL.revokeObjectURL(url);
            };
          }
          break;
      }
    }

    return apng;
  }

  private static toChunks(bytes: Uint8Array): Chunk[] | undefined {
    const chunks: Chunk[] = [];
    const dataView = new DataView(bytes.buffer);
    let position = 8; // Skip the signature in header.
    // A valid chunk should be >= 12 bytes.
    while (position <= bytes.length - 12) {
      // First 4 bytes present chunk length.
      const length = dataView.getUint32(position);
      if (length < 0 || position + 12 + length > bytes.length) {
        console.warn(
          'invalid chunk length, position=' +
            position +
            ' length=' +
            length +
            ' total=' +
            bytes.length
        );
        return undefined;
      }
      // Next 4 bytes present chunk type.
      const type = dataView.getUint32(position + 4);
      chunks.push({
        type,
        start: position,
        end: position + length + 12
      });
      // The tail 4 bytes present CRC digest, ignore it.
      // TODO: validate it.
      position += 12 + length;
      if (type === IEND) {
        break;
      }
    }
    return chunks;
  }

  private static makeChunk(type: number, data: Uint8Array): Uint8Array {
    const bytes = new Uint8Array(data.length + 12);
    const dataView = new DataView(bytes.buffer);

    dataView.setUint32(0, data.length);
    dataView.setUint32(4, type);
    bytes.set(data, 8);
    const crc = CRC32.calculate(bytes, 4, data.length + 4);
    dataView.setUint32(data.length + 8, crc);
    return bytes;
  }
}
