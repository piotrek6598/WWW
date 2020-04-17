import { expect } from "chai";
import "mocha";
import {fib} from "./fib";

describe("Fibonacci", () => {
    it("should equal 0 for call with 0", () => {
        expect(fib(0)).to.equal(0);
    });
    it("should equal 55 for call with 10", () => {
        expect(fib(10)).to.equal(55);
    });
    it("should equal 6765 for call with 20", () => {
        expect(fib(20)).to.equal(6765);
    });
});