import {LogUtils} from "./gas-terminal/LogUtils";
import {LongRun} from "./gas-terminal/LongRun";

function HelloWorld(name: string) {
  LogUtils.i('Hello ' + name + ' !!');
}

function LongRunTest(
    // there must be no arguments, because the parameters must be retrieved from LongRun class.
    /* times: number, funcExecutionSeconds: number, maxExecutionSeconds: number, triggerDelayMinutes: number */
  ) {
  let longRun = LongRun.instance;

  // funcName must equal this function's name.
  const funcName = 'LongRunTest';

  // you can get the parameters from LongRun class.
  // the order of the array is the same as the order of the command definition.
  const params = longRun.getParameters(funcName);
  const times = parseInt(params[0]);
  const funcExecutionSeconds = parseInt(params[1]);
  const maxExecutionSeconds = parseInt(params[2]);
  const triggerDelayMinutes = parseInt(params[3]);

  // you can set the long-running configurations. of course you can use the default values.
  longRun.setMaxExecutionSeconds(maxExecutionSeconds); // default is 240 seconds
  longRun.setTriggerDelayMinutes(triggerDelayMinutes); // default is 1 minute

  // you should get the index to resume(zero for the first time)
  let startIndex = longRun.startOrResume(funcName);
  if( startIndex === 0 ){
    LogUtils.i('--- LongRunTest command started. ---');
  }

  try {
    // Execute the iterative process.
    for (let i = startIndex; i < times; i++) {
      LogUtils.i('Processing: ' + i);

      // Each time before executing a process, you need to check if it should be stopped or not.
      if (longRun.checkShouldSuspend(funcName, i)) {
        // if checkShouldSuspend() returns true, the next trigger has been set
        // and you should get out of the loop.
        LogUtils.i('*** The process has been suspended. ***');
        break;
      }

      // *** code your main process here! ***
      Utilities.sleep(funcExecutionSeconds * 1000); // demonstrate the process

      LogUtils.i('Processing Done!: ' + i);
    }
  }
  catch (e) {
    LogUtils.ex(e);
  }
  finally {
    // you must always call end() to reset the long-running variables if there is no next trigger.
    const finished = longRun.end(funcName);
    if( finished ){
      LogUtils.i('--- LongRunTest command finished. ---');
    }
  }
}
