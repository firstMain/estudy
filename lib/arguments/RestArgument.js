"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StringArgument_1 = require("./StringArgument");
class RestArgument extends StringArgument_1.StringArgument {
    /**
     * Validates the given String to the RestArgument
     * @param args the remaining args
     */
    validate(args) {
        return super._validate(args, "");
    }
}
exports.RestArgument = RestArgument;
