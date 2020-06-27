/**
 * A LatestList class contains the latest N added elements.
 */
export class LatestList<T> {
  readonly capacity: number;

  readonly elements: T[] = [];

  /**
   * Construct a LatestList object capacity.
   * @param capacity The capacity of this list.
   */
  constructor(capacity: number = 10) {
    this.capacity = capacity;
  }

  /**
   * Adds an element to this list, drop the oldest one if size of this.elements is more than
   * this.capacity after adding.
   * @param element The element to be added.
   * @returns The current instance. Useful for chaining method calls.
   */
  public add(element: T): LatestList<T> {
    while (this.elements.length >= this.capacity) {
      this.elements.shift();
    }
    this.elements.push(element);
    return this;
  }
}
