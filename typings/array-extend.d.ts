interface Array<T> {
  /**
   * Assume that this array is sorted.
   * Returns the first element in the array where 
   * comparator(element, item) returns zero or positive number.
   */
  binaryFind(item: T, comparator: (a: T, b: T) => number): T | undefined;

  /**
   * Assume that this array is sorted.
   * Returns the index of the first element in the array
   * where comparator(element, item) returns zero or positive number.
   */
  binaryFindIndex(item: T, comparator: (a: T, b: T) => number): number;

  /**
   * Assume that this array is a sorted ascending number array.
   * Returns the first element in the array where 
   * the element is equal or greater than item.
   */
  binaryFindN(item: number): number | undefined;

  /**
   * Assume that this array is a sorted ascending number array.
   * Returns the index of the first element in the array
   * the element is equal or greater than item.
   */
  binaryFindIndexN(item: number): number;

  /**
   * Assume that this array is a sorted ascending number array.
   * Returns the last element in the array where 
   * the element is equal or less than item.
   */
  binaryFindFloor(item: number): number;
  
  /**
   * Assume that this array is a sorted ascending number array.
   * Returns the last element in the array where 
   * the element is equal or less than item.
   */
  binaryFindFloorIndex(item: number): number;
}