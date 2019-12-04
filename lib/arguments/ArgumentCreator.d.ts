import { StringArgument } from "../arguments/StringArgument";
import { NumberArgument } from "../arguments/NumberArgument";
import { RestArgument } from "../arguments/RestArgument";
import { ClientArgument } from "../arguments/ClientArgument";
import { Argument } from "../arguments/Argument";
import { GroupArgument } from "./GroupArgument";
export interface ArgType {
    string: StringArgument;
    number: NumberArgument;
    client: ClientArgument;
    rest: RestArgument;
    or: GroupArgument;
    and: GroupArgument;
}
export declare type createArgumentHandler = (arg: ArgType) => Argument;
/** creates new object with argument options */
export declare function createArgumentLayer(): ArgType;
