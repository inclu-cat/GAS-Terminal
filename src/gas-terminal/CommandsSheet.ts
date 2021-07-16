import Range = GoogleAppsScript.Spreadsheet.Range;
import {CommandDefinition} from "./CommandDefinition";
import {SheetBase} from "./0/SheetBase";
import {StringUtils} from "./StringUtils";
/**
 * The class that represents the command definition sheet.
 */
export class CommandsSheet extends SheetBase{
  // Constants of the command definition sheet
  private static _SHEET_NAME:string = 'Commands';
  private static _ROW_INDEX_START:number = 1;
  private static _COL_COUNT:number = 9;
  private static _COL_INDEX_NAME:number = 0;
  private static _COL_INDEX_FUNC:number = 1;
  private static _COL_INDEX_DESCRIPTION:number = 2;
  private static _COL_INDEX_IS_LONG_RUN:number = 3;
  private static _COL_INDEX_PARAM1:number = 4;
  private static _COL_INDEX_PARAM2:number = 5;
  private static _COL_INDEX_PARAM3:number = 6;
  private static _COL_INDEX_PARAM4:number = 7;
  private static _COL_INDEX_PARAM5:number = 8;
  /** Singleton instance */
  private static _instance:CommandsSheet;
  /** Data */
  private _commands:CommandDefinition[] = [];

  /**
   * Private constructor
   * @param sheet
   */
  private constructor(sheet:GoogleAppsScript.Spreadsheet.Sheet) {
    super(sheet);
  }
  /**
   * Returns singleton instance.
   */
  public static get instance():CommandsSheet {
    if (!this._instance) {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this._SHEET_NAME);
      this._instance = new CommandsSheet(sheet);
      this._instance.load();
    }
    return this._instance;
  }

  /**
   * Loads the sheet's data
   */
  public load():void{
      this._commands = [];
      let dataRange:Range = this.getTableRange(
        CommandsSheet._ROW_INDEX_START,0,-1, CommandsSheet._COL_COUNT);
      if( dataRange != null ) {
          let values:any[][] = dataRange.getValues();
          for (let i = 0; i < dataRange.getNumRows(); i++) {
              let row:CommandDefinition = this.readRow(values[i]);
              if (row.isValid()) {
                  this._commands.push(row);
              }
          }
      }
  }

  /**
   * Creates a command definition object from a single line of data.
   * @param row
   * @returns CommandDefinition
   */
  protected readRow(row:any[]): CommandDefinition{
    // makes parameter array
    let params:string[] = [];
    let colIndexes:number[] = [
      CommandsSheet._COL_INDEX_PARAM1,
      CommandsSheet._COL_INDEX_PARAM2,
      CommandsSheet._COL_INDEX_PARAM3,
      CommandsSheet._COL_INDEX_PARAM4,
      CommandsSheet._COL_INDEX_PARAM5
    ];
    for( let i = 0; i < colIndexes.length; i++ ){
      let param:string = String(row[colIndexes[i]]);
      if( StringUtils.isEmpty(param) ){
          break;
      }
      params.push(param);
    }
    // make command definition object
    return new CommandDefinition(
      String(row[CommandsSheet._COL_INDEX_NAME]),
      String(row[CommandsSheet._COL_INDEX_FUNC]),
      String(row[CommandsSheet._COL_INDEX_DESCRIPTION]),
      String(row[CommandsSheet._COL_INDEX_IS_LONG_RUN]).toUpperCase() == 'TRUE',
      params
    );
  }

  /**
   * Returns the specified command definition object.
   * @param commandName
   * @returns {CommandDefinition}
   */
  public findCommand(commandName:string):CommandDefinition{
    let find:CommandDefinition = null;
    for( let i = 0; i < this._commands.length; i++ ){
      let command:CommandDefinition = this._commands[i];
      if( command.commandName == commandName ){
        find = command;
      }
    }
    return find;
  }

  get commands():CommandDefinition[] {
      return this._commands;
  }
}
