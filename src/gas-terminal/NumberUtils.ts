/**
 * Utilities for numbers.
 */
export class NumberUtils{

  /**
   * Determines whether value is finite.
   * @param value
   * @returns {boolean}
   */
  public static isFinite(value):boolean {
    return typeof value === "number" && isFinite(value);
  }
  /**
   * Determines whether value is Nan and is type of Number.
   * @param value
   * @returns {boolean}
   */
  public static isNaN(value):boolean {
    return typeof value === "number" && isNaN(value);
  }

  /**
   * Determines whether value is type of Number.
   * @param value
   */
  public static isNumberType(value):boolean{
    return typeof value === "number";
  }

  /**
   * Returns the max value in the array.
   * @param nums
   */
  public static getMax(nums:number[]){
    return Math.max.apply(null, nums);
  }
  /**
   * Returns the min value in the array.
   * @param nums
   */
  public static getMin(nums:number[]){
    return Math.min.apply(null, nums);
  }

}
