import {StringUtils} from "./StringUtils";

/**
 * The class that represents a command definition
 */
export class CommandDefinition {
    /** Command name */
    private _commandName:string;
    /** Function name */
    private _funcName:string;
    /** Description */
    private _description:string;
    /** Parameters */
    private _params:string[] = [];

    /**
     * Constructor
     * @param commandName
     * @param funcName
     * @param description
     * @param params
     */
    constructor(commandName:string, funcName:string, description:string, params:string[]) {
        this._commandName = commandName;
        this._funcName = funcName;
        this._description = description;
        this._params = params;
    }

    /**
     * Returns if this definition is valid.
     */
    public isValid():boolean{
        return  !StringUtils.isEmpty(this._commandName) &&
            !StringUtils.isEmpty(this._funcName);
    }

    get commandName():string {
        return this._commandName;
    }

    set commandName(value:string) {
        this._commandName = value;
    }

    get funcName():string {
        return this._funcName;
    }

    set funcName(value:string) {
        this._funcName = value;
    }

    get description():string {
        return this._description;
    }

    set description(value:string) {
        this._description = value;
    }

    get params():string[] {
        return this._params;
    }

    set params(value:string[]) {
        this._params = value;
    }
}
