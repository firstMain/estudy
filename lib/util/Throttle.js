"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Throttle {
    constructor() {
        this.throttled = {};
        this.penalty = 1;
        this.initial = 1;
        this.restore = 1;
        this.tickrate = 1000;
    }
    /* clears all timers */
    stop() {
        Object.values(this.throttled)
            .forEach(({ timeout }) => clearTimeout(timeout));
        return this;
    }
    /**
     * Defines how fast points will get restored
     * @param duration time in ms how fast points should get restored
     */
    tickRate(duration) {
        this.tickrate = duration;
        return this;
    }
    /**
     * The amount of points a command request costs
     * @param amount the amount of points that should be reduduced
     */
    penaltyPerCommand(amount) {
        this.penalty = amount;
        return this;
    }
    /**
     * The Amount of Points that should get restored per tick
     * @param amount the amount that should get restored
     */
    restorePerTick(amount) {
        this.restore = amount;
        return this;
    }
    /**
     * Sets the initial Points a user has at beginning
     * @param initial the Initial amount of Points a user has
     */
    initialPoints(initial) {
        this.initial = initial;
        return this;
    }
    /**
     * Reduces the given points for a Command for the given Client
     * @param client the client which points should be removed
     */
    throttle(client) {
        this.reducePoints(client.uniqueIdentifier);
        return this.isThrottled(client);
    }
    /**
     * Restores points from the given id
     * @param id the identifier for which the points should be stored
     */
    restorePoints(id) {
        const throttle = this.throttled[id];
        if (throttle === undefined)
            return;
        throttle.points += this.restore;
        if (throttle.points >= this.initial) {
            Reflect.deleteProperty(this.throttled, id);
        }
        else {
            this.refreshTimeout(id);
        }
    }
    /**
     * Resets the timeout counter for a stored id
     * @param id the identifier which should be added
     */
    refreshTimeout(id) {
        if (this.throttled[id] === undefined)
            return;
        clearTimeout(this.throttled[id].timeout);
        this.throttled[id].timeout = setTimeout(this.restorePoints.bind(this, id), this.tickrate);
        this.throttled[id].next = Date.now() + this.tickrate;
    }
    /**
     * Removes points from an id
     * @param id the identifier which should be added
     */
    reducePoints(id) {
        const throttle = this.createIdIfNotExists(id);
        throttle.points -= this.penalty;
        this.refreshTimeout(id);
    }
    /**
     * creates the identifier in the throttled object
     * @param id the identifier which should be added
     */
    createIdIfNotExists(id) {
        if (Object.keys(this.throttled).includes(id))
            return this.throttled[id];
        this.throttled[id] = { points: this.initial, next: 0 };
        return this.throttled[id];
    }
    /**
     * Checks if the given Client is affected by throttle limitations
     * @param client the TeamSpeak Client which should get checked
     */
    isThrottled(client) {
        const throttle = this.throttled[client.uniqueIdentifier];
        if (throttle === undefined)
            return false;
        return throttle.points <= 0;
    }
    /**
     * retrieves the time in milliseconds until a client can send his next command
     * @param client the client which should be checked
     * @returns returns the time a client is throttled in ms
     */
    timeTillNextCommand(client) {
        if (this.throttled[client.uniqueIdentifier] === undefined)
            return 0;
        return this.throttled[client.uniqueIdentifier].next - Date.now();
    }
}
exports.Throttle = Throttle;
