import { Argument } from "./Argument";
export declare class NumberArgument extends Argument {
    private min;
    private max;
    private int;
    private forcePositive;
    private forceNegative;
    /**
     * Validates the given Number to the Object
     * @param args the remaining args
     */
    validate(args: string): (string | number)[];
    /**
     * specifies the minimum value
     * @param min the minimum length of the argument
     */
    minimum(min: number): this;
    /**
     * specifies the maximum value
     * @param {number} max the maximum length of the argument
     */
    maximum(max: number): this;
    /** specifies that the Number must be an integer (no floating point) */
    integer(): this;
    /** specifies that the Number must be a positive Number */
    positive(): this;
    /** specifies that the Number must be a negative Number */
    negative(): this;
}
