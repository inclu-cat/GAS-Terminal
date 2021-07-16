import {SettingsSheet} from "./SettingsSheet";
import {SettingsConst} from "./SettingsConst";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import {TerminalSheet} from "./TerminalSheet";
import {StringUtils} from "./StringUtils";
import {CommandDefinition} from "./CommandDefinition";
import {CommandsSheet} from "./CommandsSheet";
import {LogUtils} from "./LogUtils";
import {LongRun} from "./LongRun";

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
      // get the command name,
      let commandName:string = TerminalSheet.instance.getCommandName();
      if( StringUtils.isEmpty(commandName) ){
          Browser.msgBox("You should select command first")
          return;
      }
      // confirm with the user.
      let ret:string = Browser.msgBox("Are you sure to execute ["+commandName+"]?", Browser.Buttons.YES_NO);
      if( ret != "yes" ){
          return;
      }

      // get the command define.
      let commandDef:CommandDefinition = CommandsSheet.instance.findCommand(commandName);

      // check if the command has already run.
      if( LongRun.instance.isRunning(commandDef.funcName) ){
        let ret:string = Browser.msgBox('[' + commandDef.commandName + '] is already running.' +
          'Do you want to ignore it and run?', Browser.Buttons.YES_NO);
        if( ret != "yes" ){
          return;
        }
      }

      // long-run commands
      if( commandDef.isLongRun ) {
        this.executeLongRunCommand(commandDef);
      }
      // the ordinarily commands
      else {
        this.executeNormalCommand(commandDef);
      }
    }
    catch (e) {
      LogUtils.ex(e);
    }
  }

  /**
   * Executes normal command
   * @param commandDef
   * @private
   */
  private executeNormalCommand(commandDef:CommandDefinition): void{
    let params:string[] = TerminalSheet.instance.getParams(commandDef.getParamCount());
    let paramsStr:string = "";

    // clear the log.
    TerminalSheet.instance.clearLog();

    // make the parameter string.
    if (params.length > 0) {
      paramsStr = '"' + params.join('","') + '"';
    }

    // make the function call string.
    let callStr:string = commandDef.funcName + "(" + paramsStr + ")";

    try {
      // set running-flg on
      LongRun.instance.setRunning(commandDef.funcName, true);
      // execute
      eval(callStr);
    }
    finally {
      // set running-flg off
      LongRun.instance.setRunning(commandDef.funcName, false);
    }
  }

  /**
   * Executes long-running command
   * @param commandDef
   * @private
   */
  private executeLongRunCommand(commandDef:CommandDefinition): void{
    let params:string[] = TerminalSheet.instance.getParams(commandDef.getParamCount());

    // check if the command has already run.
    if( LongRun.instance.existsNextTrigger(commandDef.funcName) ){
      let ret:string = Browser.msgBox('[' + commandDef.commandName + '] already has next trigger.' +
        'Do you want to ignore it and run?', Browser.Buttons.YES_NO);
      if( ret != "yes" ){
        return;
      }
    }

    // clear the log.
    TerminalSheet.instance.clearLog();

    // clear the variables
    LongRun.instance.reset(commandDef.funcName);
    // store the parameters and paramsStr should be empty.
    LongRun.instance.setParameters(commandDef.funcName, params);

    // make the function call string.
    let callStr:string = commandDef.funcName + "()";

    // execute
    eval(callStr);
  }
}
