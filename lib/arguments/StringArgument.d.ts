import { Argument } from "./Argument";
export declare class StringArgument extends Argument {
    private regex;
    private maxlen;
    private minlen;
    private whitelist;
    private uppercase;
    private lowercase;
    /**
     * Validates the given String to the StringArgument
     * @param args the remaining args
     */
    validate(args: string): string[];
    /**
     * Validates the given string to the StringArgument params
     * @param arg string argument that should be parsed
     * @param rest the remaining args
     */
    protected _validate(arg: string, ...rest: string[]): string[];
    /**
     * Matches a regular expression pattern
     * @param regex the regex which should be validated
     */
    match(regex: RegExp): this;
    /**
     * Sets the maximum Length of the String
     * @param len the maximum length of the argument
     */
    maximum(len: number): this;
    /**
     * Sets the minimum Length of the String
     * @param len the minimum length of the argument
     */
    minimum(len: number): this;
    /** converts the input to an upper case string */
    forceUpperCase(): this;
    /** converts the input to a lower case string */
    forceLowerCase(): this;
    /**
     * creates a list of available whitelisted words
     * @param words array of whitelisted words
     */
    allow(words: string[]): this;
}
