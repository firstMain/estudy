"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParseError_1 = require("../exceptions/ParseError");
const TooManyArgumentsError_1 = require("../exceptions/TooManyArgumentsError");
const BaseCommand_1 = require("./BaseCommand");
const ArgumentCreator_1 = require("../arguments/ArgumentCreator");
class Command extends BaseCommand_1.BaseCommand {
    constructor(cmd, commander) {
        super(cmd, commander);
        this.arguments = [];
    }
    /**
     * Retrieves the usage of the command with its parameterized names
     * @returns retrieves the complete usage of the command with its argument names
     */
    getUsage() {
        return `${this.getCommandName()} ${this.getArguments().map(arg => arg.getManual()).join(" ")}`;
    }
    /**
     * checks if a client should have permission to use this command
     * @param client the client which should be checked
     */
    hasPermission(client) {
        return this.permCheck(client);
    }
    /**
     * adds an argument to the command
     * @param argument an argument to add
     */
    addArgument(callback) {
        this.arguments.push(callback(ArgumentCreator_1.createArgumentLayer()));
        return this;
    }
    /** retrieves all available arguments */
    getArguments() {
        return this.arguments;
    }
    /**
     * Validates the command
     * @param args the arguments from the command which should be validated
     */
    validate(args) {
        const { result, errors, remaining } = this.validateArgs(args);
        if (remaining.length > 0)
            throw new TooManyArgumentsError_1.TooManyArgumentsError(`Too many argument!`, errors.length > 0 ? errors[0] : undefined);
        return result;
    }
    handleRequest(args, ev) {
        this.dispatchCommand({ ...ev, arguments: this.validate(args) });
    }
    /**
     * Validates the given input string to all added arguments
     * @param args the string which should get validated
     */
    validateArgs(args) {
        args = args.trim();
        const resolved = {};
        const errors = [];
        this.getArguments().forEach(arg => {
            try {
                const [val, rest] = arg.validate(args);
                resolved[arg.getName()] = val;
                return args = rest.trim();
            }
            catch (e) {
                if (e instanceof ParseError_1.ParseError && arg.isOptional()) {
                    resolved[arg.getName()] = arg.getDefault();
                    return errors.push(e);
                }
                throw e;
            }
        });
        return { result: resolved, remaining: args, errors };
    }
}
exports.Command = Command;
