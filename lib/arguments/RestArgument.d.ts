import { StringArgument } from "./StringArgument";
export declare class RestArgument extends StringArgument {
    /**
     * Validates the given String to the RestArgument
     * @param args the remaining args
     */
    validate(args: string): string[];
}
