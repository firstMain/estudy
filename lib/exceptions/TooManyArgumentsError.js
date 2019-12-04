"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class representing a TooManyArguments
 * @param err the error which will be handed over to the Error instance
 * @param parseError a possible ParseError
 */
class TooManyArgumentsError extends Error {
    constructor(err, parseError) {
        super(err);
        this.parseError = parseError;
    }
}
exports.TooManyArgumentsError = TooManyArgumentsError;
