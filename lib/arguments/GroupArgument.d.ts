import { Argument } from "./Argument";
import { createArgumentHandler } from "./ArgumentCreator";
export declare class GroupArgument extends Argument {
    private type;
    private arguments;
    constructor(type: GroupArgument.Type);
    /**
     * Validates the given String to the GroupArgument
     * @private
     * @param args the remaining args
     */
    validate(args: string): (string | Record<string, any>)[];
    /**
     * Validates the given string to the "or" of the GroupArgument
     * @param {string} args the remaining args
     */
    private validateOr;
    /**
     * Validates the given string to the "and" of the GroupArgument
     * @param args the remaining args
     */
    private validateAnd;
    /**
     * adds an argument to the command
     * @param argument an argument to add
     */
    addArgument(callback: createArgumentHandler): this;
}
export declare namespace GroupArgument {
    enum Type {
        OR = "or",
        AND = "and"
    }
}
