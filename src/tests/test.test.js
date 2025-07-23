import { add } from "../modules/add.js";

test("adds 1 + 1 to equal 2", () => {
	expect(add(1, 1)).toBe(2);
});
