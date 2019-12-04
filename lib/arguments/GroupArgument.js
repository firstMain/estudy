"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Argument_1 = require("./Argument");
const ParseError_1 = require("../exceptions/ParseError");
const ArgumentCreator_1 = require("./ArgumentCreator");
class GroupArgument extends Argument_1.Argument {
    constructor(type) {
        super();
        this.arguments = [];
        this.type = type;
    }
    /**
     * Validates the given String to the GroupArgument
     * @private
     * @param args the remaining args
     */
    validate(args) {
        switch (this.type) {
            case GroupArgument.Type.OR: return this.validateOr(args);
            case GroupArgument.Type.AND: return this.validateAnd(args);
        }
    }
    /**
     * Validates the given string to the "or" of the GroupArgument
     * @param {string} args the remaining args
     */
    validateOr(args) {
        const errors = [];
        const resolved = {};
        const valid = this.arguments.some(arg => {
            try {
                const result = arg.validate(args);
                resolved[arg.getName()] = result[0];
                return (args = result[1].trim(), true);
            }
            catch (e) {
                errors.push(e);
                return false;
            }
        });
        if (!valid)
            throw new ParseError_1.ParseError(`No valid match found`, this);
        return [resolved, args];
    }
    /**
     * Validates the given string to the "and" of the GroupArgument
     * @param args the remaining args
     */
    validateAnd(args) {
        const resolved = {};
        let error = null;
        this.arguments.some(arg => {
            try {
                const result = arg.validate(args);
                resolved[arg.getName()] = result[0];
                return (args = result[1].trim(), false);
            }
            catch (e) {
                error = e;
                return true;
            }
        });
        if (error !== null)
            return error;
        return [resolved, args];
    }
    /**
     * adds an argument to the command
     * @param argument an argument to add
     */
    addArgument(callback) {
        this.arguments.push(callback(ArgumentCreator_1.createArgumentLayer()));
        return this;
    }
}
exports.GroupArgument = GroupArgument;
(function (GroupArgument) {
    let Type;
    (function (Type) {
        Type["OR"] = "or";
        Type["AND"] = "and";
    })(Type = GroupArgument.Type || (GroupArgument.Type = {}));
})(GroupArgument = exports.GroupArgument || (exports.GroupArgument = {}));
