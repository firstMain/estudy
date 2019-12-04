"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Throttle_1 = require("../util/Throttle");
const ThrottleError_1 = require("../exceptions/ThrottleError");
class BaseCommand {
    constructor(cmd, commander) {
        this.permissionHandler = [];
        this.runHandler = [];
        this.prefix = "";
        this.help = "";
        this.manual = [];
        this.enabled = true;
        this.name = cmd;
        this.commander = commander;
    }
    /** checks if the command is enabled */
    isEnabled() {
        return this.enabled;
    }
    /**
     * enables or disables a command
     * @param status wether the command should be enabled or disabled
     */
    enable(status) {
        this.enabled = status;
        return this;
    }
    /** gets the command name without its prefix */
    getCommandName() {
        return this.name;
    }
    /** gets the command name with its prefix */
    getFullCommandName() {
        return `${this.getPrefix()}${this.getCommandName()}`;
    }
    /** retrieves the help text */
    getHelp() {
        return this.help;
    }
    /**
     * sets a help text (should be a very brief description)
     * @param text help text
     */
    setHelp(text) {
        this.help = text;
        return this;
    }
    /** returns a boolean wether a help text has been set or not */
    hasHelp() {
        return this.help !== "";
    }
    /** retrieves the current manual text */
    getManual() {
        return this.manual.join("\r\n");
    }
    /** returns a boolean wether a help text has been set or not */
    hasManual() {
        return this.manual.length > 0;
    }
    /**
     * sets a prefix for this command
     * should only used in specific cases
     * by default the prefix gets inherited from its Commander
     * @param prefix the new prefix for this command
     */
    setPrefix(prefix) {
        this.prefix = prefix;
        return this;
    }
    /** gets the current prefix for this command */
    getPrefix() {
        if (this.prefix.length > 0)
            return this.prefix;
        return this.commander.config.prefix;
    }
    /**
     * sets a manual text, this function can be called multiple times
     * in order to create a multilined manual text
     * @param text the manual text
     */
    setManual(text) {
        this.manual.push(text);
        return this;
    }
    /**
     * clears the current manual text
     */
    clearManual() {
        this.manual = [];
        return this;
    }
    /**
     * register an execution handler for this command
     * @param callback gets called whenever the command should do something
     */
    run(callback) {
        this.runHandler.push(callback);
        return this;
    }
    /**
     * adds an instance of a throttle class
     * @param throttle adds the throttle instance
     */
    addThrottle(throttle) {
        this.throttle = throttle;
        return this;
    }
    handleThrottle(client) {
        if (!(this.throttle instanceof Throttle_1.Throttle))
            return;
        if (this.throttle.isThrottled(client)) {
            const time = (this.throttle.timeTillNextCommand(client) / 1000).toFixed(1);
            throw new ThrottleError_1.ThrottleError(`You can use this command again in ${time} seconds!`);
        }
        else {
            this.throttle.throttle(client);
        }
    }
    /**
     * register a permission handler for this command
     * @param callback gets called whenever the permission for a client gets checked
     */
    checkPermission(callback) {
        this.permissionHandler.push(callback);
        return this;
    }
    async permCheck(client) {
        return (await Promise.all(this.permissionHandler.map(cb => cb(client)))).every(result => result);
    }
    dispatchCommand(ev) {
        this.handleThrottle(ev.invoker);
        this.runHandler.forEach(handle => handle({ ...ev }));
    }
}
exports.BaseCommand = BaseCommand;
