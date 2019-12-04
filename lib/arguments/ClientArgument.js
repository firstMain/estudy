"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Argument_1 = require("./Argument");
const ParseError_1 = require("../exceptions/ParseError");
class ClientArgument extends Argument_1.Argument {
    /**
     * Tries to validate a TeamSpeak Client URL or UID
     * @param args the input from where the client gets extracted
     */
    validate(args) {
        const match = args.match(/^(\[URL=client:\/\/\d*\/(?<url_uid>[\/+a-z0-9]{27}=)~.*\].*\[\/URL\]|(?<uid>[\/+a-z0-9]{27}=)) *(?<rest>.*)$/i);
        if (!match || !match.groups)
            throw new ParseError_1.ParseError("Client not found!", this);
        return [match.groups.url_uid || match.groups.uid, match.groups.rest];
    }
}
exports.ClientArgument = ClientArgument;
