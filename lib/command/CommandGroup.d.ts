import { TeamSpeakClient } from "../util/types";
import { Command } from "./Command";
import { BaseCommand } from "./BaseCommand";
import { Commander, CommanderTextMessage } from "../Commander";
export declare class CommandGroup extends BaseCommand {
    private commands;
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
     * Adds a new sub Commmand to the group
     * @param name the sub command name which should be added
     */
    addCommand(name: string): Command;
    /**
     * Retrieves a subcommand by its command name
     * @param name the name which should be searched for
     */
    findSubCommandByName(name: string): Command;
    /** Command Groups generally dont have arguments */
    validate(): {};
    /**
     * retrievel all available subcommands
     * @param client the sinusbot client for which the commands should be retrieved if none has been omitted it will retrieve all available commands
     * @param cmd the command which should be searched for
     */
    getAvailableSubCommands(client?: TeamSpeakClient, cmd?: string): Promise<BaseCommand[]>;
    handleRequest(args: string, ev: CommanderTextMessage): void;
}
