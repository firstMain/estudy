export declare abstract class Argument {
    private opt;
    private name;
    private display;
    private displayDefault;
    private default;
    abstract validate(args: string): Array<any>;
    /**
     * Sets an Argument as optional
     * if the argument has not been parsed successful it will use the first argument which has been given inside this method
     * @param fallback the default value which should be set if this parameter has not been found
     * @param displayDefault wether it should display the default value when called with the #getUsage method
     */
    optional(fallback?: any, displayDefault?: boolean): this;
    /** retrieves the default value if it had been set */
    getDefault(): any;
    /** checks if the Argument has a default value */
    hasDefault(): boolean;
    /** gets the manual of a command */
    getManual(): string;
    /** checks if the Argument is optional */
    isOptional(): boolean;
    /**
     * Sets a name for the argument to identify it later when the command gets dispatched
     * This name will be used when passing the parsed argument to the exec function
     * @param name sets the name of the argument
     * @param display sets a beautified display name which will be used when the getManual command gets executed, if none given it will use the first parameter as display value
     */
    setName(name: string, display?: string): this;
    /**
     * Retrieves the name of the Argument
     * @returns {string} retrieves the arguments name
     */
    getName(): string;
}
