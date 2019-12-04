"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandNotFoundError_1 = require("../exceptions/CommandNotFoundError");
const Command_1 = require("./Command");
const BaseCommand_1 = require("./BaseCommand");
const Commander_1 = require("../Commander");
class CommandGroup extends BaseCommand_1.BaseCommand {
    constructor(cmd, commander) {
        super(cmd, commander);
        this.commands = [];
    }
    /**
     * Retrieves the usage of the command with its parameterized names
     * @returns retrieves the complete usage of the command with its argument names
     */
    getUsage() {
        return `${this.getFullCommandName()} ${this.commands.map(cmd => cmd.getCommandName()).join("|")}`;
    }
    /**
     * checks if a client should have permission to use this command
     * @param client the client which should be checked
     */
    async hasPermission(client) {
        if (!await this.permCheck(client))
            return false;
        if (this.runHandler.length > 0)
            return true;
        return (await Promise.all(this.commands.map(cmd => cmd.hasPermission(client)))).some(result => result);
    }
    /**
     * Adds a new sub Commmand to the group
     * @param name the sub command name which should be added
     */
    addCommand(name) {
        if (!Commander_1.Commander.isValidCommandName(name))
            throw new Error("Can not create a command with length of 0");
        const cmd = new Command_1.Command(name, this.commander);
        this.commands.push(cmd);
        return cmd;
    }
    /**
     * Retrieves a subcommand by its command name
     * @param name the name which should be searched for
     */
    findSubCommandByName(name) {
        if (name.length === 0)
            throw new CommandNotFoundError_1.CommandNotFoundError(`No subcommand specified for Command ${this.getFullCommandName()}`);
        const cmd = this.commands.find(c => c.getCommandName() === name);
        if (!cmd)
            throw new CommandNotFoundError_1.CommandNotFoundError(`Command with name "${name}" has not been found on Command ${this.getFullCommandName()}!`);
        return cmd;
    }
    /** Command Groups generally dont have arguments */
    validate() {
        return {};
    }
    /**
     * retrievel all available subcommands
     * @param client the sinusbot client for which the commands should be retrieved if none has been omitted it will retrieve all available commands
     * @param cmd the command which should be searched for
     */
    getAvailableSubCommands(client, cmd) {
        const cmds = this.commands
            .filter(c => c.getCommandName() === cmd || !cmd)
            .filter(c => c.isEnabled());
        if (!client)
            return Promise.resolve(cmds);
        return this.commander.checkPermissions(cmds, client);
    }
    handleRequest(args, ev) {
        const [cmd, ...rest] = args.split(" ");
        if (cmd.length === 0)
            return this.dispatchCommand(ev);
        return this.findSubCommandByName(cmd).handleRequest(rest.join(" "), ev);
    }
}
exports.CommandGroup = CommandGroup;
