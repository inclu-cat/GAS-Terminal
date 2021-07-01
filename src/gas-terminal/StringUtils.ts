import {NumberUtils} from "./NumberUtils";
import {CommonUtils} from "./CommonUtils";

/** Date Format Object */
let dateFormat = {
  _fmt : {
    "yyyy": function(date) { return date.getFullYear() + ''; },
    "MM": function(date) { return ('0' + (date.getMonth() + 1)).slice(-2); },
    "dd": function(date) { return ('0' + date.getDate()).slice(-2); },
    "hh": function(date) { return ('0' + date.getHours()).slice(-2); },
    "mm": function(date) { return ('0' + date.getMinutes()).slice(-2); },
    "ss": function(date) { return ('0' + date.getSeconds()).slice(-2); }
  },
  _priority : ["yyyy", "MM", "dd", "hh", "mm", "ss"],
  format: function(date, format){
    return this._priority.reduce((res, fmt) => res.replace(fmt, this._fmt[fmt](date)), format)
  }
};

/**
 * Utilities for Strings
 */
export class StringUtils{
  /**
   * Returns whether the string is empty.
   */
  public static isEmpty(str:string):boolean{
    return str === "" || CommonUtils.isEmptyObject(str);
  }


  /**
   * Formats the date.
   * @param date
   * @param format
   * @returns {string}
   */
  public static dateFormat(date:Date, format:string):string{
    if( !this.isValidDate(date) ){
      return null; // 日付ではない
    }
    else {
      return dateFormat.format(date, format);
    }
  }
  /**
   * Formats the date. ( by using string )
   * @param dateStr
   * @param format
   * @returns {string}
   */
  public static dateFormatByString(dateStr:string, format:string):string{
    if(dateStr == null){
      return null;
    }
    return this.dateFormat(new Date(dateStr), format);
  }
  /**
   * Returns whether the date is valid.
   * @param date
   */
  public static isValidDate(date:Date):boolean{
    return ! NumberUtils.isNaN(date.getTime());
  }
  /**
   * Returns whether the date is valid.( by using string )
   * @param dateStr
   */
  public static isValidDateString(dateStr:string):boolean{
    if(dateStr == null){
      return false;
    }
    let date = new Date(dateStr);
    return this.isValidDate(date);
  }

  /**
   * Returns a zero padding string.
   * @param size number of zero
   * @param value integer
   */
  public static zeroPadding(size:number, value:number):string{
    let padding:string = Array(size+1).join("0");
    return (padding + value).slice(size*-1);
  }

  /**
   * Returns whether the string consists only number characters.
   * @param val
   * @returns {boolean}
   */
  public static isNumberOnly(val:string):boolean{
    let regex = new RegExp("/^[0-9]+$/");
    return regex.test(val);
  }
}
