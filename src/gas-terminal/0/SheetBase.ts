import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import Range = GoogleAppsScript.Spreadsheet.Range;
import File = GoogleAppsScript.Drive.File;
import Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;
import {FileUtils} from "../FileUtils";
/**
 * Base Class for handling Google Sheets
 */
export abstract class SheetBase{
  /** Sheet object */
  protected _sheet:Sheet;

  /**
   * Constructor
   * @param sheet
   */
  protected constructor(sheet:Sheet){
    this._sheet = sheet;
  }
  /**
   * Returns the sheet's file id.
   * @returns {string}
   */
  public getFileId():string{
    return this._sheet.getParent().getId();
  }
  /**
   * Returns the sheet file.
   * @returns {string}
   */
  public getFile():File{
    return FileUtils.getFileById(this.getFileId());
  }
  /**
   * Returns the sheet object.
   * @returns {Sheet}
   */
  public getSheet():Sheet{
    return this._sheet;
  }

  /**
   * Set the sheet object.
   * @param sheet
   */
  public setSheet(sheet:Sheet):void{
    this._sheet = sheet;
  }

  /**
   * Returns spreadsheet object.
   * @returns {Spreadsheet}
   */
  public getSpreadSheet():Spreadsheet{
    return this._sheet.getParent();
  }

  /**
   * Checks if the cell is of a particular type.
   * If not, throws exception.
   * @param values
   * @param rowIndex
   * @param colIndex
   * @param correctType
   */
  protected checkCellTypeForArray(values:any[][], rowIndex:number, colIndex:number, correctType:string):void{
    let cellType = typeof values[rowIndex][colIndex];
    if( cellType !== correctType ){
      throw new Error("Invalid type[row:" + (rowIndex+1) + ", col:" + (colIndex+1) + "]" +
          "[expected type：" + correctType + "][real type：" + cellType + "]");
    }
  }
  /**
   * Checks if the cell is of a particular type.
   * If not, throws exception.
   * @param value
   * @param cellName
   * @param correctType
   */
  protected checkCellTypeForCell(value:any, cellName:string, correctType:string):void{
    let cellType = typeof value;
    if( cellType !== correctType ){
      throw new Error("Invalid type[cell：" + cellName + "]" +
        "[expected type：" + correctType + "][real type：" + cellType + "]");
    }
  }

  /**
   * Returns the number of rows in the data range.
   */
  protected getDataRangeRowCount():number{
    let dataRange:Range = this._sheet.getDataRange();
    return dataRange.getLastRow();
  }

  /**
   * Returns the specified range of the data range as Range.
   * @param rowIndexStart
   * @param colIndexStart
   * @param rowCount the number of rows to retrieve (-1: to get the all data)
   * @param colCount
   * @returns {Range}
   */
  protected getTableRange(rowIndexStart:number, colIndexStart:number, rowCount:number, colCount:number):Range{
    let ret:Range = null;
    if( rowCount == -1 ){
      let dataRange:Range = this._sheet.getDataRange();
      let dataRowCount:number = dataRange.getLastRow() - rowIndexStart;
      if( dataRowCount > 0 ){
        ret = this._sheet.getRange(rowIndexStart+1, colIndexStart+1, dataRowCount, colCount);
      }
    }
    else if( rowCount > 0 ){
      let sheetRowCount:number = this._sheet.getMaxRows();
      if( rowCount > sheetRowCount ){
        rowCount = sheetRowCount;
      }
      ret = this._sheet.getRange(rowIndexStart+1, colIndexStart+1, rowCount, colCount);
    }
    return ret;
  }
}
