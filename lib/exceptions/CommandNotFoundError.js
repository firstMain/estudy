"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** class representing a SubCommandNotFound */
class CommandNotFoundError extends Error {
    constructor(err) {
        super(err);
    }
}
exports.CommandNotFoundError = CommandNotFoundError;
