type Func = {
  name: string;
  arguments: string[];
};

enum State {
  NAME_START = 0,
  NAME = 1,
  NAME_END = 2,
  PARAMETER_START = 3,
  PARAMETER = 4,
  PARAMETER_END = 5,
  END = 6
}

/**
 * This class provides an util function to parse a string to a Func object.
 */
export class FunctionParser {
  /**
   * Checks whether a character is blank.
   * @param ch the character to be checked.
   * @returns true if the character is one of ' ', '\t', '\r', '\n'; false otherwise.
   */
  private static isBlank(ch: string): boolean {
    return ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n';
  }

  /**
   * Convert the input string to a Func object.
   * @param content the input string.
   * @param [silent] if ture, ignore warning for an invalid value.
   * @returns a Func object for valid content, undefined otherwise.
   */
  public static parse(content: string, silent = false): Func | undefined {
    const func: Func = {
      name: undefined,
      arguments: []
    };

    let state = State.NAME_START;
    let parameterQuota = '';
    let start = 0;
    const len = content.length;
    let i = 0;
    for (; i < len; ++i) {
      const ch = content[i];
      switch (state) {
        case State.NAME_START:
          if (!this.isBlank(ch)) {
            start = i;
            state = State.NAME;
          }
          break;
        case State.NAME:
          if (this.isBlank(ch) || ch === ')') {
            if (!silent) {
              console.warn('invalid function:' + content);
            }
            return undefined;
          } else if (ch === '(') {
            func.name = content.substring(start, i);
            state = ch === '(' ? State.PARAMETER_START : State.NAME_END;
          }
          break;
        case State.NAME_END:
          if (ch === '(') {
            state = State.PARAMETER_START;
            break;
          } else if (!this.isBlank(ch)) {
            if (!silent) {
              console.warn('invalid function:' + content);
            }
            return undefined;
          }
        case State.PARAMETER_START:
          if (this.isBlank(ch)) {
            break;
          } else if (ch === '"' || ch === "'") {
            state = State.PARAMETER;
            start = i + 1;
            parameterQuota = ch;
          } else if (ch === ')') {
            state = State.END;
          } else if (ch === ',') {
            if (!silent) {
              console.warn('invalid function:' + content);
            }
            return undefined;
          } else {
            state = State.PARAMETER;
            start = i;
            parameterQuota = '';
          }
          break;
        case State.PARAMETER:
          if (parameterQuota !== '') {
            if (parameterQuota === ch) {
              state = State.PARAMETER_END;
              func.arguments.push(content.substring(start, i));
              parameterQuota = '';
            }
          } else {
            if (this.isBlank(ch)) {
              state = State.PARAMETER_END;
              func.arguments.push(content.substring(start, i));
              parameterQuota = '';
            } else if (ch === ',') {
              state = State.PARAMETER_START;
              func.arguments.push(content.substring(start, i));
              parameterQuota = '';
            } else if (ch === ')') {
              state = State.END;
              func.arguments.push(content.substring(start, i));
              parameterQuota = '';
            }
          }
          break;
        case State.PARAMETER_END:
          if (this.isBlank(ch)) {
            break;
          } else if (ch === ',') {
            state = State.PARAMETER_START;
          } else if (ch === ')') {
            state = State.END;
          }
          break;
        case State.END:
          if (!this.isBlank(ch)) {
            if (!silent) {
              console.warn('invalid function:' + content);
            }
            return undefined;
          }
          break;
      }
    }
    if (state !== State.END) {
      if (!silent) {
        console.warn('invalid function:' + content);
      }
      return undefined;
    }
    return func;
  }
}
