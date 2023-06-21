import { validateField } from "../../common/functions";

describe("validateField", () => {
	it("returns true when the value matches the regex", () => {
		const value = "abc123";
		const regex = /^[a-z0-9]+$/i;
		const result = validateField(value, regex);
		expect(result).toBe(true);
	});

	it("returns false when the value does not match the regex", () => {
		const value = "abc$123";
		const regex = /^[a-z0-9]+$/i;
		const result = validateField(value, regex);
		expect(result).toBe(false);
	});

	it("returns true when the regex allows an empty value", () => {
		const value = "";
		const regex = /^.*$/; // Match anything, including an empty string
		const result = validateField(value, regex);
		expect(result).toBe(true);
	});

	it("returns false when the regex does not allow an empty value", () => {
		const value = "";
		const regex = /^.+/; // Match anything that is not an empty string
		const result = validateField(value, regex);
		expect(result).toBe(false);
	});
});
