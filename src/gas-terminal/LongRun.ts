/**
 * Long-Running Support
 */
import Properties = GoogleAppsScript.Properties.Properties;
import {StringUtils} from "./StringUtils";

export class LongRun {
  // singleton instance
  private static _instance:LongRun;

  // constants
  static PREFIX_RUNNING:string = "running_";
  static PREFIX_TRIGGER_KEY:string = "trigger_";
  static PREFIX_START_POS:string = "start_";
  static PREFIX_OPTION:string = "option_";
  static RUNNING_MAX_SECONDS:number = 4*60;
  static RUNNING_DELAY_MINUTES:number = 1;

  /**
   * Private constructor
   * @private
   */
  private constructor() {
  }

  /**
   * Returns singleton instance.
   */
  public static get instance():LongRun {
    if (!this._instance) {
      this._instance = new LongRun();
    }
    return this._instance;
  }

  /** start time map */
  startTimeMap:{} = {};

  /**
   * Returns if function is running now.
   * @param funcName
   */
  isRunning(funcName:string):boolean{
    // スプレッドシートのプロパティを取得
    let properties:Properties = PropertiesService.getScriptProperties();
    let running:string = properties.getProperty(LongRun.PREFIX_RUNNING+funcName);
    return !StringUtils.isEmpty(running);
  }

  /**
   * Sets max execution seconds
   * @param seconds
   */
  setMaxExecutionTime(seconds:number){
    LongRun.RUNNING_MAX_SECONDS = seconds;
  }
  /**
   * Sets the trigger's delay minutes
   * @param minutes
   */
  setTriggerDelaySecond(minutes:number){
    LongRun.RUNNING_DELAY_MINUTES = minutes;
  }

  /**
   * Returns the function parameters
   * @param funcName
   */
  getParameters(funcName: string): string[]{
    let properties:Properties = PropertiesService.getScriptProperties();
    let parameters = properties.getProperty(LongRun.PREFIX_OPTION+funcName);
    if( parameters != null ){
      parameters.split(',');
    }
    else{
      return [];
    }
  }
  /**
   * Sets the function parameters.
   * @param funcName
   * @param parameters
   */
  setParameters(funcName: string, parameters: string[]):void{
    let properties:Properties = PropertiesService.getScriptProperties();
    if( parameters != null ) {
      properties.setProperty(LongRun.PREFIX_OPTION + funcName, parameters.join(','));
    }
    else{
      properties.deleteProperty(LongRun.PREFIX_OPTION + funcName);
    }
  }

  /**
   * Starts or Resume Long-running process.
   * @returns start index ( 0 for the first time )
   */
  startOrResume(funcName:string):number{
    // save start time
    this.startTimeMap[funcName] = new Date().getTime();

    // get properties of spreadsheet
    let properties:Properties = PropertiesService.getScriptProperties();

    // set running-flag
    properties.setProperty(LongRun.PREFIX_RUNNING+funcName, "running");

    // if the trigger exists, delete it.
    this.deleteTrigger(LongRun.PREFIX_TRIGGER_KEY+funcName);

    // get start index
    let startPos:number = parseInt(properties.getProperty(LongRun.PREFIX_START_POS+funcName));
    if( !startPos ){
      return 0;
    }
    else{
      return startPos;
    }
  }

  /**
   * Determines whether the process should be suspended.
   * If it should be suspended, the next trigger will be registered.
   * @param funcName
   * @param nextIndex - start position when resuming
   * @return true - it should be suspended
   */
  checkShouldSuspend(funcName:string, nextIndex:number): boolean{
    let startTime = this.startTimeMap[funcName];
    let diff = (new Date().getDate() - startTime) / (1000 * 60 * 60);
    // If it's past the specified time, suspend the process
    if(diff >= LongRun.RUNNING_MAX_SECONDS){

      // register the next trigger and set running-flag off
      this.registerNextTrigger(funcName, nextIndex);

      return true;
    }
    else{
      return false;
    }
  }

  /**
   * Terminates long-running process
   * @param funcName
   */
  end(funcName:string):void{
    this.reset(funcName);
  }
  /**
   * Resets Long-Running variables
   * @param funcName
   */
  reset(funcName:string):void{
    // delete trigger
    this.deleteTrigger(LongRun.PREFIX_TRIGGER_KEY+funcName);
    // delete spreadsheet properties
    let properties:Properties = PropertiesService.getScriptProperties();
    properties.deleteProperty(LongRun.PREFIX_START_POS+funcName);
    properties.deleteProperty(LongRun.PREFIX_OPTION+funcName);
    properties.deleteProperty(LongRun.PREFIX_RUNNING+funcName);
  }

  /**
   * register the next trigger and set running-flag off
   * @param funcName
   * @param nextIndex - start position when resuming
   */
  registerNextTrigger(funcName:string, nextIndex:number):void{
    // get spreadsheet properties
    let properties:Properties = PropertiesService.getScriptProperties();
    properties.setProperty(LongRun.PREFIX_START_POS+funcName, String(nextIndex));  // save next start position
    this.setTrigger(LongRun.PREFIX_TRIGGER_KEY+funcName, funcName);      // set trigger

    // turn off running-flag
    properties.deleteProperty(LongRun.PREFIX_RUNNING+funcName);
  }


  /**
   * Deletes the trigger
   * @param triggerKey
   */
  private deleteTrigger(triggerKey:string):void {
    let triggerId = PropertiesService.getScriptProperties().getProperty(triggerKey);

    if(!triggerId) return;

    ScriptApp.getProjectTriggers().filter(function(trigger){
      return trigger.getUniqueId() == triggerId;
    })
      .forEach(function(trigger) {
        ScriptApp.deleteTrigger(trigger);
      });
    PropertiesService.getScriptProperties().deleteProperty(triggerKey);
  }

  /**
   * Sets a trigger
   * @param triggerKey
   * @param funcName
   */
  private setTrigger(triggerKey, funcName){
    this.deleteTrigger(triggerKey);   // delete if exists.
    let dt:Date = new Date();
    dt.setMinutes(dt.getMinutes() + LongRun.RUNNING_DELAY_MINUTES);  // will execute after the specified time
    let triggerId = ScriptApp.newTrigger(funcName).timeBased().at(dt).create().getUniqueId();
    // save the trigger id to delete the trigger later.
    PropertiesService.getScriptProperties().setProperty(triggerKey, triggerId);
  }

}
