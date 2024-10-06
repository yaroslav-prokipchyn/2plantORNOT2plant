import { add } from "./temp_file.ts";

describe('test', () => {
    it('adds 1 + 2 to equal 3', () => {
        expect(add(2, 4)).toBe(6);
    });
});
