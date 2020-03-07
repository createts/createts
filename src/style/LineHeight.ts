export enum LineHeightType {
  NORMAL = 0,
  NUMBER = 1,
  LENGTH = 2,
  PERCENT = 3
}

const REG_NUMBER = /^([0-9]*\.?[0-9]*)$/;
const REG_LENGTH = /^([0-9]*\.?[0-9]*)px$/i;
const REG_PERCENT = /^([0-9]*\.?[0-9]*)%$/;

export class LineHeight {
  public static of(value: string, silent: boolean = false): LineHeight | undefined {
    value = value.toLowerCase();
    if (value === 'normal') {
      return new LineHeight(LineHeightType.NORMAL, 0);
    } else if (REG_NUMBER.test(value)) {
      return new LineHeight(LineHeightType.NUMBER, parseFloat(value));
    } else if (REG_LENGTH.test(value)) {
      return new LineHeight(LineHeightType.LENGTH, parseFloat(value));
    } else if (REG_PERCENT.test(value)) {
      return new LineHeight(LineHeightType.PERCENT, parseFloat(value));
    }
    if (!silent) {
      console.warn(`invalid line height:${value}`);
    }
    return undefined;
  }

  readonly type: LineHeightType = LineHeightType.NORMAL;
  readonly value: number = 0;

  constructor(type: LineHeightType, value: number) {
    this.type = type;
    this.value = value;
  }

  public getValue(base: number): number {
    switch (this.type) {
      case LineHeightType.NORMAL:
        return base * 1.2;
      case LineHeightType.NUMBER:
        return base * this.value;
      case LineHeightType.LENGTH:
        return this.value;
      case LineHeightType.PERCENT:
        return (this.value * base) / 100;
    }
  }

  public toString() {
    switch (this.type) {
      case LineHeightType.NORMAL:
        return 'normal';
      case LineHeightType.NUMBER:
        return this.value;
      case LineHeightType.LENGTH:
        return this.value + 'px';
      case LineHeightType.PERCENT:
        return this.value + '%';
    }
  }

  public clone(): LineHeight {
    return new LineHeight(this.type, this.value);
  }
}
