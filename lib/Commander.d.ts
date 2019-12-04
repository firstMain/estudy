import { TeamSpeak } from "./util/types";
import { TextMessage } from "./util/types";
import { Command } from "./command/Command";
import { CommandGroup } from "./command/CommandGroup";
import { BaseCommand } from "./command/BaseCommand";
import { TeamSpeakClient } from "./util/types";
import { Throttle } from "./util/Throttle";
export interface CommanderTextMessage extends TextMessage {
    arguments: Record<string, any>;
    teamspeak: TeamSpeak;
    reply: (msg: string) => Promise<any>;
}
export interface CommanderOptions {
    prefix: string;
}
export declare class Commander {
    readonly config: CommanderOptions;
    private instances;
    private commands;
    constructor(config?: Partial<CommanderOptions>);
    /** creates a new Throttle instance */
    static createThrottle(): Throttle;
    private registerBaseCommands;
    private registerHelp;
    private registerMan;
    private textMessageHandler;
    private runCommand;
    static getReplyFunction(event: TextMessage, teamspeak: TeamSpeak): (msg: string) => Promise<any>;
    checkPermissions(commands: BaseCommand[], client: TeamSpeakClient): Promise<BaseCommand[]>;
    getAvailableCommands(name?: string): BaseCommand[];
    defaultPrefix(): string;
    isPossibleCommand(text: string): boolean;
    /**
     * creates a new command
     * @param name the name of the command
     */
    createCommand(name: string): Command;
    /**
     * creates a new command
     * @param name the name of the command
     */
    createCommandGroup(name: string): CommandGroup;
    /** adds a teamspeak instance to the command handler */
    addInstance(teamspeak: TeamSpeak): Promise<this>;
    static isValidCommandName(name: string): boolean;
}
