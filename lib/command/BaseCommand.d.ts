import { TeamSpeakClient } from "../util/types";
import { Commander, CommanderTextMessage } from "../Commander";
import { Throttle } from "../util/Throttle";
export declare type permissionHandler = (invoker: TeamSpeakClient) => Promise<boolean> | boolean;
export declare type runHandler = (event: CommanderTextMessage) => void;
export declare abstract class BaseCommand {
    protected commander: Commander;
    protected permissionHandler: permissionHandler[];
    protected runHandler: runHandler[];
    private prefix;
    private help;
    private manual;
    private name;
    private enabled;
    private throttle;
    constructor(cmd: string, commander: Commander);
    abstract getUsage(): string;
    abstract hasPermission(client: TeamSpeakClient): Promise<boolean>;
    abstract validate(args: string): Record<string, any>;
    abstract handleRequest(args: string, ev: CommanderTextMessage): void;
    /** checks if the command is enabled */
    isEnabled(): boolean;
    /**
     * enables or disables a command
     * @param status wether the command should be enabled or disabled
     */
    enable(status: boolean): this;
    /** gets the command name without its prefix */
    getCommandName(): string;
    /** gets the command name with its prefix */
    getFullCommandName(): string;
    /** retrieves the help text */
    getHelp(): string;
    /**
     * sets a help text (should be a very brief description)
     * @param text help text
     */
    setHelp(text: string): this;
    /** returns a boolean wether a help text has been set or not */
    hasHelp(): boolean;
    /** retrieves the current manual text */
    getManual(): string;
    /** returns a boolean wether a help text has been set or not */
    hasManual(): boolean;
    /**
     * sets a prefix for this command
     * should only used in specific cases
     * by default the prefix gets inherited from its Commander
     * @param prefix the new prefix for this command
     */
    setPrefix(prefix: string): this;
    /** gets the current prefix for this command */
    getPrefix(): string;
    /**
     * sets a manual text, this function can be called multiple times
     * in order to create a multilined manual text
     * @param text the manual text
     */
    setManual(text: string): this;
    /**
     * clears the current manual text
     */
    clearManual(): this;
    /**
     * register an execution handler for this command
     * @param callback gets called whenever the command should do something
     */
    run(callback: runHandler): this;
    /**
     * adds an instance of a throttle class
     * @param throttle adds the throttle instance
     */
    addThrottle(throttle: Throttle): this;
    private handleThrottle;
    /**
     * register a permission handler for this command
     * @param callback gets called whenever the permission for a client gets checked
     */
    checkPermission(callback: permissionHandler): this;
    protected permCheck(client: TeamSpeakClient): Promise<boolean>;
    protected dispatchCommand(ev: CommanderTextMessage): void;
}
