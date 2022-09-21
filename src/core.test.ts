import { ensureArray } from "./core";

describe("Ensuring an array", () => {
  it("should return an empty array as it is", () => {
    const testArray: number[] = [];

    expect(ensureArray(testArray)).toBe(testArray);
  });

  it("should return a non-empty array as it is", () => {
    const testArray = [90, 92, 95];

    expect(ensureArray(testArray)).toBe(testArray);
  });

  it("should turn a number into an array", () => {
    expect(ensureArray(90)).toEqual([90]);
  });

  it("should turn an object into an array with the object itself", () => {
    const bear = { name: "Yogi", age: 36 };

    const actualArray = ensureArray(bear);

    expect(actualArray).toEqual([bear]);
    expect(actualArray[0]).toBe(bear);
  });
});
