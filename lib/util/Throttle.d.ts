/// <reference types="node" />
import { TeamSpeakClient } from "./types";
export declare class Throttle {
    private throttled;
    private penalty;
    private initial;
    private restore;
    private tickrate;
    stop(): this;
    /**
     * Defines how fast points will get restored
     * @param duration time in ms how fast points should get restored
     */
    tickRate(duration: number): this;
    /**
     * The amount of points a command request costs
     * @param amount the amount of points that should be reduduced
     */
    penaltyPerCommand(amount: number): this;
    /**
     * The Amount of Points that should get restored per tick
     * @param amount the amount that should get restored
     */
    restorePerTick(amount: number): this;
    /**
     * Sets the initial Points a user has at beginning
     * @param initial the Initial amount of Points a user has
     */
    initialPoints(initial: number): this;
    /**
     * Reduces the given points for a Command for the given Client
     * @param client the client which points should be removed
     */
    throttle(client: TeamSpeakClient): boolean;
    /**
     * Restores points from the given id
     * @param id the identifier for which the points should be stored
     */
    private restorePoints;
    /**
     * Resets the timeout counter for a stored id
     * @param id the identifier which should be added
     */
    private refreshTimeout;
    /**
     * Removes points from an id
     * @param id the identifier which should be added
     */
    private reducePoints;
    /**
     * creates the identifier in the throttled object
     * @param id the identifier which should be added
     */
    private createIdIfNotExists;
    /**
     * Checks if the given Client is affected by throttle limitations
     * @param client the TeamSpeak Client which should get checked
     */
    isThrottled(client: TeamSpeakClient): boolean;
    /**
     * retrieves the time in milliseconds until a client can send his next command
     * @param client the client which should be checked
     * @returns returns the time a client is throttled in ms
     */
    timeTillNextCommand(client: TeamSpeakClient): number;
}
export declare namespace Throttle {
    interface ThrottleInterface {
        points: number;
        next: number;
        timeout?: NodeJS.Timeout;
    }
}
