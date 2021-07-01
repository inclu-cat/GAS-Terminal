
import {NumberUtils} from "./NumberUtils";
/**
 * Common utilities
 */
export class CommonUtils{

  /**
   * Determines if the value is null or undefined or NaN.
   * @param value
   */
  public static isEmptyObject(value:any):boolean{
    return  value == null || // this checks both null and undefined
            NumberUtils.isNaN(value);
  }

}
