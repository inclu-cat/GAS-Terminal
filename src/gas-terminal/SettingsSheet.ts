
import {SheetBase} from "./0/SheetBase";
import {SettingsConst} from "./SettingsConst";
import Range = GoogleAppsScript.Spreadsheet.Range;
import {StringUtils} from "./StringUtils";
/**
 * The class that represents the settings sheet.
 */
export class SettingsSheet extends SheetBase{
  private _settingMap:{} = {};
  private static _instance:SettingsSheet;

  /**
   * Private constructor
   * @param sheet Spreadsheet.Sheet
   * @private
   */
  private constructor(sheet:GoogleAppsScript.Spreadsheet.Sheet) {
    super(sheet);
  }

  /**
   * Returns singleton instance.
   */
  public static get instance():SettingsSheet {
    if (!this._instance) {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SettingsConst.SHEET_NAME);
      if( sheet == null ){
        throw new Error("Sheet[" + SettingsConst.SHEET_NAME + "] not found");
      }
      this._instance = new SettingsSheet(sheet);
      this._instance.load();
    }
    return this._instance;
  }

  /**
   * Loads the sheet's data.
   */
  public load():void{
    this._settingMap = {};

    let dataRange:Range = this._sheet.getDataRange();
    let values:any[][] = dataRange.getValues();
    for(let i = SettingsConst.START_ROW_INDEX; i < dataRange.getNumRows(); i++ ){

      let row:[string,string,string] = this.readRow(values[i]);
      let section:string = row[0];
      let key:string = row[1];
      let value:string = row[2];
      if( StringUtils.isEmpty(section) || StringUtils.isEmpty(key) ){
        continue;
      }
      if( !(section in this._settingMap) ) {
        this._settingMap[section] = {};
      }
      this._settingMap[section][key] = value;
    }
  }

  /**
   * Creates a settings information object from a single line of data.
   * @param row Spreadsheet's row
   * @protected
   */
  protected readRow(row:any[]):[string,string,string]{
    if( row.length <= SettingsConst.COL_INDEX_SECTION ||
      row.length <= SettingsConst.COL_INDEX_KEY ||
      row.length <= SettingsConst.COL_INDEX_VALUE ){
      return [null,null,null];
    }

    return [
      row[SettingsConst.COL_INDEX_SECTION],
      row[SettingsConst.COL_INDEX_KEY],
      row[SettingsConst.COL_INDEX_VALUE]
    ];
  }

  /**
   * Returns the value of a given key.
   * @param section
   * @param key
   */
  public getValue(section:string, key:string):string{
    if( !(section in this._settingMap) ) {
      throw new Error("Setting Not Found [" + section + ":" + key + "]");
    }
    else{
      if( !(key in this._settingMap[section]) ) {
        throw new Error("Setting Not Found [" + section + ":" + key + "]");
      }
      return this._settingMap[section][key];
    }
  }
  /**
   * Returns the value of a given key as Integer.
   * @param section
   * @param key
   */
  public getValueAsInt(section:string, key:string):number{
    return parseInt(this.getValue(section,key));
  }
  /**
   * Returns the value of a given key as Float.
   * @param section
   * @param key
   */
  public getValueAsFloat(section:string, key:string):number{
    return parseFloat(this.getValue(section,key));
  }

  /**
   * For debug
   */
  public dbgGetAllSetting():{}{
    return this._settingMap;
  }

}
