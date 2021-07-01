/**
 * Logger interface
 */
export interface LogInterface{
  /**
   * Outputs a log.
   */
  outputLog(message:string):void;
}
/**
 * Utilities for logging.
 */
export class LogUtils{
  /** Logger */
  private static _logger:LogInterface = null;

  static set logger(value:LogInterface) {
    this._logger = value;
  }

  /**
   * Outputs a information log.
   */
  public static i(message:any){
    message = "[INF] " + message;
    console.info(message);
    this.logCommon(message, 0);
  }
  /**
   * Outputs a warning log.
   */
  public static w(message:any){
    message = "[WARN] " + message;
    console.warn(message);
    this.logCommon(message, 1);
  }
  /**
   * Outputs a error log.
   */
  public static e(message:any){
    message = "[ERR] " + message;
    console.error(message);
    this.logCommon(message, 2);
  }

  /**
   * Outputs a exception log.
   */
  public static ex(e:any){
    let message:string = 'FATAL EXCEPTION: ' + e.fileName + ': ' + e.lineNumber + '\n' + e.name + ': ' + e.message + '\n' + e.stack;
    console.error(message);
    this.logCommon(message, 2);
  }
  /**
   * Outputs a exception log (as warning).
   */
  public static exWarn(e:any){
    let message:string = 'FATAL EXCEPTION: ' + e.fileName + ': ' + e.lineNumber + '\n' + e.name + ': ' + e.message + '\n' + e.stack;
    console.warn(message);
    this.logCommon(message, 1);
  }

  /**
   * Outputs a log. ( common processing )
   * @param message
   * @param type 0:info 1:warn 2:error
   */
  private static logCommon(message:string, type:number){
    // Script log
    Logger.log(message);

    // If logger is set
    if( this._logger ){
      this._logger.outputLog(message);
    }
  }

}
