import { Argument } from "./Argument";
export declare class ClientArgument extends Argument {
    /**
     * Tries to validate a TeamSpeak Client URL or UID
     * @param args the input from where the client gets extracted
     */
    validate(args: string): string[];
}
