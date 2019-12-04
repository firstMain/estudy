"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class representing a ParseError
 * gets thrown when an Argument has not been parsed successful
 * @extends Error
 * @param err the error which will be handed over to the Error instance
 * @param argument the argument which failed
 */
class ParseError extends Error {
    constructor(err, argument) {
        super(err);
        this.argument = argument;
    }
}
exports.ParseError = ParseError;
