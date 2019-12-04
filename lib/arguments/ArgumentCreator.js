"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StringArgument_1 = require("../arguments/StringArgument");
const NumberArgument_1 = require("../arguments/NumberArgument");
const RestArgument_1 = require("../arguments/RestArgument");
const ClientArgument_1 = require("../arguments/ClientArgument");
const GroupArgument_1 = require("./GroupArgument");
/** creates new object with argument options */
function createArgumentLayer() {
    return {
        string: new StringArgument_1.StringArgument(),
        number: new NumberArgument_1.NumberArgument(),
        client: new ClientArgument_1.ClientArgument(),
        rest: new RestArgument_1.RestArgument(),
        or: new GroupArgument_1.GroupArgument(GroupArgument_1.GroupArgument.Type.OR),
        and: new GroupArgument_1.GroupArgument(GroupArgument_1.GroupArgument.Type.AND),
    };
}
exports.createArgumentLayer = createArgumentLayer;
