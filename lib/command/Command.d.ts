import { Commander, CommanderTextMessage } from "../Commander";
import { TeamSpeakClient } from "../util/types";
import { Argument } from "../arguments/Argument";
import { ParseError } from "../exceptions/ParseError";
import { BaseCommand } from "./BaseCommand";
import { createArgumentHandler } from "../arguments/ArgumentCreator";
export declare class Command extends BaseCommand {
    private arguments;
    constructor(cmd: string, commander: Commander);
    /**
     * Retrieves the usage of the command with its parameterized names
     * @returns retrieves the complete usage of the command with its argument names
     */
    getUsage(): string;
    /**
     * checks if a client should have permission to use this command
     * @param client the client which should be checked
     */
    hasPermission(client: TeamSpeakClient): Promise<boolean>;
    /**
     * adds an argument to the command
     * @param argument an argument to add
     */
    addArgument(callback: createArgumentHandler): this;
    /** retrieves all available arguments */
    getArguments(): Argument[];
    /**
     * Validates the command
     * @param args the arguments from the command which should be validated
     */
    validate(args: string): Record<string, any>;
    handleRequest(args: string, ev: CommanderTextMessage): void;
    /**
     * Validates the given input string to all added arguments
     * @param args the string which should get validated
     */
    validateArgs(args: string): {
        result: Record<string, any>;
        remaining: string;
        errors: ParseError[];
    };
}
