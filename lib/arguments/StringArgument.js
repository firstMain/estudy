"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Argument_1 = require("./Argument");
const ParseError_1 = require("../exceptions/ParseError");
class StringArgument extends Argument_1.Argument {
    constructor() {
        super(...arguments);
        this.regex = null;
        this.maxlen = null;
        this.minlen = null;
        this.whitelist = null;
        this.uppercase = false;
        this.lowercase = false;
    }
    /**
     * Validates the given String to the StringArgument
     * @param args the remaining args
     */
    validate(args) {
        const argArray = args.split(" ");
        const str = argArray.shift();
        return this._validate(str, argArray.join(" "));
    }
    /**
     * Validates the given string to the StringArgument params
     * @param arg string argument that should be parsed
     * @param rest the remaining args
     */
    _validate(arg, ...rest) {
        if (this.uppercase)
            arg = arg.toUpperCase();
        if (this.lowercase)
            arg = arg.toLowerCase();
        if (this.minlen !== null && this.minlen > arg.length)
            throw new ParseError_1.ParseError(`String length not greater or equal! Expected at least ${this.minlen}, but got ${arg.length}`, this);
        if (this.maxlen !== null && this.maxlen < arg.length)
            throw new ParseError_1.ParseError(`String length not less or equal! Maximum ${this.maxlen} chars allowed, but got ${arg.length}`, this);
        if (this.whitelist !== null && !this.whitelist.includes(arg))
            throw new ParseError_1.ParseError(`Invalid Input for ${arg}. Allowed words: ${this.whitelist.join(", ")}`, this);
        if (this.regex !== null && !this.regex.test(arg))
            throw new ParseError_1.ParseError(`Regex missmatch, the input '${arg}' did not match the expression ${this.regex.toString()}`, this);
        return [arg, ...rest];
    }
    /**
     * Matches a regular expression pattern
     * @param regex the regex which should be validated
     */
    match(regex) {
        this.regex = regex;
        return this;
    }
    /**
     * Sets the maximum Length of the String
     * @param len the maximum length of the argument
     */
    maximum(len) {
        this.maxlen = len;
        return this;
    }
    /**
     * Sets the minimum Length of the String
     * @param len the minimum length of the argument
     */
    minimum(len) {
        this.minlen = len;
        return this;
    }
    /** converts the input to an upper case string */
    forceUpperCase() {
        this.lowercase = false;
        this.uppercase = true;
        return this;
    }
    /** converts the input to a lower case string */
    forceLowerCase() {
        this.lowercase = true;
        this.uppercase = false;
        return this;
    }
    /**
     * creates a list of available whitelisted words
     * @param words array of whitelisted words
     */
    allow(words) {
        if (!Array.isArray(this.whitelist))
            this.whitelist = [];
        this.whitelist.push(...words);
        return this;
    }
}
exports.StringArgument = StringArgument;
