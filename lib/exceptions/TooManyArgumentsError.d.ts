import { ParseError } from "./ParseError";
/**
 * Class representing a TooManyArguments
 * @param err the error which will be handed over to the Error instance
 * @param parseError a possible ParseError
 */
export declare class TooManyArgumentsError extends Error {
    parseError: ParseError | undefined;
    constructor(err: string, parseError?: ParseError);
}
