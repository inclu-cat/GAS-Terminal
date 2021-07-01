import {SettingsSheet} from "./SettingsSheet";
import {SettingsConst} from "./SettingsConst";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import {TerminalSheet} from "./TerminalSheet";
import {StringUtils} from "./StringUtils";
import {CommandDefinition} from "./CommandDefinition";
import {CommandsSheet} from "./CommandsSheet";
import {LogUtils} from "./LogUtils";

/**
 * Runs when a user opens a spreadsheet.
 */
function onOpen(e) {
  // Clear all
  TerminalSheet.instance.clearAll(true);
}

/**
 * Runs when a user changes a value in a spreadsheet.
 */
function onEdit(e){
  let settingsSheet:SettingsSheet = SettingsSheet.instance;
  let terminalSheetName:string = settingsSheet.getValue(SettingsConst.SECTION_TERMINAL, SettingsConst.KEY_TERMINAL_SHEET_NAME);
  let commandNameCell:string = settingsSheet.getValue(SettingsConst.SECTION_TERMINAL, SettingsConst.KEY_TERMINAL_CELL_COMMAND);

  const sheet:Sheet = e.source.getActiveSheet();
  const range = e.source.getActiveRange();
  // Checks if command name changed
  if( sheet.getName() == terminalSheetName && range.getA1Notation() == commandNameCell ){
    new TerminalController().onChangeCommandName();
  }
}
/**
 * Runs when a user clicks the Execute button.
 */
function onExecuteButtonClick():void{
  new TerminalController().onExecuteButtonClick();
}

/**
 * GAS Terminal Controller
 */
export class TerminalController {
  /**
   * Handles command name changed.
   */
  public onChangeCommandName():void{
    try {
      // Clear all except command name
      TerminalSheet.instance.clearAll(false);
      // Get command name
      let commandName:string = TerminalSheet.instance.getCommandName();
      if( StringUtils.isEmpty(commandName) ){
        return;
      }
      // Get command define
      let commandDef:CommandDefinition = CommandsSheet.instance.findCommand(commandName);
      // Update view
      TerminalSheet.instance.setDescription(commandDef.description);
      TerminalSheet.instance.setParamsView(commandDef.params);

    }
    catch (e) {
      LogUtils.ex(e);
    }
  }

  /**
   * Handles clicking the Execute button.
   */
  public onExecuteButtonClick():void{
    try {
      // Gets the command name,
      let commandName:string = TerminalSheet.instance.getCommandName();
      if( StringUtils.isEmpty(commandName) ){
          Browser.msgBox("You should select command first")
          return;
      }
      // Confirms with the user.
      let ret:string = Browser.msgBox("Are you sure to execute ["+commandName+"]？", Browser.Buttons.YES_NO);
      if( ret != "yes" ){
          return;
      }

      // Clears the log.
      TerminalSheet.instance.clearLog();

      // Sets the TerminalSheet as logger.
      LogUtils.logger = TerminalSheet.instance;

      // Gets the command define.
      let commandDef:CommandDefinition = CommandsSheet.instance.findCommand(commandName);

      // Makes the parameter string.
      let params:string[] = TerminalSheet.instance.getParams();
      let paramsStr:string = "";
      if( params.length > 0 ){
          paramsStr = '"' + params.join('","') + '"';
      }

      // Make the function call string.
      let callStr:string = commandDef.funcName + "(" + paramsStr + ")";

      // // TODO debug
      // LogUtils.i("callStr="+callStr);

      // Executes
      eval(callStr);

    }
    catch (e) {
      LogUtils.ex(e);
    }
  }
}
