/**
 * The class that represents the Terminal sheet.
 */
import {SettingsSheet} from "./SettingsSheet";
import {SettingsConst} from "./SettingsConst";
import {SheetBase} from "./0/SheetBase";
import Range = GoogleAppsScript.Spreadsheet.Range;
import {StringUtils} from "./StringUtils";
import {LogUtils} from "./LogUtils";

export class TerminalSheet extends SheetBase {
  protected _CELL_COMMAND:string;
  protected _CELL_DESCRIPTION:string;
  protected _CELL_PARAM:string[] = [];
  protected _CELL_RESULTS:string;

  private static _instance:TerminalSheet;

  /**
   * Private constructor
   * @param sheet
   */
  private constructor(sheet:GoogleAppsScript.Spreadsheet.Sheet) {
    super(sheet);

    let settingsSheet:SettingsSheet = SettingsSheet.instance;
    this._CELL_COMMAND = settingsSheet.getValue(SettingsConst.SECTION_TERMINAL, SettingsConst.KEY_TERMINAL_CELL_COMMAND);
    this._CELL_DESCRIPTION = settingsSheet.getValue(SettingsConst.SECTION_TERMINAL, SettingsConst.KEY_TERMINAL_CELL_DESCRIPTION);
    this._CELL_PARAM.push(settingsSheet.getValue(SettingsConst.SECTION_TERMINAL, SettingsConst.KEY_TERMINAL_CELL_PARAM1));
    this._CELL_PARAM.push(settingsSheet.getValue(SettingsConst.SECTION_TERMINAL, SettingsConst.KEY_TERMINAL_CELL_PARAM2));
    this._CELL_PARAM.push(settingsSheet.getValue(SettingsConst.SECTION_TERMINAL, SettingsConst.KEY_TERMINAL_CELL_PARAM3));
    this._CELL_PARAM.push(settingsSheet.getValue(SettingsConst.SECTION_TERMINAL, SettingsConst.KEY_TERMINAL_CELL_PARAM4));
    this._CELL_PARAM.push(settingsSheet.getValue(SettingsConst.SECTION_TERMINAL, SettingsConst.KEY_TERMINAL_CELL_PARAM5));
    this._CELL_RESULTS = settingsSheet.getValue(SettingsConst.SECTION_TERMINAL, SettingsConst.KEY_TERMINAL_CELL_RESULTS);
  }

  /**
   * Returns singleton instance.
   */
  public static get instance():TerminalSheet {
    if (!this._instance) {
      let settingsSheet:SettingsSheet = SettingsSheet.instance;
      let sheetName:string = settingsSheet.getValue(SettingsConst.SECTION_TERMINAL, SettingsConst.KEY_TERMINAL_SHEET_NAME);
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      this._instance = new TerminalSheet(sheet);
    }
    return this._instance;
  }
  /**
   * Loads the sheet's data.
   */
  public load():void{
    throw Error("not supported");
  }

  /**
   * Returns the name of the current command.
   * @returns {String}
   */
  public getCommandName():string{
    return String(this._sheet.getRange(this._CELL_COMMAND).getValue());
  }
  /**
   * Returns the specified parameter.
   * @param num
   */
  public getParam(num:number):string{
    return String(this._sheet.getRange(this._CELL_PARAM[num]).getValue());
  }

  /**
   * Returns the parameters.
   */
  public getParams(paramCount: number):string[]{
    let ret:string[] = [];
    for( let i = 0; i < paramCount && i < this._CELL_PARAM.length; i++ ){
      let range:Range = this._sheet.getRange(this._CELL_PARAM[i]);
      let value:string = String(range.getValue());
      ret.push(StringUtils.isEmpty(value)?"":value);
    }
    return ret;
  }
  /**
   * Sets the appearance of the parameter fields.
   */
  public setParamsView(paramDefs:string[]):void{
    for( let i = 0; i < this._CELL_PARAM.length; i++ ){
      let range:Range = this._sheet.getRange(this._CELL_PARAM[i]);
      range.setValue("");
      if( paramDefs.length > i ){
        if( !StringUtils.isEmpty(paramDefs[i]) ){
          range.setBackground("black");
          range.setNote(paramDefs[i]);
        }
        else{
          range.setBackground("gray");
          range.setNote("");
        }
      }
    }
  }
  /**
   * Sets the description
   * @param value
   */
  public setDescription(value:string):void{
    this._sheet.getRange(this._CELL_DESCRIPTION).setValue(value);
  }

  /**
   * Outputs a log.
   * @param message
   */
  public outputLog(message:string):void{
    let logRange:Range = this._sheet.getRange(this._CELL_RESULTS);
    let value:string = String(logRange.getValue());
    value += "\n" + message;
    logRange.setValue(value);
  }
  /**
   * Clears logs.
   */
  public clearLog():void{
    this._sheet.getRange(this._CELL_RESULTS).setValue("");
  }

  /**
   * Clears all inputs.
   * @param clearCommandName
   */
  public clearAll(clearCommandName:boolean):void{
    if( clearCommandName ) {
      this._sheet.getRange(this._CELL_COMMAND).setValue("");
    }
    this._sheet.getRange(this._CELL_DESCRIPTION).setValue("");
    for( let i = 0; i < this._CELL_PARAM.length; i++ ){
      let range:Range = this._sheet.getRange(this._CELL_PARAM[i]);
      range.setValue("");
      range.setBackground("gray");
      range.setNote("");
    }
    this._sheet.getRange(this._CELL_RESULTS).setValue("");
  }

}
